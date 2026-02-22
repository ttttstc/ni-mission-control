import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memories").order("desc").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.trim();
    if (q === "") {
      return await ctx.db.query("memories").order("desc").collect();
    }

    const contentMatches = await ctx.db
      .query("memories")
      .withSearchIndex("search_content", (search) => search.search("content", q))
      .collect();

    const all = await ctx.db.query("memories").collect();
    const lower = q.toLowerCase();

    const fuzzyMatches = all.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(lower);
      const inCategory = m.category.toLowerCase().includes(lower);
      const inTags = m.tags.some((t) => t.toLowerCase().includes(lower));
      const inContent = m.content.toLowerCase().includes(lower);
      return inTitle || inCategory || inTags || inContent;
    });

    const merged = new Map(contentMatches.map((m) => [m._id, m]));
    for (const m of fuzzyMatches) merged.set(m._id, m);

    return Array.from(merged.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("memories"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, {
      ...patch,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
