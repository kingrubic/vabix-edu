import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  adminKeyArg,
  assertPlatformAdmin,
  toUserRow,
  userFields,
  userStatusValidator,
  roleValidator,
  tokenPurposeValidator,
  type PlatformUserDoc,
} from "./platformGuard";

function asUser(doc: PlatformUserDoc) {
  return toUserRow(doc);
}

export const getUserByEmail = query({
  args: { ...adminKeyArg, email: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const doc = await ctx.db
      .query("platformUsers")
      .withIndex("by_emailLower", (q) => q.eq("emailLower", args.email.trim().toLowerCase()))
      .unique();
    return doc ? asUser(doc) : null;
  },
});

export const getUserById = query({
  args: { ...adminKeyArg, userId: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const doc = await ctx.db
      .query("platformUsers")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.userId))
      .unique();
    return doc ? asUser(doc) : null;
  },
});

export const getUsersByIds = query({
  args: { ...adminKeyArg, userIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const out = [];
    for (const userId of args.userIds) {
      const doc = await ctx.db
        .query("platformUsers")
        .withIndex("by_platformId", (q) => q.eq("platformId", userId))
        .unique();
      if (doc) out.push(asUser(doc));
    }
    return out;
  },
});

export const listUsers = query({
  args: {
    ...adminKeyArg,
    q: v.optional(v.string()),
    role: v.optional(roleValidator),
    status: v.optional(userStatusValidator),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const limit = args.limit ?? 30;
    const offset = args.offset ?? 0;
    const needle = args.q?.trim().toLowerCase() ?? "";
    const users = await ctx.db.query("platformUsers").collect();
    const filtered = users.filter((user) => {
      if (args.role && user.role !== args.role) return false;
      if (args.status && user.status !== args.status) return false;
      if (needle && !user.name.toLowerCase().includes(needle) && !user.emailLower.includes(needle)) {
        return false;
      }
      return true;
    });
    filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const page = filtered.slice(offset, offset + limit);
    const rows = [];
    for (const user of page) {
      const members = await ctx.db
        .query("platformPermissionGroupMembers")
        .withIndex("by_userId", (q) => q.eq("userId", user.platformId))
        .collect();
      const groupNames: string[] = [];
      for (const member of members) {
        const group = await ctx.db
          .query("platformPermissionGroups")
          .withIndex("by_platformId", (q) => q.eq("platformId", member.groupId))
          .unique();
        if (group && group.status === "active") groupNames.push(group.name);
      }
      rows.push({ ...asUser(user), groups: groupNames.join(", ") });
    }
    return { rows, total: filtered.length, limit, offset };
  },
});

export const countAdmins = query({
  args: { ...adminKeyArg, activeOnly: v.optional(v.boolean()), exceptUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const users = await ctx.db
      .query("platformUsers")
      .withIndex("by_role_status", (q) => q.eq("role", "admin"))
      .collect();
    return users.filter((user) => {
      if (args.exceptUserId && user.platformId === args.exceptUserId) return false;
      if (args.activeOnly && user.status !== "active") return false;
      return true;
    }).length;
  },
});

export const getAuthBundle = query({
  args: { ...adminKeyArg, userId: v.string(), jti: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const session = await ctx.db
      .query("platformAuthSessions")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.jti))
      .unique();
    if (!session) return null;
    const user = await ctx.db
      .query("platformUsers")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.userId))
      .unique();
    if (!user) return null;
    const members = await ctx.db
      .query("platformPermissionGroupMembers")
      .withIndex("by_userId", (q) => q.eq("userId", user.platformId))
      .collect();
    const grants = [];
    for (const member of members) {
      const group = await ctx.db
        .query("platformPermissionGroups")
        .withIndex("by_platformId", (q) => q.eq("platformId", member.groupId))
        .unique();
      if (!group || group.status !== "active") continue;
      const groupGrants = await ctx.db
        .query("platformPermissionGroupGrants")
        .withIndex("by_groupId", (q) => q.eq("groupId", group.platformId))
        .collect();
      for (const grant of groupGrants) {
        grants.push({
          menuCode: grant.menuCode,
          action: grant.action,
          scope: grant.scope,
          groupCode: group.code,
          groupName: group.name,
        });
      }
    }
    return {
      session: {
        id: session.platformId,
        user_id: session.userId,
        expires_at: session.expiresAt,
        revoked_at: session.revokedAt,
      },
      user: asUser(user),
      grants,
    };
  },
});

export const upsertUser = mutation({
  args: {
    ...adminKeyArg,
    user: v.object(userFields),
    keepExistingHashIfIncomingNull: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const emailLower = args.user.email.trim().toLowerCase();
    const byEmail = await ctx.db
      .query("platformUsers")
      .withIndex("by_emailLower", (q) => q.eq("emailLower", emailLower))
      .unique();
    if (byEmail && byEmail.platformId !== args.user.platformId) {
      throw new Error("Email đã được sử dụng.");
    }
    const existing = await ctx.db
      .query("platformUsers")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.user.platformId))
      .unique();
    const passwordHash =
      args.keepExistingHashIfIncomingNull && existing && args.user.passwordHash == null
        ? existing.passwordHash
        : args.user.passwordHash;
    const payload: PlatformUserDoc = {
      ...args.user,
      email: args.user.email.trim(),
      emailLower,
      passwordHash,
      mustChangePassword: args.user.mustChangePassword ?? existing?.mustChangePassword ?? false,
    };
    if (existing) {
      const { platformId: _platformId, ...patch } = payload;
      void _platformId;
      await ctx.db.patch(existing._id, patch);
      return existing.platformId;
    }
    await ctx.db.insert("platformUsers", payload);
    return payload.platformId;
  },
});

export const touchLastLogin = mutation({
  args: { ...adminKeyArg, userId: v.string(), at: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const user = await ctx.db
      .query("platformUsers")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.userId))
      .unique();
    if (!user) return;
    await ctx.db.patch(user._id, { lastLoginAt: args.at, updatedAt: args.at });
  },
});

export const updatePassword = mutation({
  args: {
    ...adminKeyArg,
    userId: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    activatePending: v.optional(v.boolean()),
    forceActive: v.optional(v.boolean()),
    at: v.string(),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const user = await ctx.db
      .query("platformUsers")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.userId))
      .unique();
    if (!user) throw new Error("Không tìm thấy tài khoản.");
    let status = user.status;
    if (args.forceActive) status = "active";
    else if (args.activatePending && user.status === "pending") status = "active";
    await ctx.db.patch(user._id, {
      passwordHash: args.passwordHash,
      name: args.name && args.name.trim() ? args.name.trim() : user.name,
      status,
      mustChangePassword: false,
      updatedAt: args.at,
    });
  },
});

export const createSession = mutation({
  args: {
    ...adminKeyArg,
    platformId: v.string(),
    userId: v.string(),
    expiresAt: v.string(),
    userAgent: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    await ctx.db.insert("platformAuthSessions", {
      platformId: args.platformId,
      userId: args.userId,
      expiresAt: args.expiresAt,
      revokedAt: null,
      userAgent: args.userAgent ?? "",
      createdAt: args.createdAt,
    });
    return args.platformId;
  },
});

export const revokeSession = mutation({
  args: { ...adminKeyArg, jti: v.string(), at: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const session = await ctx.db
      .query("platformAuthSessions")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.jti))
      .unique();
    if (!session || session.revokedAt) return;
    await ctx.db.patch(session._id, { revokedAt: args.at });
  },
});

export const revokeUserSessions = mutation({
  args: { ...adminKeyArg, userId: v.string(), exceptJti: v.optional(v.string()), at: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const sessions = await ctx.db
      .query("platformAuthSessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const session of sessions) {
      if (session.revokedAt) continue;
      if (args.exceptJti && session.platformId === args.exceptJti) continue;
      await ctx.db.patch(session._id, { revokedAt: args.at });
    }
  },
});

export const createToken = mutation({
  args: {
    ...adminKeyArg,
    platformId: v.string(),
    userId: v.string(),
    purpose: tokenPurposeValidator,
    tokenHash: v.string(),
    expiresAt: v.string(),
    createdAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    await ctx.db.insert("platformAuthTokens", {
      platformId: args.platformId,
      userId: args.userId,
      purpose: args.purpose,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      usedAt: null,
      createdAt: args.createdAt,
      createdBy: args.createdBy,
    });
    return args.platformId;
  },
});

export const findValidToken = query({
  args: {
    ...adminKeyArg,
    tokenHash: v.string(),
    purpose: tokenPurposeValidator,
    now: v.string(),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const token = await ctx.db
      .query("platformAuthTokens")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();
    if (!token || token.purpose !== args.purpose || token.usedAt || token.expiresAt <= args.now) {
      return null;
    }
    return { id: token.platformId, user_id: token.userId };
  },
});

export const markTokenUsed = mutation({
  args: { ...adminKeyArg, tokenId: v.string(), at: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const token = await ctx.db
      .query("platformAuthTokens")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.tokenId))
      .unique();
    if (!token) return;
    await ctx.db.patch(token._id, { usedAt: args.at });
  },
});
