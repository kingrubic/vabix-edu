import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  adminKeyArg,
  assertPlatformAdmin,
  groupStatusValidator,
} from "./platformGuard";

export const listUserGrants = query({
  args: { ...adminKeyArg, userId: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const members = await ctx.db
      .query("platformPermissionGroupMembers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const grants = [];
    const codes: string[] = [];
    const groupIds: string[] = [];
    for (const member of members) {
      groupIds.push(member.groupId);
      const group = await ctx.db
        .query("platformPermissionGroups")
        .withIndex("by_platformId", (q) => q.eq("platformId", member.groupId))
        .unique();
      if (!group || group.status !== "active") continue;
      codes.push(group.code);
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
    return { grants, codes, groupIds };
  },
});

export const listGroups = query({
  args: { ...adminKeyArg },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const groups = await ctx.db.query("platformPermissionGroups").collect();
    groups.sort((a, b) => a.name.localeCompare(b.name));
    const rows = [];
    for (const group of groups) {
      const members = await ctx.db
        .query("platformPermissionGroupMembers")
        .withIndex("by_groupId", (q) => q.eq("groupId", group.platformId))
        .collect();
      rows.push({
        id: group.platformId,
        code: group.code,
        name: group.name,
        description: group.description,
        status: group.status,
        is_seed: group.isSeed ? 1 : 0,
        created_at: group.createdAt,
        updated_at: group.updatedAt,
        created_by: group.createdBy,
        updated_by: group.updatedBy,
        archived_at: group.archivedAt,
        member_count: members.length,
      });
    }
    return rows;
  },
});

export const getGroup = query({
  args: { ...adminKeyArg, groupId: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const group = await ctx.db
      .query("platformPermissionGroups")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.groupId))
      .unique();
    if (!group) return null;
    const grants = await ctx.db
      .query("platformPermissionGroupGrants")
      .withIndex("by_groupId", (q) => q.eq("groupId", group.platformId))
      .collect();
    const members = await ctx.db
      .query("platformPermissionGroupMembers")
      .withIndex("by_groupId", (q) => q.eq("groupId", group.platformId))
      .collect();
    const memberRows = [];
    for (const member of members) {
      const user = await ctx.db
        .query("platformUsers")
        .withIndex("by_platformId", (q) => q.eq("platformId", member.userId))
        .unique();
      if (user) memberRows.push({ id: user.platformId, name: user.name, email: user.email });
    }
    return {
      id: group.platformId,
      code: group.code,
      name: group.name,
      description: group.description,
      status: group.status,
      is_seed: group.isSeed ? 1 : 0,
      grants: grants.map((grant) => ({
        menu_code: grant.menuCode,
        action: grant.action,
        scope: grant.scope,
      })),
      members: memberRows,
    };
  },
});

export const upsertGroup = mutation({
  args: {
    ...adminKeyArg,
    platformId: v.string(),
    code: v.string(),
    name: v.string(),
    description: v.string(),
    status: groupStatusValidator,
    isSeed: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
    updatedBy: v.union(v.string(), v.null()),
    archivedAt: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const existing = await ctx.db
      .query("platformPermissionGroups")
      .withIndex("by_platformId", (q) => q.eq("platformId", args.platformId))
      .unique();
    const byCode = await ctx.db
      .query("platformPermissionGroups")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
    if (byCode && byCode.platformId !== args.platformId) {
      throw new Error("Mã nhóm quyền đã tồn tại.");
    }
    const payload = {
      platformId: args.platformId,
      code: args.code,
      name: args.name,
      description: args.description,
      status: args.status,
      isSeed: args.isSeed ?? existing?.isSeed ?? false,
      createdAt: existing?.createdAt ?? args.createdAt,
      updatedAt: args.updatedAt,
      createdBy: existing?.createdBy ?? args.createdBy,
      updatedBy: args.updatedBy,
      archivedAt: args.archivedAt,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("platformPermissionGroups", payload);
    }
    return args.platformId;
  },
});

export const replaceGrants = mutation({
  args: {
    ...adminKeyArg,
    groupId: v.string(),
    grants: v.array(
      v.object({
        platformId: v.string(),
        menuCode: v.string(),
        action: v.string(),
        scope: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const existing = await ctx.db
      .query("platformPermissionGroupGrants")
      .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
      .collect();
    for (const grant of existing) {
      await ctx.db.delete(grant._id);
    }
    for (const grant of args.grants) {
      await ctx.db.insert("platformPermissionGroupGrants", {
        platformId: grant.platformId,
        groupId: args.groupId,
        menuCode: grant.menuCode,
        action: grant.action,
        scope: grant.scope,
      });
    }
  },
});

export const setUserGroups = mutation({
  args: {
    ...adminKeyArg,
    userId: v.string(),
    groupIds: v.array(v.string()),
    createdAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const existing = await ctx.db
      .query("platformPermissionGroupMembers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const member of existing) {
      await ctx.db.delete(member._id);
    }
    for (const groupId of args.groupIds) {
      await ctx.db.insert("platformPermissionGroupMembers", {
        groupId,
        userId: args.userId,
        createdAt: args.createdAt,
        createdBy: args.createdBy,
      });
    }
  },
});

export const groupMemberCount = query({
  args: { ...adminKeyArg, groupId: v.string() },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const members = await ctx.db
      .query("platformPermissionGroupMembers")
      .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
      .collect();
    return members.length;
  },
});
