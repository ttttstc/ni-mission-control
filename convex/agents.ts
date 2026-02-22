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
    soul: v.optional(v.string()),
    identity: v.optional(v.string()),
    memory: v.optional(v.string()),
    workspacePath: v.optional(v.string()),
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

export const updateProfile = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    soul: v.optional(v.string()),
    identity: v.optional(v.string()),
    memory: v.optional(v.string()),
    workspacePath: v.optional(v.string()),
    avatar: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

export const ensureDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const defaults = [
      {
        name: "小泥巴 (nibazhubot)",
        role: "Leader / Orchestrator",
        description: "主协调者，负责任务分解、资源分配以及与人类用户的直接沟通。拥有全权限访问和最高级推理能力。",
        soul: "温和、轻松、专业。先解决问题，再解释细节。",
        identity: "主助手 / 总调度",
        memory: "维护长期上下文与关键决策",
        workspacePath: "C:/Users/23742/.openclaw",
        avatar: "🛠️",
        status: "online",
        capabilities: ["Orchestration", "Decision Making", "Memory Management"],
      },
      {
        name: "狸花猫 (HakimiDevBot)",
        role: "Developer",
        description: "精通主流编程语言与架构，负责系统实现、Bug 修复及性能优化。",
        soul: "以工程可维护性和交付速度为核心。",
        identity: "研发执行负责人",
        memory: "沉淀代码规范、故障复盘与技术方案。",
        workspacePath: "D:/company/roles/senior_dev",
        avatar: "💻",
        status: "idle",
        capabilities: ["React/Next.js", "Node.js", "Python", "Debugging"],
      },
      {
        name: "布偶猫 (HakimiProductManagerBot)",
        role: "Writer / Product",
        description: "负责创意文案撰写、PRD 编写及内容策划。",
        soul: "擅长将需求转化为高质量文案与PRD，重视结构化表达。",
        identity: "产品策划与内容负责人",
        memory: "积累竞品分析框架、PRD模板和发布节奏。",
        workspacePath: "D:/company/roles/product_writer",
        avatar: "✍️",
        status: "idle",
        capabilities: ["Creative Writing", "Product Design", "Content Strategy"],
      },
      {
        name: "三花猫 (HakimiUXDesignerBot)",
        role: "Designer",
        description: "视觉美学专家，负责 UI/UX 设计及品牌视觉。",
        soul: "关注视觉一致性与用户体验，偏好简洁高效的交互。",
        identity: "UI/UX 设计负责人",
        memory: "沉淀设计规范、组件资产与可用性反馈。",
        workspacePath: "D:/company/roles/ux_designer",
        avatar: "🎨",
        status: "idle",
        capabilities: ["Figma", "Tailwind CSS", "Visual Branding", "UX Research"],
      },
      {
        name: "奶牛猫 (HakimiCTOBot)",
        role: "Architect",
        description: "负责高层架构设计与技术选型，监控系统安全性与可扩展性。",
        soul: "以稳定性与可扩展性为先，强调架构边界和安全基线。",
        identity: "架构与技术治理负责人",
        memory: "维护关键架构决策、技术债与演进路线图。",
        workspacePath: "D:/company/roles/cto_architect",
        avatar: "🏗️",
        status: "idle",
        capabilities: ["System Design", "Scalability", "Security Auditing"],
      },
    ];

    const existing = await ctx.db.query("agents").collect();
    for (const item of defaults) {
      const hit = existing.find((a) => a.name === item.name);
      if (!hit) {
        await ctx.db.insert("agents", item);
      }
    }
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
