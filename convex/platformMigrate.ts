import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  adminKeyArg,
  assertPlatformAdmin,
  groupStatusValidator,
  roleValidator,
  tokenPurposeValidator,
  userFields,
  userStatusValidator,
} from "./platformGuard";

const groupDoc = v.object({
  platformId: v.string(),
  code: v.string(),
  name: v.string(),
  description: v.string(),
  status: groupStatusValidator,
  isSeed: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
  createdBy: v.union(v.string(), v.null()),
  updatedBy: v.union(v.string(), v.null()),
  archivedAt: v.union(v.string(), v.null()),
});

const grantDoc = v.object({
  platformId: v.string(),
  groupId: v.string(),
  menuCode: v.string(),
  action: v.string(),
  scope: v.string(),
});

const memberDoc = v.object({
  groupId: v.string(),
  userId: v.string(),
  createdAt: v.string(),
  createdBy: v.union(v.string(), v.null()),
});

const sessionDoc = v.object({
  platformId: v.string(),
  userId: v.string(),
  expiresAt: v.string(),
  revokedAt: v.union(v.string(), v.null()),
  userAgent: v.union(v.string(), v.null()),
  createdAt: v.string(),
});

const tokenDoc = v.object({
  platformId: v.string(),
  userId: v.string(),
  purpose: tokenPurposeValidator,
  tokenHash: v.string(),
  expiresAt: v.string(),
  usedAt: v.union(v.string(), v.null()),
  createdAt: v.string(),
  createdBy: v.union(v.string(), v.null()),
});

const auditDoc = v.object({
  platformId: v.string(),
  actorUserId: v.union(v.string(), v.null()),
  action: v.string(),
  entityType: v.string(),
  entityId: v.union(v.string(), v.null()),
  summary: v.string(),
  metadata: v.string(),
  ip: v.union(v.string(), v.null()),
  createdAt: v.string(),
});

type MigrateDb = {
  query: (table: string) => {
    withIndex: (
      name: string,
      fn: (q: { eq: (field: string, value: string) => unknown }) => unknown,
    ) => { unique: () => Promise<{ _id: string } | null> };
  };
  patch: (id: string, payload: Record<string, unknown>) => Promise<void>;
  insert: (table: string, payload: Record<string, unknown>) => Promise<string>;
};

async function upsertByPlatformId(
  ctx: { db: MigrateDb },
  table:
    | "platformUsers"
    | "platformAuthSessions"
    | "platformAuthTokens"
    | "platformPermissionGroups"
    | "platformPermissionGroupGrants"
    | "platformAuditLogs",
  platformId: string,
  payload: Record<string, unknown>,
) {
  const existing = await ctx.db
    .query(table)
    .withIndex("by_platformId", (q) => q.eq("platformId", platformId))
    .unique();
  if (existing) {
    await ctx.db.patch(existing._id, payload);
    return "updated";
  }
  await ctx.db.insert(table, payload);
  return "inserted";
}

export const importBatch = mutation({
  args: {
    ...adminKeyArg,
    users: v.optional(v.array(v.object(userFields))),
    groups: v.optional(v.array(groupDoc)),
    grants: v.optional(v.array(grantDoc)),
    members: v.optional(v.array(memberDoc)),
    sessions: v.optional(v.array(sessionDoc)),
    tokens: v.optional(v.array(tokenDoc)),
    auditLogs: v.optional(v.array(auditDoc)),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const counts = {
      users: 0,
      groups: 0,
      grants: 0,
      members: 0,
      sessions: 0,
      tokens: 0,
      auditLogs: 0,
    };

    for (const user of args.users ?? []) {
      const emailLower = user.email.trim().toLowerCase();
      const existing = await ctx.db
        .query("platformUsers")
        .withIndex("by_platformId", (q) => q.eq("platformId", user.platformId))
        .unique();
      const passwordHash =
        user.passwordHash == null && existing ? existing.passwordHash : user.passwordHash;
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformUsers", user.platformId, {
        ...user,
        email: user.email.trim(),
        emailLower,
        passwordHash,
      });
      counts.users += 1;
    }

    for (const group of args.groups ?? []) {
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformPermissionGroups", group.platformId, group);
      counts.groups += 1;
    }

    for (const grant of args.grants ?? []) {
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformPermissionGroupGrants", grant.platformId, grant);
      counts.grants += 1;
    }

    for (const member of args.members ?? []) {
      const existing = await ctx.db
        .query("platformPermissionGroupMembers")
        .withIndex("by_group_user", (q) => q.eq("groupId", member.groupId).eq("userId", member.userId))
        .unique();
      if (!existing) {
        await ctx.db.insert("platformPermissionGroupMembers", member);
      }
      counts.members += 1;
    }

    for (const session of args.sessions ?? []) {
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformAuthSessions", session.platformId, session);
      counts.sessions += 1;
    }

    for (const token of args.tokens ?? []) {
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformAuthTokens", token.platformId, token);
      counts.tokens += 1;
    }

    for (const log of args.auditLogs ?? []) {
      await upsertByPlatformId({ db: ctx.db as unknown as MigrateDb }, "platformAuditLogs", log.platformId, log);
      counts.auditLogs += 1;
    }

    return counts;
  },
});

export const counts = query({
  args: { ...adminKeyArg },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const [users, groups, grants, members, sessions, tokens, auditLogs] = await Promise.all([
      ctx.db.query("platformUsers").collect(),
      ctx.db.query("platformPermissionGroups").collect(),
      ctx.db.query("platformPermissionGroupGrants").collect(),
      ctx.db.query("platformPermissionGroupMembers").collect(),
      ctx.db.query("platformAuthSessions").collect(),
      ctx.db.query("platformAuthTokens").collect(),
      ctx.db.query("platformAuditLogs").collect(),
    ]);
    return {
      platformUsers: users.length,
      platformPermissionGroups: groups.length,
      platformPermissionGroupGrants: grants.length,
      platformPermissionGroupMembers: members.length,
      platformAuthSessions: sessions.length,
      platformAuthTokens: tokens.length,
      platformAuditLogs: auditLogs.length,
    };
  },
});

export const listUserEmails = query({
  args: { ...adminKeyArg },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const users = await ctx.db.query("platformUsers").collect();
    return users.map((user) => ({
      id: user.platformId,
      email: user.email,
      role: user.role,
      status: user.status,
      hasPasswordHash: Boolean(user.passwordHash),
    }));
  },
});

void roleValidator;
void userStatusValidator;
