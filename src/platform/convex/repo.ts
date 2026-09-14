import { nowIso, newId } from "@/platform/db/client";
import type { Grant } from "@/platform/permissions/evaluate";
import type { DataScope, PermissionAction, PlatformRole } from "@/platform/permissions/registry";
import type { PlatformUserRow } from "@/platform/auth/types";
import { platformApi, platformConvex, withAdmin } from "./client";
import { SEED_PLATFORM_USERS, seedUserToConvexPayload, type SeedPlatformUser } from "./seedUsers";

type UserRow = PlatformUserRow & {
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
  archived_at?: string | null;
  groups?: string;
  must_change_password?: boolean;
};

function client() {
  return platformConvex();
}

export async function convexGetUserByEmail(email: string) {
  return (await client().query(platformApi.platformAuth.getUserByEmail, withAdmin({ email }))) as UserRow | null;
}

export async function convexGetUserById(userId: string) {
  return (await client().query(platformApi.platformAuth.getUserById, withAdmin({ userId }))) as UserRow | null;
}

export async function convexGetUsersByIds(userIds: string[]) {
  if (!userIds.length) return [] as UserRow[];
  return (await client().query(platformApi.platformAuth.getUsersByIds, withAdmin({ userIds }))) as UserRow[];
}

export async function convexListUsers(filter: {
  q?: string;
  role?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return (await client().query(
    platformApi.platformAuth.listUsers,
    withAdmin({
      q: filter.q || undefined,
      role: (filter.role as PlatformRole | undefined) || undefined,
      status: filter.status as UserRow["status"] | undefined,
      limit: filter.limit,
      offset: filter.offset,
    }),
  )) as { rows: UserRow[]; total: number; limit: number; offset: number };
}

export async function convexCountAdmins(opts?: { activeOnly?: boolean; exceptUserId?: string }) {
  return (await client().query(platformApi.platformAuth.countAdmins, withAdmin(opts))) as number;
}

export async function convexGetAuthBundle(userId: string, jti: string) {
  return (await client().query(platformApi.platformAuth.getAuthBundle, withAdmin({ userId, jti }))) as {
    session: { id: string; user_id: string; expires_at: string; revoked_at: string | null };
    user: UserRow;
    grants: Grant[];
  } | null;
}

export async function convexUpsertUser(input: {
  id: string;
  email: string;
  name: string;
  passwordHash?: string | null;
  avatarFileId?: string | null;
  role: PlatformRole;
  departmentId: string | null;
  status: UserRow["status"];
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  archivedAt?: string | null;
  isSeed?: boolean;
  mustChangePassword?: boolean;
  keepExistingHashIfIncomingNull?: boolean;
}) {
  const at = nowIso();
  return (await client().mutation(
    platformApi.platformAuth.upsertUser,
    withAdmin({
      keepExistingHashIfIncomingNull: input.keepExistingHashIfIncomingNull ?? true,
      user: {
        platformId: input.id,
        email: input.email,
        name: input.name,
        passwordHash: input.passwordHash ?? null,
        avatarFileId: input.avatarFileId ?? null,
        role: input.role,
        departmentId: input.departmentId,
        status: input.status,
        lastLoginAt: input.lastLoginAt ?? null,
        createdAt: input.createdAt ?? at,
        updatedAt: input.updatedAt ?? at,
        createdBy: input.createdBy ?? null,
        updatedBy: input.updatedBy ?? null,
        archivedAt: input.archivedAt ?? null,
        isSeed: input.isSeed ?? false,
        ...(input.mustChangePassword !== undefined ? { mustChangePassword: input.mustChangePassword } : {}),
      },
    }),
  )) as string;
}

export async function convexTouchLastLogin(userId: string, at = nowIso()) {
  await client().mutation(platformApi.platformAuth.touchLastLogin, withAdmin({ userId, at }));
}

export async function convexUpdatePassword(input: {
  userId: string;
  passwordHash: string;
  name?: string;
  activatePending?: boolean;
  forceActive?: boolean;
}) {
  await client().mutation(
    platformApi.platformAuth.updatePassword,
    withAdmin({ ...input, at: nowIso() }),
  );
}

export async function convexCreateSession(userId: string, jti: string, expiresAt: string) {
  await client().mutation(
    platformApi.platformAuth.createSession,
    withAdmin({
      platformId: jti,
      userId,
      expiresAt,
      userAgent: "",
      createdAt: nowIso(),
    }),
  );
}

export async function convexRevokeSession(jti: string) {
  await client().mutation(platformApi.platformAuth.revokeSession, withAdmin({ jti, at: nowIso() }));
}

export async function convexRevokeUserSessions(userId: string, exceptJti?: string) {
  await client().mutation(
    platformApi.platformAuth.revokeUserSessions,
    withAdmin({ userId, exceptJti, at: nowIso() }),
  );
}

export async function convexCreateToken(input: {
  userId: string;
  purpose: "activation" | "reset";
  tokenHash: string;
  expiresAt: string;
  createdBy?: string | null;
}) {
  const id = newId();
  await client().mutation(
    platformApi.platformAuth.createToken,
    withAdmin({
      platformId: id,
      userId: input.userId,
      purpose: input.purpose,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      createdAt: nowIso(),
      createdBy: input.createdBy ?? null,
    }),
  );
  return id;
}

export async function convexFindValidToken(tokenHash: string, purpose: "activation" | "reset") {
  return (await client().query(
    platformApi.platformAuth.findValidToken,
    withAdmin({ tokenHash, purpose, now: nowIso() }),
  )) as { id: string; user_id: string } | null;
}

export async function convexMarkTokenUsed(tokenId: string) {
  await client().mutation(platformApi.platformAuth.markTokenUsed, withAdmin({ tokenId, at: nowIso() }));
}

export async function convexListUserGrants(userId: string) {
  return (await client().query(platformApi.platformIam.listUserGrants, withAdmin({ userId }))) as {
    grants: Grant[];
    codes: string[];
    groupIds: string[];
  };
}

export async function convexListGroups() {
  return (await client().query(platformApi.platformIam.listGroups, withAdmin())) as Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
    is_seed: number;
    member_count: number;
  }>;
}

export async function convexGetGroup(groupId: string) {
  return (await client().query(platformApi.platformIam.getGroup, withAdmin({ groupId }))) as {
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
    is_seed: number;
    grants: { menu_code: string; action: PermissionAction; scope: DataScope }[];
    members: { id: string; name: string; email: string }[];
  } | null;
}

export async function convexUpsertGroup(input: {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "active" | "archived";
  isSeed?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
}) {
  const at = nowIso();
  await client().mutation(
    platformApi.platformIam.upsertGroup,
    withAdmin({
      platformId: input.id,
      code: input.code,
      name: input.name,
      description: input.description,
      status: input.status,
      isSeed: input.isSeed,
      createdAt: at,
      updatedAt: at,
      createdBy: input.createdBy ?? null,
      updatedBy: input.updatedBy ?? null,
      archivedAt: input.status === "archived" ? at : null,
    }),
  );
}

export async function convexReplaceGrants(
  groupId: string,
  grants: { menuCode: string; action: PermissionAction; scope: DataScope }[],
) {
  await client().mutation(
    platformApi.platformIam.replaceGrants,
    withAdmin({
      groupId,
      grants: grants.map((grant) => ({
        platformId: newId(),
        menuCode: grant.menuCode,
        action: grant.action,
        scope: grant.scope,
      })),
    }),
  );
}

export async function convexSetUserGroups(userId: string, groupIds: string[], createdBy?: string | null) {
  await client().mutation(
    platformApi.platformIam.setUserGroups,
    withAdmin({
      userId,
      groupIds,
      createdAt: nowIso(),
      createdBy: createdBy ?? null,
    }),
  );
}

export async function convexGroupMemberCount(groupId: string) {
  return (await client().query(platformApi.platformIam.groupMemberCount, withAdmin({ groupId }))) as number;
}

export async function convexWriteAudit(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: string;
  ip?: string | null;
}) {
  await client().mutation(
    platformApi.platformAudit.writeAudit,
    withAdmin({
      platformId: newId(),
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary,
      metadata: input.metadata ?? "{}",
      ip: input.ip ?? null,
      createdAt: nowIso(),
    }),
  );
}

export async function convexListAudit(limit = 50, offset = 0) {
  return (await client().query(platformApi.platformAudit.listAudit, withAdmin({ limit, offset }))) as Record<
    string,
    unknown
  >[];
}

export async function convexImportBatch(batch: Record<string, unknown>) {
  return (await client().mutation(platformApi.platformMigrate.importBatch, withAdmin(batch))) as Record<string, number>;
}

export async function convexSeedBuiltinUsers(users: SeedPlatformUser[] = SEED_PLATFORM_USERS) {
  const at = nowIso();
  return convexImportBatch({
    users: users.map((user) => seedUserToConvexPayload(user, at)),
  });
}

export async function mapUserDirectory(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const users = await convexGetUsersByIds(unique);
  return new Map(users.map((user) => [user.id, user]));
}
