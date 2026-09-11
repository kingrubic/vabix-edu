import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import type { StoreShape } from "../src/domain/types";

const STORE_TABLES = [
  "users",
  "organizations",
  "organizationMembers",
  "standardVersions",
  "standardComponents",
  "standardCriteria",
  "criterionAnchors",
  "standardCfsConnections",
  "standardThresholds",
  "assessments",
  "assessmentContexts",
  "componentAssessments",
  "criterionScores",
  "activationAssessments",
  "forceAssessments",
  "cfsConnectionScores",
  "evidenceItems",
  "assessmentSnapshots",
  "improvementExperiments",
  "improvementActions",
  "comments",
  "auditLogs",
  "sharePermissions",
  "revokedSessions",
] as const satisfies ReadonlyArray<keyof StoreShape>;

type StoreTable = (typeof STORE_TABLES)[number];

function stripMeta<T extends Record<string, unknown>>(doc: T) {
  const { _id: _unusedId, _creationTime: _unusedTime, ...rest } = doc;
  void _unusedId;
  void _unusedTime;
  return rest;
}

export const getStore = query({
  args: {},
  handler: async (ctx) => {
    const store = {} as StoreShape;
    for (const table of STORE_TABLES) {
      const docs = await ctx.db.query(table).collect();
      (store as Record<StoreTable, unknown[]>)[table] = docs.map((doc) =>
        stripMeta(doc as unknown as Record<string, unknown>),
      );
    }
    return store;
  },
});

export const isSeeded = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return {
      seeded: Boolean(user),
      userCount: user ? (await ctx.db.query("users").collect()).length : 0,
    };
  },
});

export const replaceStore = mutation({
  args: { store: v.any() },
  handler: async (ctx, { store }) => {
    const payload = store as StoreShape;
    for (const table of STORE_TABLES) {
      const existing = await ctx.db.query(table).collect();
      for (const doc of existing) {
        await ctx.db.delete(doc._id);
      }
      const rows = payload[table] ?? [];
      for (const row of rows) {
        await ctx.db.insert(table as keyof DataModel, row as never);
      }
    }
    return { ok: true as const, users: payload.users?.length ?? 0 };
  },
});
