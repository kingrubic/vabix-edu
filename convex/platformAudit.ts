import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { adminKeyArg, assertPlatformAdmin } from "./platformGuard";

export const writeAudit = mutation({
  args: {
    ...adminKeyArg,
    platformId: v.string(),
    actorUserId: v.union(v.string(), v.null()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.union(v.string(), v.null()),
    summary: v.string(),
    metadata: v.string(),
    ip: v.union(v.string(), v.null()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    await ctx.db.insert("platformAuditLogs", {
      platformId: args.platformId,
      actorUserId: args.actorUserId,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      summary: args.summary,
      metadata: args.metadata,
      ip: args.ip,
      createdAt: args.createdAt,
    });
    return args.platformId;
  },
});

export const listAudit = query({
  args: { ...adminKeyArg, limit: v.optional(v.number()), offset: v.optional(v.number()) },
  handler: async (ctx, args) => {
    assertPlatformAdmin(args.adminKey);
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;
    const rows = await ctx.db.query("platformAuditLogs").collect();
    rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const page = rows.slice(offset, offset + limit);
    const out = [];
    for (const row of page) {
      const actor = row.actorUserId
        ? await ctx.db
            .query("platformUsers")
            .withIndex("by_platformId", (q) => q.eq("platformId", row.actorUserId as string))
            .unique()
        : null;
      out.push({
        id: row.platformId,
        actor_user_id: row.actorUserId,
        action: row.action,
        entity_type: row.entityType,
        entity_id: row.entityId,
        summary: row.summary,
        metadata: row.metadata,
        ip: row.ip,
        created_at: row.createdAt,
        actor_name: actor?.name ?? null,
        actor_email: actor?.email ?? null,
      });
    }
    return out;
  },
});
