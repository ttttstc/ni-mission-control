# ni-mission-control 架构设计文档

## 1. 设计初衷
**ni-mission-control** 旨在为用户提供一个“单一事实来源”的 AI 管理界面。它不只是一个看板，更是 **小泥巴 (OpenClaw)** 的物理映射，将复杂的后台逻辑（如任务调度、记忆检索、团队协作）转化为直观、精美的可视化操作。

## 2. 核心架构逻辑

### 2.1 分层架构
- **视图层 (View Layer)**: 采用 Next.js App Router 架构，支持服务端渲染与客户端交互。
- **状态/数据层 (Data Layer)**: 使用 Convex。Convex 提供的实时订阅机制（Reactive Query）替代了传统的 REST/GraphQL 轮询，保证了 UI 状态与数据库的绝对实时同步。
- **验证层 (Auth Layer)**: 极简的 `LoginGate` 机制，通过环境变量与浏览器 LocalStorage 实现轻量级访问控制。

### 2.2 模块化设计
每个核心功能被封装为独立的逻辑组件：
- `TaskBoard`: 状态机驱动的任务流管理。
- `MemoryVault`: 结构化数据的展示与检索。
- `OpenClawBoard`: 通过 API 隧道与本地 OpenClaw 实例通信。

## 3. 关键流程设计

### 3.1 权限验证流
1. 用户访问主页 -> `LoginGate` 检查 LocalStorage 中的 `workspace_auth`。
2. 若未验证，显示登录界面。
3. 输入密码与 `NEXT_PUBLIC_ACCESS_PASSWORD` 匹配 -> 写入 LocalStorage -> 重载组件显示主内容。

### 3.2 实时数据流 (Convex)
1. 前端调用 `useQuery(api.tasks.get)` 订阅任务列表。
2. 用户在前端点击“完成任务” -> 调用 `useMutation(api.tasks.updateStatus)`。
3. Convex Server 处理逻辑 -> 更新数据库。
4. 所有订阅该数据的客户端自动触发重绘，无需手动刷新。

## 4. UI/UX 设计原则
- **高对比度与留白**: 使用 Slate/Indigo 色系，强调层级感。
- **微交互**: 采用 Lucide 风格的线性图标，结合渐变阴影与圆角设计，提升“大师级”精致感。
- **响应式布局**: 采用固定侧边栏 (Navigation Rail) + 弹性内容区的结构，适应不同尺寸的屏幕。

## 5. 未来扩展方向
- **集成 OpenClaw Logs**: 直接在控制面板查看实时运行日志。
- **AI 交互入口**: 在界面直接集成对话框，实现“所见即所得”的任务下达。
- **数据可视化**: 增加任务完成率、创作频率等维度的图表分析。
