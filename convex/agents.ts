import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    description: v.string(),
    avatar: v.optional(v.string()),
    status: v.string(),
    capabilities: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = (await ctx.db.query("agents").collect()).find(
      (a) => a.name === args.name && a.role === args.role,
    );
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("agents", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
