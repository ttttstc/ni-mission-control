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
    const all = await ctx.db.query("memories").collect();

    if (q === "") {
      return all.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // 统一走 includes 模糊匹配，确保中文关键词可用
    const hits = all.filter((m) => {
      const inTitle = m.title.includes(q) || m.title.toLowerCase().includes(q.toLowerCase());
      const inCategory = m.category.includes(q) || m.category.toLowerCase().includes(q.toLowerCase());
      const inTags = m.tags.some((t) => t.includes(q) || t.toLowerCase().includes(q.toLowerCase()));
      const inContent = m.content.includes(q) || m.content.toLowerCase().includes(q.toLowerCase());
      return inTitle || inCategory || inTags || inContent;
    });

    return hits.sort((a, b) => b.updatedAt - a.updatedAt);
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
