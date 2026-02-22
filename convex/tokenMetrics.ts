import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const record = mutation({
  args: {
    model: v.string(),
    requestType: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    totalTokens: v.number(),
    durationMs: v.optional(v.number()),
    status: v.string(),
    sessionKey: v.optional(v.string()),
    costUsd: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tokenMetrics", {
      ...args,
      createdAt: args.createdAt ?? Date.now(),
    });
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    return await ctx.db.query("tokenMetrics").order("desc").take(limit);
  },
});

export const summary = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = args.days
      ? await ctx.db
          .query("tokenMetrics")
          .withIndex("by_createdAt", (query) =>
            query.gte("createdAt", Date.now() - args.days! * 24 * 60 * 60 * 1000),
          )
          .collect()
      : await ctx.db.query("tokenMetrics").collect();
    return rows.reduce(
      (acc, row) => {
        acc.requests += 1;
        acc.inputTokens += row.inputTokens;
        acc.outputTokens += row.outputTokens;
        acc.totalTokens += row.totalTokens;
        acc.costUsd += row.costUsd ?? 0;
        return acc;
      },
      { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0 },
    );
  },
});

export const byModel = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = args.days
      ? await ctx.db
          .query("tokenMetrics")
          .withIndex("by_createdAt", (query) =>
            query.gte("createdAt", Date.now() - args.days! * 24 * 60 * 60 * 1000),
          )
          .collect()
      : await ctx.db.query("tokenMetrics").collect();
    const map = new Map<string, { model: string; requests: number; totalTokens: number; inputTokens: number; outputTokens: number; costUsd: number }>();

    for (const row of rows) {
      const current = map.get(row.model) ?? {
        model: row.model,
        requests: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        costUsd: 0,
      };
      current.requests += 1;
      current.totalTokens += row.totalTokens;
      current.inputTokens += row.inputTokens;
      current.outputTokens += row.outputTokens;
      current.costUsd += row.costUsd ?? 0;
      map.set(row.model, current);
    }

    return Array.from(map.values()).sort((a, b) => b.totalTokens - a.totalTokens);
  },
});
