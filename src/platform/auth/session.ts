import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb, nowIso } from "@/platform/db/client";
import type { Actor, Grant } from "@/platform/permissions/evaluate";
import type { DataScope, PermissionAction, PlatformRole } from "@/platform/permissions/registry";
import {
  PLATFORM_SESSION_COOKIE,
  PLATFORM_SESSION_TTL,
  platformCookieOptions,
  signPlatformSession,
  verifyPlatformSession,
  type PlatformClaims,
} from "./jwt";

export {
  PLATFORM_SESSION_COOKIE,
  PLATFORM_SESSION_TTL,
  platformCookieOptions,
  signPlatformSession,
  verifyPlatformSession,
};
export type { PlatformClaims };

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function randomToken() {
  return randomBytes(32).toString("hex");
}

export type PlatformUserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  avatar_file_id: string | null;
  role: PlatformRole;
  department_id: string | null;
  status: "pending" | "active" | "locked" | "archived";
  last_login_at: string | null;
  is_seed: number;
};

export type PlatformActor = Actor & {
  email: string;
  name: string;
  avatarFileId: string | null;
  isSeed: boolean;
  claims: PlatformClaims;
};

function loadGrants(userId: string): Grant[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT g.code AS group_code, g.name AS group_name, gg.menu_code, gg.action, gg.scope
       FROM permission_group_members m
       JOIN permission_groups g ON g.id = m.group_id
       JOIN permission_group_grants gg ON gg.group_id = g.id
       WHERE m.user_id = ? AND g.status = 'active'`,
    )
    .all(userId) as {
    group_code: string;
    group_name: string;
    menu_code: string;
    action: PermissionAction;
    scope: DataScope;
  }[];
  return rows.map((row) => ({
    menuCode: row.menu_code,
    action: row.action,
    scope: row.scope,
    groupCode: row.group_code,
    groupName: row.group_name,
  }));
}

function loadAssignedClassIds(userId: string) {
  const db = getDb();
  const staff = db.prepare(`SELECT class_id FROM lms_class_staff WHERE user_id = ?`).all(userId) as { class_id: string }[];
  const enrolled = db
    .prepare(`SELECT class_id FROM lms_enrollments WHERE user_id = ? AND status IN ('active', 'completed', 'paused')`)
    .all(userId) as { class_id: string }[];
  return [...new Set([...staff, ...enrolled].map((row) => row.class_id))];
}

export function findPlatformUserByEmail(email: string) {
  return (
    (getDb()
      .prepare(`SELECT * FROM users WHERE lower(email) = lower(?)`)
      .get(email) as PlatformUserRow | undefined) ?? null
  );
}

export function findPlatformUserById(id: string) {
  return (getDb().prepare(`SELECT * FROM users WHERE id = ?`).get(id) as PlatformUserRow | undefined) ?? null;
}

export function toActor(user: PlatformUserRow, claims: PlatformClaims): PlatformActor {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarFileId: user.avatar_file_id,
    role: user.role,
    departmentId: user.department_id,
    status: user.status,
    grants: loadGrants(user.id),
    assignedClassIds: loadAssignedClassIds(user.id),
    isSeed: Boolean(user.is_seed),
    claims,
  };
}

export async function getPlatformActor(): Promise<PlatformActor | null> {
  const jar = await cookies();
  const token = jar.get(PLATFORM_SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifyPlatformSession(token);
  if (!claims) return null;
  const session = getDb()
    .prepare(`SELECT revoked_at, expires_at FROM auth_sessions WHERE id = ?`)
    .get(claims.jti) as { revoked_at: string | null; expires_at: string } | undefined;
  if (!session || session.revoked_at || session.expires_at < nowIso()) return null;
  const user = findPlatformUserById(claims.sub);
  if (!user || user.status !== "active") return null;
  return toActor(user, claims);
}

export async function requirePlatformActor() {
  const actor = await getPlatformActor();
  if (!actor) {
    const error = new Error("UNAUTHENTICATED") as Error & { code: string };
    error.code = "UNAUTHENTICATED";
    throw error;
  }
  return actor;
}

export function revokeUserSessions(userId: string, exceptJti?: string) {
  const db = getDb();
  if (exceptJti) {
    db.prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL`).run(
      nowIso(),
      userId,
      exceptJti,
    );
  } else {
    db.prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`).run(nowIso(), userId);
  }
}

export function createSessionRecord(userId: string, jti: string) {
  const expires = new Date(Date.now() + PLATFORM_SESSION_TTL * 1000).toISOString();
  getDb()
    .prepare(
      `INSERT INTO auth_sessions (id, user_id, expires_at, revoked_at, user_agent, created_at) VALUES (?, ?, ?, NULL, '', ?)`,
    )
    .run(jti, userId, expires, nowIso());
}

export function countActiveAdmins(exceptUserId?: string) {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND status = 'active' ${exceptUserId ? "AND id != ?" : ""}`,
    )
    .get(...(exceptUserId ? [exceptUserId] : [])) as { n: number };
  return row.n;
}

export function isLastActiveAdmin(userId: string) {
  const user = findPlatformUserById(userId);
  if (!user || user.role !== "admin" || user.status !== "active") return false;
  return countActiveAdmins(userId) === 0;
}
