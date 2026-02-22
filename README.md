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

## 🚀 快速开始

### 1. 环境准备
确保本地安装了 Node.js 环境，并克隆了本项目。

### 2. 配置文件
在项目根目录创建 `.env.local` 文件，并参考以下说明补充配置：

#### Convex 实时后端配置
本项目使用 [Convex](https://www.convex.dev/) 作为实时数据库和后端。你需要：
1. 注册并登录 Convex 官网。
2. 在本地执行 `npx convex dev`，它会自动引导你创建项目并生成相关环境变量。
3. **关键变量说明**：
   - `NEXT_PUBLIC_CONVEX_URL`: 你的 Convex 项目访问地址（通常以 `.convex.cloud` 结尾）。它让前端知道去哪里连接数据库。
   - `CONVEX_DEPLOYMENT`: 部署标识符（格式如 `dev:project-name-123`）。这对于 Convex 命令行工具同步 Schema 和函数至关重要。

#### 访问安全配置
- `NEXT_PUBLIC_ACCESS_PASSWORD`: 设置进入 Mission Control 的访问密码。此密码仅在前端 `LoginGate` 组件中校验，用于基础的访问隔离。

```env
# 示例配置
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=dev:your-project-name

NEXT_PUBLIC_ACCESS_PASSWORD=nini
```

### 3. 安装依赖
```bash
npm install
```

### 4. 运行开发服务器
```bash
npm run dev
```
打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 🛠️ 使用方式

1. **登录**: 首次进入需输入在 `.env.local` 中配置的 `NEXT_PUBLIC_ACCESS_PASSWORD`。
2. **切换板块**: 通过左侧侧边栏 (Navigation Rail) 快速切换不同的工作空间。
3. **数据管理**: 大部分数据通过 Convex 自动保存，确保在多端同步时的一致性。
4. **扩展**: 若需添加新模块，可在 `/components` 下创建新组件，并在 `app/page.tsx` 中注册。

---
*Created with ❤️ by 小泥巴 for ni ni*
