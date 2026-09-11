import { getDb, nowIso, newId, tx } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";
import { type Actor } from "@/platform/permissions/evaluate";
import { SAMPLE_GROUPS, type DataScope, type PermissionAction, type PlatformRole } from "@/platform/permissions/registry";
import { hashPassword } from "@/security/auth";
import { sendPlatformMail } from "@/platform/mail/send";
import {
  countActiveAdmins,
  findPlatformUserByEmail,
  hashToken,
  isLastActiveAdmin,
  randomToken,
  revokeUserSessions,
} from "@/platform/auth/session";
import { isAdminOnlyMenu } from "@/platform/permissions/registry";

function forbidModIdentity(actor: Actor) {
  if (actor.role !== "admin") {
    const error = new Error("FORBIDDEN") as Error & { code: string };
    error.code = "FORBIDDEN";
    throw error;
  }
}

export function listDepartments() {
  return getDb()
    .prepare(
      `SELECT d.*, u.name AS lead_name,
        (SELECT COUNT(*) FROM users WHERE department_id = d.id AND status != 'archived') AS member_count
       FROM departments d
       LEFT JOIN users u ON u.id = d.lead_user_id
       ORDER BY d.name`,
    )
    .all();
}

function wouldCycle(id: string, parentId: string | null) {
  if (!parentId) return false;
  if (parentId === id) return true;
  let current: string | null = parentId;
  const db = getDb();
  const seen = new Set<string>();
  while (current) {
    if (current === id || seen.has(current)) return true;
    seen.add(current);
    current = (db.prepare(`SELECT parent_id FROM departments WHERE id = ?`).get(current) as { parent_id: string | null } | undefined)
      ?.parent_id ?? null;
  }
  return false;
}

export function saveDepartment(actor: Actor, input: {
  id?: string;
  code: string;
  name: string;
  description: string;
  parentId: string | null;
  leadUserId: string | null;
  status: "active" | "archived";
}) {
  forbidModIdentity(actor);
  if (wouldCycle(input.id ?? "new", input.parentId)) {
    throw new Error("Không thể chọn phòng ban cha tạo vòng lặp.");
  }
  const at = nowIso();
  return tx((db) => {
    if (input.id) {
      db.prepare(
        `UPDATE departments SET code=?, name=?, description=?, parent_id=?, lead_user_id=?, status=?, updated_at=?, updated_by=?, archived_at=? WHERE id=?`,
      ).run(
        input.code.trim(),
        input.name.trim(),
        input.description,
        input.parentId,
        input.leadUserId,
        input.status,
        at,
        actor.id,
        input.status === "archived" ? at : null,
        input.id,
      );
      writeAudit({ actorUserId: actor.id, action: "department.update", entityType: "department", entityId: input.id, summary: `Cập nhật phòng ban ${input.name}.` });
      return input.id;
    }
    const id = newId();
    db.prepare(
      `INSERT INTO departments (id, code, name, description, parent_id, lead_user_id, status, created_at, updated_at, created_by, updated_by, archived_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(id, input.code.trim(), input.name.trim(), input.description, input.parentId, input.leadUserId, input.status, at, at, actor.id, actor.id);
    writeAudit({ actorUserId: actor.id, action: "department.create", entityType: "department", entityId: id, summary: `Tạo phòng ban ${input.name}.` });
    return id;
  });
}

export function listUsers(filter: { q?: string; role?: string; status?: string; limit?: number; offset?: number }) {
  const limit = filter.limit ?? 30;
  const offset = filter.offset ?? 0;
  const where: string[] = ["1=1"];
  const params: unknown[] = [];
  if (filter.q) {
    where.push("(u.name LIKE ? OR u.email LIKE ?)");
    params.push(`%${filter.q}%`, `%${filter.q}%`);
  }
  if (filter.role) {
    where.push("u.role = ?");
    params.push(filter.role);
  }
  if (filter.status) {
    where.push("u.status = ?");
    params.push(filter.status);
  }
  const rows = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.status, u.department_id, u.last_login_at, u.avatar_file_id, u.is_seed,
              d.name AS department_name,
              (SELECT GROUP_CONCAT(g.name, ', ') FROM permission_group_members m JOIN permission_groups g ON g.id = m.group_id WHERE m.user_id = u.id AND g.status='active') AS groups
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       WHERE ${where.join(" AND ")}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset) as Record<string, unknown>[];
  const total = (getDb().prepare(`SELECT COUNT(*) AS n FROM users u WHERE ${where.join(" AND ")}`).get(...params) as { n: number }).n;
  return { rows, total, limit, offset };
}

export function userGroupIds(userId: string) {
  return (getDb().prepare(`SELECT group_id FROM permission_group_members WHERE user_id = ?`).all(userId) as { group_id: string }[]).map(
    (row) => row.group_id,
  );
}

export async function saveUser(
  actor: Actor,
  input: {
    id?: string;
    name: string;
    email: string;
    role: PlatformRole;
    departmentId: string | null;
    groupIds: string[];
    status: "pending" | "active" | "locked" | "archived";
    invite: boolean;
  },
) {
  forbidModIdentity(actor);
  const email = input.email.trim().toLowerCase();
  const existing = findPlatformUserByEmail(email);
  if (existing && existing.id !== input.id) throw new Error("Email đã được sử dụng.");
  if (input.role !== "user" && input.groupIds.length) {
    // groups are for users; ignore extra for admin/mod
  }
  if (input.id && isLastActiveAdmin(input.id) && (input.role !== "admin" || input.status !== "active")) {
    throw new Error("Không thể khóa, lưu trữ hoặc hạ quyền Admin cuối cùng.");
  }

  const at = nowIso();
  const id = input.id ?? newId();
  let activation: { token?: string; mail?: string } = {};

  const db = getDb();
  const apply = db.transaction(() => {
    if (input.id) {
      db.prepare(
        `UPDATE users SET name=?, email=?, role=?, department_id=?, status=?, updated_at=?, updated_by=?, archived_at=? WHERE id=?`,
      ).run(
        input.name.trim(),
        email,
        input.role,
        input.departmentId,
        input.status,
        at,
        actor.id,
        input.status === "archived" ? at : null,
        id,
      );
    } else {
      db.prepare(
        `INSERT INTO users (id, email, name, password_hash, avatar_file_id, role, department_id, status, last_login_at, created_at, updated_at, created_by, updated_by, archived_at, is_seed)
         VALUES (?, ?, ?, NULL, NULL, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, 0)`,
      ).run(id, email, input.name.trim(), input.role, input.departmentId, input.status, at, at, actor.id, actor.id);
    }
    db.prepare(`DELETE FROM permission_group_members WHERE user_id = ?`).run(id);
    if (input.role === "user") {
      for (const groupId of input.groupIds) {
        db.prepare(`INSERT INTO permission_group_members (group_id, user_id, created_at, created_by) VALUES (?, ?, ?, ?)`).run(
          groupId,
          id,
          at,
          actor.id,
        );
      }
    }
  });
  apply();

  if (input.status === "locked" || input.status === "archived" || (input.id && input.role)) {
    revokeUserSessions(id);
  }

  if (!input.id && input.invite) {
    const token = randomToken();
    db.prepare(
      `INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, used_at, created_at, created_by)
       VALUES (?, ?, 'activation', ?, ?, NULL, ?, ?)`,
    ).run(newId(), id, hashToken(token), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), at, actor.id);
    const origin = process.env.PLATFORM_PUBLIC_URL || "";
    const link = `${origin}/dat-lai-mat-khau?token=${token}&activate=1`;
    const mail = await sendPlatformMail({
      to: email,
      subject: "Kích hoạt tài khoản VABIX",
      text: `Bạn được mời sử dụng nền tảng VABIX. Đặt mật khẩu tại: ${link}`,
    });
    activation = {
      token: mail.ok ? undefined : token,
      mail: mail.ok ? "sent" : mail.message,
    };
  }

  writeAudit({
    actorUserId: actor.id,
    action: input.id ? "user.update" : "user.create",
    entityType: "user",
    entityId: id,
    summary: `${input.id ? "Cập nhật" : "Tạo"} tài khoản ${email}.`,
    metadata: { role: input.role, status: input.status, invited: input.invite },
  });
  return { id, activation };
}

export async function importUsersPreview(actor: Actor, rows: { name: string; email: string; role?: string }[]) {
  forbidModIdentity(actor);
  return rows.map((row) => {
    const email = row.email.trim().toLowerCase();
    const exists = findPlatformUserByEmail(email);
    const role = (row.role as PlatformRole) || "user";
    const errors: string[] = [];
    if (!email.includes("@")) errors.push("Email không hợp lệ.");
    if (!row.name.trim()) errors.push("Thiếu họ tên.");
    if (!["admin", "mod", "user"].includes(role)) errors.push("Role không hợp lệ.");
    return { ...row, email, role, exists: Boolean(exists), errors };
  });
}

export function listGroups() {
  return getDb()
    .prepare(
      `SELECT g.*, (SELECT COUNT(*) FROM permission_group_members WHERE group_id = g.id) AS member_count
       FROM permission_groups g ORDER BY g.name`,
    )
    .all();
}

export function getGroup(id: string) {
  const group = getDb().prepare(`SELECT * FROM permission_groups WHERE id = ?`).get(id) as
    | { id: string; code: string; name: string; description: string; status: string; is_seed: number }
    | undefined;
  if (!group) return null;
  const grants = getDb()
    .prepare(`SELECT menu_code, action, scope FROM permission_group_grants WHERE group_id = ?`)
    .all(id) as { menu_code: string; action: PermissionAction; scope: DataScope }[];
  const members = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email FROM permission_group_members m JOIN users u ON u.id = m.user_id WHERE m.group_id = ?`,
    )
    .all(id) as { id: string; name: string; email: string }[];
  return { ...group, grants, members };
}

export function saveGroup(
  actor: Actor,
  input: {
    id?: string;
    code: string;
    name: string;
    description: string;
    status: "active" | "archived";
    grants: { menuCode: string; action: PermissionAction; scope: DataScope }[];
  },
) {
  forbidModIdentity(actor);
  const at = nowIso();
  const grants = input.grants.filter((grant) => !isAdminOnlyMenu(grant.menuCode));
  return tx((db) => {
    const id = input.id ?? newId();
    if (input.id) {
      const existing = db.prepare(`SELECT * FROM permission_groups WHERE id = ?`).get(id) as { status: string } | undefined;
      if (!existing) throw new Error("Không tìm thấy nhóm quyền.");
      const memberCount = (db.prepare(`SELECT COUNT(*) AS n FROM permission_group_members WHERE group_id = ?`).get(id) as { n: number }).n;
      if (input.status === "archived" && memberCount > 0 && existing.status !== "archived") {
        // caller should have confirmed; we still allow archive after warning in UI
      }
      db.prepare(
        `UPDATE permission_groups SET code=?, name=?, description=?, status=?, updated_at=?, updated_by=?, archived_at=? WHERE id=?`,
      ).run(input.code, input.name, input.description, input.status, at, actor.id, input.status === "archived" ? at : null, id);
      db.prepare(`DELETE FROM permission_group_grants WHERE group_id = ?`).run(id);
    } else {
      db.prepare(
        `INSERT INTO permission_groups (id, code, name, description, status, is_seed, created_at, updated_at, created_by, updated_by, archived_at)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, NULL)`,
      ).run(id, input.code, input.name, input.description, input.status, at, at, actor.id, actor.id);
    }
    for (const grant of grants) {
      db.prepare(
        `INSERT INTO permission_group_grants (id, group_id, menu_code, action, scope) VALUES (?, ?, ?, ?, ?)`,
      ).run(newId(), id, grant.menuCode, grant.action, grant.scope);
    }
    writeAudit({
      actorUserId: actor.id,
      action: input.id ? "group.update" : "group.create",
      entityType: "permission_group",
      entityId: id,
      summary: `${input.id ? "Cập nhật" : "Tạo"} nhóm quyền ${input.name}.`,
    });
    return id;
  });
}

export function directoryForTasks() {
  return getDb()
    .prepare(
      `SELECT u.id, u.name, u.avatar_file_id, d.name AS department_name
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       WHERE u.status = 'active'
       ORDER BY u.name`,
    )
    .all();
}

export function ensureSampleGroups() {
  const db = getDb();
  const at = nowIso();
  for (const sample of SAMPLE_GROUPS) {
    const existing = db.prepare(`SELECT id FROM permission_groups WHERE code = ?`).get(sample.code) as { id: string } | undefined;
    if (existing) continue;
    const id = newId();
    db.prepare(
      `INSERT OR IGNORE INTO permission_groups (id, code, name, description, status, is_seed, created_at, updated_at, created_by, updated_by, archived_at)
       VALUES (?, ?, ?, ?, 'active', 1, ?, ?, NULL, NULL, NULL)`,
    ).run(id, sample.code, sample.name, sample.description, at, at);
    const group = db.prepare(`SELECT id FROM permission_groups WHERE code = ?`).get(sample.code) as { id: string };
    const grantCount = (db.prepare(`SELECT COUNT(*) AS n FROM permission_group_grants WHERE group_id = ?`).get(group.id) as { n: number }).n;
    if (grantCount > 0) continue;
    for (const grant of sample.grants) {
      if (isAdminOnlyMenu(grant.menu)) continue;
      db.prepare(`INSERT OR IGNORE INTO permission_group_grants (id, group_id, menu_code, action, scope) VALUES (?, ?, ?, ?, ?)`).run(
        newId(),
        group.id,
        grant.menu,
        grant.action,
        grant.scope,
      );
    }
  }
}

export async function bootstrapAdminFromEnv() {
  const email = process.env.PLATFORM_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.PLATFORM_BOOTSTRAP_PASSWORD;
  if (!email || !password) return { created: false, reason: "missing_env" as const };
  if (findPlatformUserByEmail(email)) return { created: false, reason: "exists" as const };
  const at = nowIso();
  const id = newId();
  const passwordHash = await hashPassword(password);
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO users (id, email, name, password_hash, avatar_file_id, role, department_id, status, last_login_at, created_at, updated_at, created_by, updated_by, archived_at, is_seed)
       VALUES (?, ?, 'Quản trị viên', ?, NULL, 'admin', NULL, 'active', NULL, ?, ?, NULL, NULL, NULL, 0)`,
    )
    .run(id, email, passwordHash, at, at);
  writeAudit({ actorUserId: id, action: "user.bootstrap", entityType: "user", entityId: id, summary: "Tạo tài khoản Admin ban đầu từ biến môi trường." });
  return { created: true, reason: "created" as const };
}

export { countActiveAdmins };
