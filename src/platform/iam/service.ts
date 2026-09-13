import { getDb, nowIso, newId, tx } from "@/platform/db/client";
import { writeAuditAsync } from "@/platform/audit";
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
import { isPlatformConvexConfigured } from "@/platform/convex/client";
import {
  convexCountAdmins,
  convexCreateToken,
  convexGetGroup,
  convexGroupMemberCount,
  convexListGroups,
  convexListUserGrants,
  convexListUsers,
  convexReplaceGrants,
  convexSetUserGroups,
  convexUpsertGroup,
  convexUpsertUser,
} from "@/platform/convex/repo";

function forbidModIdentity(actor: Actor) {
  if (actor.role !== "admin") {
    const error = new Error("FORBIDDEN") as Error & { code: string };
    error.code = "FORBIDDEN";
    throw error;
  }
}

export async function listDepartments() {
  const rows = getDb()
    .prepare(
      `SELECT d.*
       FROM departments d
       ORDER BY d.name`,
    )
    .all() as Array<Record<string, unknown> & { id: string; name: string; lead_user_id: string | null }>;
  const users = isPlatformConvexConfigured()
    ? (await convexListUsers({ limit: 500, offset: 0 })).rows
    : [];
  const byId = new Map(users.map((user) => [user.id, user]));
  return rows.map((row) => {
    const lead = row.lead_user_id ? byId.get(row.lead_user_id) : undefined;
    const memberCount = users.filter(
      (user) => user.department_id === row.id && user.status !== "archived",
    ).length;
    return {
      ...row,
      lead_name: lead?.name ?? null,
      member_count: memberCount,
    };
  });
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

export async function saveDepartment(actor: Actor, input: {
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
  const id = tx((db) => {
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
      return input.id;
    }
    const created = newId();
    db.prepare(
      `INSERT INTO departments (id, code, name, description, parent_id, lead_user_id, status, created_at, updated_at, created_by, updated_by, archived_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(created, input.code.trim(), input.name.trim(), input.description, input.parentId, input.leadUserId, input.status, at, at, actor.id, actor.id);
    return created;
  });
  await writeAuditAsync({
    actorUserId: actor.id,
    action: input.id ? "department.update" : "department.create",
    entityType: "department",
    entityId: id,
    summary: `${input.id ? "Cập nhật" : "Tạo"} phòng ban ${input.name}.`,
  });
  return id;
}

export async function listUsers(filter: { q?: string; role?: string; status?: string; limit?: number; offset?: number }) {
  const result = await convexListUsers(filter);
  const departments = getDb().prepare(`SELECT id, name FROM departments`).all() as { id: string; name: string }[];
  const deptNames = new Map(departments.map((row) => [row.id, row.name]));
  return {
    ...result,
    rows: result.rows.map((row) => ({
      ...row,
      department_name: row.department_id ? deptNames.get(row.department_id) ?? null : null,
    })),
  };
}

export async function userGroupIds(userId: string) {
  const { groupIds } = await convexListUserGrants(userId);
  return groupIds;
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
  const existing = await findPlatformUserByEmail(email);
  if (existing && existing.id !== input.id) throw new Error("Email đã được sử dụng.");
  if (input.id && (await isLastActiveAdmin(input.id)) && (input.role !== "admin" || input.status !== "active")) {
    throw new Error("Không thể khóa, lưu trữ hoặc hạ quyền Admin cuối cùng.");
  }

  const at = nowIso();
  const id = input.id ?? newId();
  let activation: { token?: string; mail?: string } = {};

  await convexUpsertUser({
    id,
    email,
    name: input.name.trim(),
    role: input.role,
    departmentId: input.departmentId,
    status: input.status,
    updatedAt: at,
    updatedBy: actor.id,
    createdBy: actor.id,
    archivedAt: input.status === "archived" ? at : null,
    keepExistingHashIfIncomingNull: true,
  });
  await convexSetUserGroups(id, input.role === "user" ? input.groupIds : [], actor.id);

  if (input.status === "locked" || input.status === "archived" || input.id) {
    await revokeUserSessions(id);
  }

  if (!input.id && input.invite) {
    const token = randomToken();
    await convexCreateToken({
      userId: id,
      purpose: "activation",
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: actor.id,
    });
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

  await writeAuditAsync({
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
  return Promise.all(
    rows.map(async (row) => {
      const email = row.email.trim().toLowerCase();
      const exists = await findPlatformUserByEmail(email);
      const role = (row.role as PlatformRole) || "user";
      const errors: string[] = [];
      if (!email.includes("@")) errors.push("Email không hợp lệ.");
      if (!row.name.trim()) errors.push("Thiếu họ tên.");
      if (!["admin", "mod", "user"].includes(role)) errors.push("Role không hợp lệ.");
      return { ...row, email, role, exists: Boolean(exists), errors };
    }),
  );
}

export async function listGroups() {
  return convexListGroups();
}

export async function getGroup(id: string) {
  return convexGetGroup(id);
}

export async function saveGroup(
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
  const grants = input.grants.filter((grant) => !isAdminOnlyMenu(grant.menuCode));
  const id = input.id ?? newId();
  if (input.id) {
    const existing = await convexGetGroup(id);
    if (!existing) throw new Error("Không tìm thấy nhóm quyền.");
    await convexGroupMemberCount(id);
  }
  await convexUpsertGroup({
    id,
    code: input.code,
    name: input.name,
    description: input.description,
    status: input.status,
    createdBy: actor.id,
    updatedBy: actor.id,
  });
  await convexReplaceGrants(id, grants);
  await writeAuditAsync({
    actorUserId: actor.id,
    action: input.id ? "group.update" : "group.create",
    entityType: "permission_group",
    entityId: id,
    summary: `${input.id ? "Cập nhật" : "Tạo"} nhóm quyền ${input.name}.`,
  });
  return id;
}

export async function directoryForTasks() {
  const { rows } = await convexListUsers({ status: "active", limit: 500, offset: 0 });
  const departments = getDb().prepare(`SELECT id, name FROM departments`).all() as { id: string; name: string }[];
  const deptNames = new Map(departments.map((row) => [row.id, row.name]));
  return rows
    .map((user) => ({
      id: user.id,
      name: user.name,
      avatar_file_id: user.avatar_file_id,
      department_name: user.department_id ? deptNames.get(user.department_id) ?? null : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function ensureSampleGroups() {
  if (!isPlatformConvexConfigured()) return;
  const existing = await convexListGroups();
  const byCode = new Map(existing.map((group) => [group.code, group]));
  for (const sample of SAMPLE_GROUPS) {
    let group = byCode.get(sample.code);
    if (!group) {
      const id = newId();
      await convexUpsertGroup({
        id,
        code: sample.code,
        name: sample.name,
        description: sample.description,
        status: "active",
        isSeed: true,
      });
      group = { id, code: sample.code, name: sample.name, description: sample.description, status: "active", is_seed: 1, member_count: 0 };
    }
    const current = await convexGetGroup(group.id);
    if (current && current.grants.length > 0) continue;
    await convexReplaceGrants(
      group.id,
      sample.grants
        .filter((grant) => !isAdminOnlyMenu(grant.menu))
        .map((grant) => ({ menuCode: grant.menu, action: grant.action, scope: grant.scope })),
    );
  }
}

export async function bootstrapAdminFromEnv() {
  const email = process.env.PLATFORM_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.PLATFORM_BOOTSTRAP_PASSWORD;
  if (!email || !password) return { created: false, reason: "missing_env" as const };
  if (!isPlatformConvexConfigured()) return { created: false, reason: "missing_env" as const };
  if (await findPlatformUserByEmail(email)) return { created: false, reason: "exists" as const };
  const id = newId();
  const passwordHash = await hashPassword(password);
  await convexUpsertUser({
    id,
    email,
    name: "Quản trị viên",
    passwordHash,
    role: "admin",
    departmentId: null,
    status: "active",
  });
  await writeAuditAsync({
    actorUserId: id,
    action: "user.bootstrap",
    entityType: "user",
    entityId: id,
    summary: "Tạo tài khoản Admin ban đầu từ biến môi trường.",
  });
  return { created: true, reason: "created" as const };
}

export { countActiveAdmins, convexCountAdmins };
