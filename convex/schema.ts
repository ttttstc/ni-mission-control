import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    status: v.string(), // "todo", "in-progress", "done"
    assignee: v.string(), // "user", "assistant"
    createdAt: v.number(),
  }),
  content: defineTable({
    title: v.string(),
    idea: v.optional(v.string()),
    script: v.optional(v.string()),
    stage: v.string(), // "idea", "scripting", "production", "editing", "published"
    imageId: v.optional(v.string()), // Convex storage ID
    updatedAt: v.number(),
  }),
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    time: v.number(),
    type: v.string(), // "cron", "reminder", "task", "event"
    status: v.string(), // "pending", "completed", "missed"
    createdAt: v.number(),
  }),
  memories: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(), // "project", "personal", "technical", "other"
    tags: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_title", ["title"]).searchIndex("search_content", {
    searchField: "content",
    filterFields: ["category"],
  }),
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    description: v.string(),
    avatar: v.optional(v.string()), // Emoji or path
    status: v.string(), // "active", "idle", "offline"
    capabilities: v.array(v.string()),
  }),
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
  tokenMetrics: defineTable({
    model: v.string(),
    requestType: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    totalTokens: v.number(),
    durationMs: v.optional(v.number()),
    status: v.string(),
    sessionKey: v.optional(v.string()),
    costUsd: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_model", ["model"])
    .index("by_createdAt", ["createdAt"]),
});
