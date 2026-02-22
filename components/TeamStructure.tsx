"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { 
  Users, 
  Cpu, 
  Code2, 
  PenTool, 
  Palette, 
  Terminal, 
  ShieldCheck,
  BrainCircuit,
  Zap,
  Coffee
} from "lucide-react";

const roleIcons: Record<string, any> = {
  "Leader": BrainCircuit,
  "Developer": Code2,
  "Writer": PenTool,
  "Designer": Palette,
  "Architect": Terminal,
  "Product": Users,
  "DevOps": Zap
};

export default function TeamStructure() {
  const agents = useQuery(api.agents.list);

  if (!agents) return <div className="p-8 text-center text-slate-500">正在扫描团队状态...</div>;

  // Manual list of sub-agents I spin up if DB is empty or as complementary info
  const coreTeam = [
    {
      name: "小泥巴 (nibazhubot)",
      role: "Leader / Orchestrator",
      description: "主协调者，负责任务分解、资源分配以及与人类用户的直接沟通。拥有全权限访问和最高级推理能力。",
      status: "online",
      avatar: "🛠️",
      capabilities: ["Orchestration", "Decision Making", "Memory Management"]
    },
    ...agents
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <Cpu className="text-indigo-600" size={24} /> 
          AI 协作团队
        </h2>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Active Agents: {coreTeam.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coreTeam.map((member, idx) => {
            const Icon = roleIcons[member.role.split(' ')[0]] || Cpu;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {member.avatar || "🤖"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 truncate">{member.name}</h3>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter mb-1">{member.role}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${member.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {member.status}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 mt-2">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.capabilities.map((cap, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-medium border border-slate-200/50">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-10 p-8 bg-indigo-900 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-2">架构说明: 按需启动 (On-Demand Spin-up)</h3>
             <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
               为了保持效率，子智能体仅在需要处理特定领域任务（如编写代码、设计视觉稿或进行深度写作）时由主智能体启动。它们共享当前任务的上下文快照，完成后会自动溶解并回传结果。
             </p>
           </div>
           <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
}
