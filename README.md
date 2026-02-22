# ni-mission-control

🛠️ **ni-mission-control** 是为 ni ni 打造的统一 AI 协作空间。作为 **小泥巴 (OpenClaw)** 的前端可视化界面，它整合了任务追踪、内容创作流水线、记忆库管理以及 AI 团队架构展示。

## 🌟 核心功能

- **任务控制中心 (TaskBoard)**: 追踪每一个协作细节与任务进度。
- **内容创作流水线 (ContentPipeline)**: 管理从灵感到发布的全流程，支持自动化流水线监控。
- **任务排期日历 (MissionCalendar)**: 可视化定时任务与重要里程碑。
- **核心记忆库 (MemoryVault)**: 沉淀项目决策、用户偏好与技术积累。
- **数字化办公室 (DigitalOffice)**: 实时观测每一位 AI 智能体的工作状态与模拟工位。
- **团队架构 (TeamStructure)**: 展示主助手（小泥巴）与子智能体集群的协作关系。
- **OpenClaw 控制台 (OpenClawBoard)**: 远程管理本地 OpenClaw 服务的状态与隧道。
- **身份验证 (LoginGate)**: 极简且安全的访问控制。

## 🏗️ 架构设计

项目基于现代化的前端技术栈构建，强调极简、高效与响应式体验。

### 技术栈
- **框架**: [Next.js 15 (App Router)](https://nextjs.org/)
- **后端服务 (BaaS)**: [Convex](https://www.convex.dev/) (用于实时数据同步)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **组件库**: 原生自定义组件，追求大师级 UI 设计感。

### 目录结构
- `/app`: 路由与主页面逻辑。
- `/components`: 核心功能模块组件（原子化设计）。
- `/convex`: 后端逻辑、数据库模式与 API 定义。
- `/public`: 静态资源。

### 数据流
1. 用户操作通过前端触发 Convex Mutation。
2. Convex 实时处理并同步数据至所有连接的客户端。
3. 前端通过 `useQuery` 实现响应式状态更新。

## 🚀 快速开始（初学者友好版）

> 5 分钟上手：无需复杂配置，先跑起来再深入。

### ✅ 第一步：一键启动（推荐）
```bash
git clone https://github.com/ttttstc/ni-mission-control.git
cd ni-mission-control
npm install
npx convex dev  # 👈 这一步会自动创建 Convex 项目并生成 .env.local
npm run dev
```
- 打开 [http://localhost:3000]
- 如果提示密码，直接删掉 `.env.local` 中的 `NEXT_PUBLIC_ACCESS_PASSWORD` 行即可跳过登录。

### ✅ 第二步：理解核心结构
| 目录 | 作用 |
|------|------|
| `/app` | 页面路由与主逻辑（Next.js App Router） |
| `/components` | 功能模块（任务、记忆、团队等） |
| `/convex` | 数据库定义 + 实时 API（Mutation/Query） |
| `/docs` | 架构文档（本文档） |

### ✅ 第三步：修改与扩展
- **想改“小泥巴”的性格？**  
  编辑 `convex/agents.ts` 中的 `ensureDefaults` 数组，或在页面里点开编辑保存。
- **想加一个新页面？**  
  在 `/app` 下新建 `new-page/page.tsx`，并在 `app/layout.tsx` 的导航栏里加一行 `<Link href="/new-page">新板块</Link>`。
- **想用自己电脑的文件？**  
  在 `TeamStructure` 里为每个 agent 配置 `workspacePath`，然后运行本地代理脚本（见 docs/architecture.md）。

### 📚 深入学习
- 详细架构设计：`docs/architecture.md`
- 所有 API 文档：`convex/_generated/api.d.ts`
- 本地调试技巧：在 `components/` 里加 `console.log`，`npm run dev` 会热更新。

---
*祝你复刻顺利！有问题随时问小泥巴 🛠️*

## 🛠️ 使用方式

1. **登录**: 首次进入需输入在 `.env.local` 中配置的 `NEXT_PUBLIC_ACCESS_PASSWORD`。
2. **切换板块**: 通过左侧侧边栏 (Navigation Rail) 快速切换不同的工作空间。
3. **数据管理**: 大部分数据通过 Convex 自动保存，确保在多端同步时的一致性。
4. **扩展**: 若需添加新模块，可在 `/components` 下创建新组件，并在 `app/page.tsx` 中注册。

---
*Created with ❤️ by 小泥巴 for ni ni*
