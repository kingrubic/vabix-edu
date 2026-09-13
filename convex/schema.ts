import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * VABIX platform IAM tables. Namespaced so they never collide with MyBizCar
 * tables on prod:accomplished-rabbit-409 (especially `users`).
 *
 * NEVER add a table named `users` (or other MyBizCar names) in this file.
 * Deploying this schema alone to that deployment would drop undeclared tables.
 * Merge these `platform*` tables into the existing Convex project first.
 * See convex/README.md and docs/PLATFORM_CONVEX.md.
 */
export default defineSchema({
  platformUsers: defineTable({
    platformId: v.string(),
    email: v.string(),
    emailLower: v.string(),
    name: v.string(),
    passwordHash: v.union(v.string(), v.null()),
    avatarFileId: v.union(v.string(), v.null()),
    role: v.union(v.literal("admin"), v.literal("mod"), v.literal("user")),
    departmentId: v.union(v.string(), v.null()),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("locked"),
      v.literal("archived"),
    ),
    lastLoginAt: v.union(v.string(), v.null()),
    createdAt: v.string(),
    updatedAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
    updatedBy: v.union(v.string(), v.null()),
    archivedAt: v.union(v.string(), v.null()),
    isSeed: v.boolean(),
  })
    .index("by_platformId", ["platformId"])
    .index("by_emailLower", ["emailLower"])
    .index("by_role_status", ["role", "status"])
    .index("by_departmentId", ["departmentId"]),

  platformAuthSessions: defineTable({
    platformId: v.string(),
    userId: v.string(),
    expiresAt: v.string(),
    revokedAt: v.union(v.string(), v.null()),
    userAgent: v.union(v.string(), v.null()),
    createdAt: v.string(),
  })
    .index("by_platformId", ["platformId"])
    .index("by_userId", ["userId"]),

  platformAuthTokens: defineTable({
    platformId: v.string(),
    userId: v.string(),
    purpose: v.union(v.literal("activation"), v.literal("reset")),
    tokenHash: v.string(),
    expiresAt: v.string(),
    usedAt: v.union(v.string(), v.null()),
    createdAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
  })
    .index("by_platformId", ["platformId"])
    .index("by_tokenHash", ["tokenHash"])
    .index("by_userId", ["userId"]),

  platformPermissionGroups: defineTable({
    platformId: v.string(),
    code: v.string(),
    name: v.string(),
    description: v.string(),
    status: v.union(v.literal("active"), v.literal("archived")),
    isSeed: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
    updatedBy: v.union(v.string(), v.null()),
    archivedAt: v.union(v.string(), v.null()),
  })
    .index("by_platformId", ["platformId"])
    .index("by_code", ["code"]),

  platformPermissionGroupMembers: defineTable({
    groupId: v.string(),
    userId: v.string(),
    createdAt: v.string(),
    createdBy: v.union(v.string(), v.null()),
  })
    .index("by_userId", ["userId"])
    .index("by_groupId", ["groupId"])
    .index("by_group_user", ["groupId", "userId"]),

  platformPermissionGroupGrants: defineTable({
    platformId: v.string(),
    groupId: v.string(),
    menuCode: v.string(),
    action: v.string(),
    scope: v.string(),
  })
    .index("by_platformId", ["platformId"])
    .index("by_groupId", ["groupId"])
    .index("by_group_menu_action", ["groupId", "menuCode", "action"]),

  platformAuditLogs: defineTable({
    platformId: v.string(),
    actorUserId: v.union(v.string(), v.null()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.union(v.string(), v.null()),
    summary: v.string(),
    metadata: v.string(),
    ip: v.union(v.string(), v.null()),
    createdAt: v.string(),
  })
    .index("by_platformId", ["platformId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_entity", ["entityType", "entityId"]),
});
