# 🏗️ ni-mission-control 架构设计文档

> 为初学者友好复刻而优化的架构说明

## 1. 整体定位
`ni-mission-control` 是一个 **“AI 协作空间”的前端控制台**，它不直接运行 AI 模型，而是：
- 展示和管理多个 AI Agent（如小泥巴、狸花猫等）的状态与配置。
- 提供统一的任务看板、记忆库、内容流水线和 Token 监控。
- 通过 Convex 实现**实时数据同步**，确保多端一致。

---

## 2. 核心分层（从外到内）

```
+---------------------+
|   🌐 Web 前端       | ← 用户交互层（Next.js + Tailwind）
+---------------------+
|   📡 Convex API     | ← 实时数据层（Mutation/Query 自动同步）
+---------------------+
|   🗃️ 数据库 (Convex)| ← 持久化层（agents, tasks, memories, tokenMetrics 等表）
+---------------------+
|   💾 本地文件系统   | ← 可选扩展层（SOUL.md / IDENTITY.md / MEMORY.md）
+---------------------+
```

### 2.1 前端层（`/app`, `/components`）
- **Next.js App Router**：页面路由与 SSR/SSG。
- **Lucide React**：图标系统。
- **组件设计原则**：
  - 所有功能模块原子化（如 `TeamStructure.tsx`, `MemoryVault.tsx`）。
  - 侧边栏导航（Navigation Rail）驱动页面切换。
  - 所有状态通过 `useQuery` 订阅 Convex，实现响应式更新。

### 2.2 后端层（`/convex`）
- **Convex Schema**：定义 `agents`, `tasks`, `memories`, `tokenMetrics` 等表结构。
- **Convex Functions**：
  - `agents.*`：增删改查智能体信息（含 `soul`, `identity`, `memory`, `workspacePath`）。
  - `memories.*`：记忆的搜索、创建、更新。
  - `tokenMetrics.*`：Token 使用统计与成本计算。
- **关键设计**：
  - `ensureDefaults`：自动补全默认角色（避免空数据）。
  - `search` 函数支持中文模糊匹配（标题/正文/标签/分类）。

### 2.3 本地文件扩展层（可选）
- 通过 `/api/agent-config-sync` 接口，前端可读写本地路径下的：
  - `SOUL.md`（行为风格）
  - `IDENTITY.md`（身份画像）
  - `MEMORY.md`（长期记忆摘要）
- 适用于**本地开发调试**或**Vercel + 本地代理**混合部署场景。

---

## 3. 关键数据流示例

### 场景：修改“三花猫”的 SOUL
1. 用户在 `TeamStructure` 页面点击“三花猫” → 弹出详情。
2. 编辑 `soul` 字段 → 点击“保存”。
3. 前端调用 `agents.updateProfile` Mutation。
4. Convex 将更新写入数据库，并广播给所有订阅客户端。
5. （可选）同时调用 `/api/agent-config-sync` 写回 `D:/company/roles/ux_designer/SOUL.md`。

### 场景：刷新本地文件
1. 用户点击“刷新”按钮。
2. 前端向 `/api/agent-config-sync?path=...` 发起 GET 请求。
3. 本地代理（`local-agent-sync-proxy.mjs`）读取对应路径下的 `.md` 文件。
4. 前端对比新旧内容，仅当有变化时才触发 `updateProfile`。

---

## 4. 初学者快速上手指南

### ✅ 第一步：最小可行环境
```bash
git clone https://github.com/ttttstc/ni-mission-control.git
cd ni-mission-control
npm install
npx convex dev  # 这会引导你创建 Convex 项目并生成 .env.local
npm run dev
```

### ✅ 第二步：理解核心配置
- `.env.local` 中只需填两个变量即可跑通：
  ```env
  NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
  CONVEX_DEPLOYMENT=dev:your-project-id
  ```
- 密码是可选的，删掉 `NEXT_PUBLIC_ACCESS_PASSWORD` 就跳过登录。

### ✅ 第三步：修改与扩展
- **新增一个 Agent**：在 `convex/agents.ts` 的 `ensureDefaults` 里加一个对象。
- **新增一个页面**：在 `/app` 下新建 `page.tsx`，并在 `app/layout.tsx` 中注册导航项。
- **本地文件同步**：确保你的 `workspacePath` 是 Windows 路径（如 `D:/company/roles/dev`），并启动本地代理脚本。

---

## 5. 部署选项

| 方案 | 适用场景 | 是否需要公网 IP |
|------|----------|----------------|
| **本地开发** | 调试、学习 | ❌ |
| **Vercel + 本地代理** | 公网访问 + 本地文件同步 | ❌（靠 Cloudflare Tunnel） |
| **纯 Vercel（无本地文件）** | 快速上线演示 | ❌ |

> 推荐初学者先走 **本地开发**，熟悉后再尝试 Vercel 部署。

---
*文档版本：2026-02-23*  
*作者：小泥巴*