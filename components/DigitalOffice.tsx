"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { 
  Monitor, 
  Coffee, 
  Terminal, 
  MessageSquare,
  Sparkles,
  Keyboard,
  Cpu,
  Zap,
  Moon
} from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500",
  idle: "bg-amber-500",
  offline: "bg-slate-300",
};

export default function DigitalOffice() {
  const agents = useQuery(api.agents.list);

  if (!agents) return <div className="p-8 text-center text-slate-500 font-medium">正在连接数字化办公室...</div>;

  // Add myself to the office view
  const allStaff = [
    {
      _id: "me",
      name: "小泥巴 (nibazhubot)",
      role: "Leader",
      status: "active",
      avatar: "🛠️",
      currentTask: "正在为您优化数字化办公空间的视觉体验"
    },
    ...agents.map(a => ({
      ...a,
      currentTask: a.status === "active" ? "正在全力处理分配的任务..." : (a.status === "idle" ? "处于待命状态，正在充电" : "已下线")
    }))
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-8 flex justify-between items-center px-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <Cpu className="text-indigo-600" size={24} /> 
          智能体办公室 (Agent Office)
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div> 工作中</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></div> 待命</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm shadow-slate-100"></div> 离线</span>
          </div>
        </div>
      </div>

      {/* Office Floor Plan */}
      <div className="flex-1 overflow-auto bg-slate-100/30 rounded-[3rem] border-8 border-white shadow-2xl p-12 relative min-h-[700px] scrollbar-hide">
        
        {/* Office Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {allStaff.map((staff) => (
            <div key={staff._id} className="relative group perspective">
              
              {/* Desk & Agent Container */}
              <div className={`relative transition-all duration-700 rounded-[2.5rem] p-8 border-b-8 border-r-4 shadow-xl ${
                staff.status === 'active' 
                  ? 'bg-white border-indigo-100 shadow-indigo-100/50 -translate-y-2' 
                  : 'bg-white/80 border-slate-100 shadow-slate-200/50'
              }`}>
                
                {/* Desk Items Area */}
                <div className="absolute top-4 right-8 flex gap-3 opacity-40">
                  {staff.status === 'active' ? (
                    <div className="flex gap-1">
                       <div className="w-1.5 h-4 bg-indigo-200 rounded-full animate-bounce delay-75"></div>
                       <div className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                       <div className="w-1.5 h-3 bg-indigo-300 rounded-full animate-bounce delay-300"></div>
                    </div>
                  ) : (
                    <Coffee size={16} className="text-amber-500 animate-pulse" />
                  )}
                </div>

                <div className="flex flex-col items-center">
                  
                  {/* The Character (Little Person) */}
                  <div className="relative mb-8 mt-4">
                    {/* Status Aura */}
                    <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
                      staff.status === 'active' ? 'bg-indigo-400/20 scale-150' : 'bg-transparent'
                    }`}></div>

                    {/* Avatar with Animation */}
                    <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-6xl bg-gradient-to-br from-slate-50 to-white shadow-inner relative z-10 transition-all duration-500 border-4 ${
                      staff.status === 'active' ? 'border-indigo-500 rotate-0 scale-110' : 'border-slate-50 -rotate-3 scale-100'
                    }`}>
                      {staff.avatar || "🤖"}
                      
                      {/* Interactive Tool Overlay */}
                      {staff.status === 'active' && (
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white animate-spin-slow">
                           <Zap size={14} fill="currentColor" />
                        </div>
                      )}
                      {staff.status === 'idle' && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                           <Moon size={14} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{staff.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg">{staff.role}</span>
                    </div>
                  </div>

                  {/* Workstation (Monitor/Keyboard) */}
                  <div className={`w-full p-6 rounded-3xl transition-all duration-500 border-2 ${
                    staff.status === 'active' 
                      ? 'bg-slate-900 border-slate-800 shadow-2xl' 
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-red-400 animate-pulse' : 'bg-slate-200'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                      </div>
                      <Monitor size={14} className={staff.status === 'active' ? 'text-slate-400' : 'text-slate-200'} />
                    </div>
                    
                    {/* Animated Content */}
                    <div className="space-y-2">
                      {staff.status === 'active' ? (
                        <>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 animate-loading-bar"></div>
                          </div>
                          <div className="h-1.5 w-3/4 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-loading-bar delay-300"></div>
                          </div>
                          <div className="pt-2 flex justify-end">
                            <Keyboard size={12} className="text-indigo-400 animate-bounce" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
                          <div className="h-1.5 w-1/2 bg-slate-200 rounded-full"></div>
                          <div className="pt-2 flex justify-center">
                            <Coffee size={14} className="text-slate-300" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className={`mt-6 p-5 rounded-2xl relative transition-all duration-500 ${
                    staff.status === 'active' 
                      ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-100 shadow-sm' 
                      : 'bg-slate-50 text-slate-400 border border-transparent'
                  }`}>
                    {/* Triangle point */}
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${
                      staff.status === 'active' ? 'bg-indigo-50 border-t-2 border-l-2 border-indigo-100' : 'bg-slate-50'
                    }`}></div>
                    
                    <div className="flex gap-3">
                      <MessageSquare size={16} className={`mt-1 shrink-0 ${staff.status === 'active' ? 'text-indigo-400' : 'text-slate-300'}`} />
                      <p className="text-xs font-bold leading-relaxed italic">
                        {staff.currentTask}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Shadow on Floor */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-slate-900/10 blur-2xl rounded-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          ))}
        </div>

        {/* Global Office Decorations */}
        <div className="absolute top-20 right-20 text-6xl opacity-10 select-none animate-float">🏢</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 select-none animate-float delay-700">🛋️</div>
        <div className="absolute top-1/2 left-20 text-4xl opacity-5 select-none rotate-12">🪴</div>
        <div className="absolute bottom-40 right-20 text-4xl opacity-5 select-none -rotate-12">🌿</div>
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes loading-bar {
          0% { width: 0%; opacity: 0.5; }
          50% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0.5; }
        }
        .animate-loading-bar {
          animation: loading-bar 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
