import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const leadFields = {
  type: v.string(),
  name: v.string(),
  company: v.optional(v.string()),
  role: v.optional(v.string()),
  phone: v.string(),
  email: v.string(),
  companySize: v.optional(v.string()),
  need: v.optional(v.string()),
  message: v.optional(v.string()),
  program: v.optional(v.string()),
  eventSlug: v.optional(v.string()),
  source: v.string(),
};

export const submit = mutation({
  args: leadFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(Math.min(args.limit ?? 20, 100));
  },
});
