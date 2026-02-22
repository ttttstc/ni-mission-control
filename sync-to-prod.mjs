import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient("https://colorful-llama-143.convex.cloud");

async function seed() {
  console.log("🚀 开始同步本地数据到生产环境...");

  // 1. 同步隧道地址
  await client.mutation(api.settings.set, { 
    key: "openclaw_tunnel_url", 
    value: "https://payday-release-option-europe.trycloudflare.com" 
  });
  console.log("✅ 隧道地址已同步");

  // 2. 同步基础 Agent
  await client.mutation(api.agents.create, {
    name: "小泥巴",
    role: "主助手",
    description: "温和、轻松、靠谱的个人助理",
    avatar: "🛠️",
    status: "active",
    capabilities: ["文件管理", "GitHub 协作", "远程控制"]
  });
  console.log("✅ Agent 基础信息已同步");

  // 3. 同步一些示例任务（可选）
  await client.mutation(api.tasks.create, {
    text: "完成 ni-mission-control 生产环境部署",
    status: "in-progress",
    assignee: "assistant",
    createdAt: Date.now()
  });
  console.log("✅ 示例任务已同步");

  console.log("✨ 同步完成！现在刷新 Vercel 页面即可看到数据。");
}

seed().catch(console.error);
