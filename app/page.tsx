"use client";

import { useState } from "react";
import TaskBoard from "../components/TaskBoard";
import ContentPipeline from "../components/ContentPipeline";
import MissionCalendar from "../components/MissionCalendar";
import MemoryVault from "../components/MemoryVault";
import TeamStructure from "../components/TeamStructure";
import DigitalOffice from "../components/DigitalOffice";
import OpenClawBoard from "../components/OpenClawBoard";
import LoginGate from "../components/LoginGate";
import { 
  LayoutDashboard, 
  Workflow, 
  Calendar, 
  BookText,
  Users2,
  Monitor,
  ShieldCheck,
  Settings, 
  User, 
  Bot, 
  Bell 
} from "lucide-react";

export default function UnifiedWorkspace() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <LoginGate>
      <div className="h-screen flex flex-col bg-white text-slate-900 overflow-hidden">
        {/* Top Sidebar/Navigation */}
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Rail */}
          <nav className="w-20 border-r bg-slate-50 flex flex-col items-center py-8 gap-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
              <Bot size={28} strokeWidth={2.5} />
            </div>
            
            <button 
              onClick={() => setActiveTab("tasks")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "tasks" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="任务控制"
            >
              <LayoutDashboard size={24} />
            </button>
            
            <button 
              onClick={() => setActiveTab("pipeline")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "pipeline" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="创作流"
            >
              <Workflow size={24} />
            </button>
            
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "calendar" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="排期表"
            >
              <Calendar size={24} />
            </button>

            <button 
              onClick={() => setActiveTab("memory")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "memory" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="记忆库"
            >
              <BookText size={24} />
            </button>

            <button 
              onClick={() => setActiveTab("office")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "office" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="数字办公室"
            >
              <Monitor size={24} />
            </button>

            <button 
              onClick={() => setActiveTab("team")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "team" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="团队架构"
            >
              <Users2 size={24} />
            </button>

            <button 
              onClick={() => setActiveTab("openclaw")}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === "openclaw" ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              title="OpenClaw Token 监控"
            >
              <ShieldCheck size={24} />
            </button>

            <div className="mt-auto flex flex-col gap-6">
              <button className="text-slate-400 hover:text-slate-600">
                <Bell size={20} />
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                 <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-400 text-xs font-bold uppercase">NN</div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Internal Header */}
            <header className="px-10 py-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800">
                  {activeTab === "tasks" && "任务控制中心"}
                  {activeTab === "pipeline" && "内容创作流水线"}
                  {activeTab === "calendar" && "任务排期日历"}
                  {activeTab === "memory" && "核心记忆库"}
                  {activeTab === "team" && "团队架构展示"}
                  {activeTab === "office" && "数字化办公室"}
                  {activeTab === "openclaw" && "OpenClaw Token 监控"}
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {activeTab === "tasks" && "追踪每一个协作细节"}
                  {activeTab === "pipeline" && "管理从灵感到发布的全过程"}
                  {activeTab === "calendar" && "确保每一个定时任务准时执行"}
                  {activeTab === "memory" && "沉淀项目决策、偏好与技术积累"}
                  {activeTab === "team" && "查看主助手及其随叫随到的子智能体集群"}
                  {activeTab === "office" && "实时观测每一位 AI 智能体的工作状态与工位"}
                  {activeTab === "openclaw" && "查看 Token 消耗、模型调用分布与每次请求明细"}
                </p>
              </div>
              
              <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-500">
                   <User size={12} /> User: ni ni
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-600">
                   <Bot size={12} /> Agent: 小泥巴
                 </div>
              </div>
            </header>

            {/* Tab Content */}
            <div className="flex-1 px-10 overflow-hidden pb-8">
              <div className="h-full">
                {activeTab === "tasks" && <TaskBoard />}
                {activeTab === "pipeline" && <ContentPipeline />}
                {activeTab === "calendar" && <MissionCalendar />}
                {activeTab === "memory" && <MemoryVault />}
                {activeTab === "team" && <TeamStructure />}
                {activeTab === "office" && <DigitalOffice />}
                {activeTab === "openclaw" && <OpenClawBoard />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </LoginGate>
  );
}
