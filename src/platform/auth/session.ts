import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb, nowIso } from "@/platform/db/client";
import { isPlatformConvexConfigured } from "@/platform/convex/client";
import {
  convexCountAdmins,
  convexCreateSession,
  convexGetAuthBundle,
  convexGetUserByEmail,
  convexGetUserById,
  convexListUserGrants,
  convexRevokeUserSessions,
} from "@/platform/convex/repo";
import type { Grant } from "@/platform/permissions/evaluate";
import {
  PLATFORM_SESSION_COOKIE,
  PLATFORM_SESSION_TTL,
  platformCookieOptions,
  signPlatformSession,
  verifyPlatformSession,
  type PlatformClaims,
} from "./jwt";
import type { PlatformActor, PlatformUserRow } from "./types";

export {
  PLATFORM_SESSION_COOKIE,
  PLATFORM_SESSION_TTL,
  platformCookieOptions,
  signPlatformSession,
  verifyPlatformSession,
};
export type { PlatformClaims, PlatformActor, PlatformUserRow };

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function randomToken() {
  return randomBytes(32).toString("hex");
}

function loadAssignedClassIds(userId: string) {
  const db = getDb();
  const staff = db.prepare(`SELECT class_id FROM lms_class_staff WHERE user_id = ?`).all(userId) as { class_id: string }[];
  const enrolled = db
    .prepare(`SELECT class_id FROM lms_enrollments WHERE user_id = ? AND status IN ('active', 'completed', 'paused')`)
    .all(userId) as { class_id: string }[];
  return [...new Set([...staff, ...enrolled].map((row) => row.class_id))];
}

export async function findPlatformUserByEmail(email: string) {
  if (!isPlatformConvexConfigured()) return null;
  return convexGetUserByEmail(email);
}

export async function findPlatformUserById(id: string) {
  if (!isPlatformConvexConfigured()) return null;
  return convexGetUserById(id);
}

export function toActor(user: PlatformUserRow, claims: PlatformClaims, grants: Grant[] = []): PlatformActor {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarFileId: user.avatar_file_id,
    role: user.role,
    departmentId: user.department_id,
    status: user.status,
    grants,
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
  if (!isPlatformConvexConfigured()) return null;
  const bundle = await convexGetAuthBundle(claims.sub, claims.jti);
  if (!bundle) return null;
  if (bundle.session.revoked_at || bundle.session.expires_at < nowIso()) return null;
  if (bundle.user.status !== "active") return null;
  return toActor(bundle.user, claims, bundle.grants);
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

export async function revokeUserSessions(userId: string, exceptJti?: string) {
  await convexRevokeUserSessions(userId, exceptJti);
}

export async function createSessionRecord(userId: string, jti: string) {
  const expires = new Date(Date.now() + PLATFORM_SESSION_TTL * 1000).toISOString();
  await convexCreateSession(userId, jti, expires);
}

export async function countActiveAdmins(exceptUserId?: string) {
  return convexCountAdmins({ activeOnly: true, exceptUserId });
}

export async function isLastActiveAdmin(userId: string) {
  const user = await findPlatformUserById(userId);
  if (!user || user.role !== "admin" || user.status !== "active") return false;
  return (await countActiveAdmins(userId)) === 0;
}

export async function listUserGroupCodes(userId: string) {
  const { codes } = await convexListUserGrants(userId);
  return codes;
}
