import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const prod = new ConvexHttpClient("https://colorful-llama-143.convex.cloud");

const rows = [
  { model: "qwen-portal/coder-model", requestType: "chat", inputTokens: 2200, outputTokens: 680, totalTokens: 2880, durationMs: 2100, status: "ok", sessionKey: "agent:nibazhubot:main", costUsd: 0.0012 },
  { model: "openai/gpt-5.2-codex", requestType: "code", inputTokens: 5400, outputTokens: 1300, totalTokens: 6700, durationMs: 4900, status: "ok", sessionKey: "agent:nibazhubot:main", costUsd: 0.0121 },
  { model: "google/gemini-3-pro-preview", requestType: "research", inputTokens: 4200, outputTokens: 1900, totalTokens: 6100, durationMs: 5300, status: "ok", sessionKey: "agent:nibazhubot:cron", costUsd: 0.0062 },
  { model: "qwen-portal/coder-model", requestType: "chat", inputTokens: 1800, outputTokens: 540, totalTokens: 2340, durationMs: 1700, status: "ok", sessionKey: "agent:nibazhubot:main", costUsd: 0.0009 },
];

for (const row of rows) {
  await prod.mutation(api.tokenMetrics.record, row);
}

console.log("✅ tokenMetrics 示例数据已写入生产环境");
