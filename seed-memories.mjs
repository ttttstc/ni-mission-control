import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seed() {
  console.log("Seeding memories...");
  await client.mutation(api.memories.create, {
    title: "OpenClaw 统一工作空间架构",
    content: "本项目采用 Next.js 16 + Convex + Tailwind CSS 构建。整合了任务看板、内容流水线、日历排期和记忆库四大核心模块。采用单一 Convex 部署实现数据实时同步。",
    category: "technical",
    tags: ["nextjs", "convex", "architecture"]
  });
  
  await client.mutation(api.memories.create, {
    title: "用户偏好设置 (ni ni)",
    content: "1. 喜欢简洁的沟通方式。\n2. 偏好使用 Telegram 和飞书进行交互。\n3. 报告需采用 Apple 风格卡片 UI。\n4. 关注黄金、半导体、纳斯达克等投资板块。",
    category: "personal",
    tags: ["preference", "user"]
  });

  console.log("Seeding agents...");
  const agents = [
    {
      name: "狸花猫 (HakimiDevBot)",
      role: "Developer",
      description: "精通主流编程语言与架构，负责系统实现、Bug 修复及性能优化。它是解决复杂技术难题的先锋。",
      status: "idle",
      avatar: "💻",
      capabilities: ["React/Next.js", "Node.js", "Python", "Debugging"]
    },
    {
      name: "布偶猫 (HakimiProductManagerBot)",
      role: "Writer / Product",
      description: "负责创意文案撰写、PRD 编写及内容策划。擅长捕捉市场趋势，将模糊想法具象化为可执行方案。",
      status: "idle",
      avatar: "✍️",
      capabilities: ["Creative Writing", "Product Design", "Content Strategy"]
    },
    {
      name: "三花猫 (HakimiUXDesignerBot)",
      role: "Designer",
      description: "视觉美学专家，负责 UI/UX 设计及品牌视觉。确保每一个交付给用户的界面都符合 Apple 风格的极简美学。",
      status: "idle",
      avatar: "🎨",
      capabilities: ["Figma", "Tailwind CSS", "Visual Branding", "UX Research"]
    },
    {
      name: "奶牛猫 (HakimiCTOBot)",
      role: "Architect",
      description: "负责高层架构设计与技术选型，监控系统安全性与可扩展性。它是团队的技术灯塔。",
      status: "idle",
      avatar: "🏗️",
      capabilities: ["System Design", "Scalability", "Security Auditing"]
    }
  ];

  for (const agent of agents) {
    await client.mutation(api.agents.create, agent);
  }

  console.log("Seeding complete.");
}

seed();
