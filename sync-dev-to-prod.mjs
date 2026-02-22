import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const dev = new ConvexHttpClient("https://robust-reindeer-56.convex.cloud");
const prod = new ConvexHttpClient("https://colorful-llama-143.convex.cloud");

const TUNNEL_URL = "https://payday-release-option-europe.trycloudflare.com";

async function clearAndSync() {
  const [devTasks, devMemories, devContent, devEvents, devAgents] = await Promise.all([
    dev.query(api.tasks.list, {}),
    dev.query(api.memories.list, {}),
    dev.query(api.content.list, {}),
    dev.query(api.events.list, {}),
    dev.query(api.agents.list, {}),
  ]);

  const [prodTasks, prodMemories, prodContent, prodEvents, prodAgents] = await Promise.all([
    prod.query(api.tasks.list, {}),
    prod.query(api.memories.list, {}),
    prod.query(api.content.list, {}),
    prod.query(api.events.list, {}),
    prod.query(api.agents.list, {}),
  ]);

  for (const item of prodTasks) await prod.mutation(api.tasks.remove, { id: item._id });
  for (const item of prodMemories) await prod.mutation(api.memories.remove, { id: item._id });
  for (const item of prodContent) await prod.mutation(api.content.remove, { id: item._id });
  for (const item of prodEvents) await prod.mutation(api.events.remove, { id: item._id });
  for (const item of prodAgents) await prod.mutation(api.agents.remove, { id: item._id });

  for (const item of devTasks) {
    await prod.mutation(api.tasks.create, {
      text: item.text,
      status: item.status,
      assignee: item.assignee,
    });
  }

  for (const item of devMemories) {
    await prod.mutation(api.memories.create, {
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
    });
  }

  for (const item of devContent) {
    const id = await prod.mutation(api.content.create, {
      title: item.title,
      stage: item.stage,
    });
    await prod.mutation(api.content.update, {
      id,
      idea: item.idea,
      script: item.script,
      imageId: item.imageId,
      stage: item.stage,
    });
  }

  for (const item of devEvents) {
    await prod.mutation(api.events.create, {
      title: item.title,
      description: item.description,
      time: item.time,
      type: item.type,
      status: item.status,
    });
  }

  for (const item of devAgents) {
    await prod.mutation(api.agents.create, {
      name: item.name,
      role: item.role,
      description: item.description,
      avatar: item.avatar,
      status: item.status,
      capabilities: item.capabilities,
    });
  }

  await prod.mutation(api.settings.set, {
    key: "openclaw_tunnel_url",
    value: TUNNEL_URL,
  });

  console.log("✅ 已完成 dev -> prod 全量同步");
}

clearAndSync().catch((e) => {
  console.error("❌ 同步失败", e);
  process.exit(1);
});
