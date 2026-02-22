"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
  X,
  Save,
} from "lucide-react";

const roleIcons: Record<string, any> = {
  Leader: BrainCircuit,
  Developer: Code2,
  Writer: PenTool,
  Designer: Palette,
  Architect: Terminal,
  Product: Users,
  DevOps: Zap,
};

export default function TeamStructure() {
  const agents = useQuery(api.agents.list);
  const updateProfile = useMutation(api.agents.updateProfile);
  const ensureDefaults = useMutation(api.agents.ensureDefaults);

  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<any | null>(null);
  const [showSoul, setShowSoul] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  useEffect(() => {
    ensureDefaults();
  }, [ensureDefaults]);

  if (!agents) return <div className="p-8 text-center text-slate-500">正在扫描团队状态...</div>;

  const coreTeam = agents;

  const openDetail = (member: any) => {
    setSelected(member);
    setForm({
      name: member.name,
      role: member.role,
      description: member.description,
      soul: member.soul ?? "",
      identity: member.identity ?? "",
      memory: member.memory ?? "",
      workspacePath: member.workspacePath ?? "",
      avatar: member.avatar ?? "🤖",
      status: member.status,
      capabilities: (member.capabilities ?? []).join(", "),
    });
    setShowSoul(false);
    setShowIdentity(false);
    setShowMemory(false);
  };

  const saveDetail = async () => {
    if (!selected?._id) return;
    await updateProfile({
      id: selected._id,
      name: form.name,
      role: form.role,
      description: form.description,
      soul: form.soul,
      identity: form.identity,
      memory: form.memory,
      workspacePath: form.workspacePath,
      avatar: form.avatar,
      status: form.status,
      capabilities: form.capabilities
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
    });

    await fetch("/api/agent-config-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspacePath: form.workspacePath,
        soul: form.soul,
        identity: form.identity,
        memory: form.memory,
      }),
    });

    setSelected(null);
    setForm(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <Cpu className="text-indigo-600" size={24} />
          AI 协作团队
        </h2>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Active Agents: {coreTeam.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coreTeam.map((member, idx) => {
            const Icon = roleIcons[(member.role || "").split(" ")[0]] || Cpu;
            return (
              <button
                key={idx}
                onClick={() => openDetail(member)}
                className="text-left bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
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
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${member.status === "online" || member.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                        {member.status}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 mt-2">{member.description}</p>
                    <div className="mb-3 text-[11px] text-slate-500 font-mono bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 truncate" title={member.workspacePath || "未设置"}>
                      工作空间: {member.workspacePath || "未设置"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(member.capabilities || []).map((cap: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-medium border border-slate-200/50">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 p-8 bg-indigo-900 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">架构说明: 按需启动 (On-Demand Spin-up)</h3>
            <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
              为了保持效率，子智能体仅在需要处理特定领域任务时由主智能体启动。点击任意成员可查看 Soul 与详细配置，并可在线修改。
            </p>
          </div>
          <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
        </div>
      </div>

      {selected && form && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Agent Soul 详情</h3>
              <button onClick={() => { setSelected(null); setForm(null); }} className="p-2 text-slate-400 hover:text-slate-900"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <input className="border rounded-xl px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="名称" />
              <input className="border rounded-xl px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="角色" />
              <input className="border rounded-xl px-3 py-2" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="头像 Emoji" />
              <input className="border rounded-xl px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="状态" />
            </div>

            <textarea className="w-full border rounded-xl px-3 py-2 text-sm mb-3 h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="职责描述" />

            <div className="space-y-3 mb-3">
              <button onClick={() => setShowSoul((v) => !v)} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-semibold">{showSoul ? "隐藏" : "查看"} SOUL</button>
              {showSoul && (
                <textarea className="w-full border rounded-xl px-3 py-2 text-sm h-24" value={form.soul} onChange={(e) => setForm({ ...form, soul: e.target.value })} placeholder="Soul（行为/风格/原则）" />
              )}

              <button onClick={() => setShowIdentity((v) => !v)} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-semibold">{showIdentity ? "隐藏" : "查看"} IDENTITY</button>
              {showIdentity && (
                <textarea className="w-full border rounded-xl px-3 py-2 text-sm h-24" value={form.identity} onChange={(e) => setForm({ ...form, identity: e.target.value })} placeholder="Identity（身份画像）" />
              )}

              <button onClick={() => setShowMemory((v) => !v)} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-semibold">{showMemory ? "隐藏" : "查看"} MEMORY</button>
              {showMemory && (
                <textarea className="w-full border rounded-xl px-3 py-2 text-sm h-28" value={form.memory} onChange={(e) => setForm({ ...form, memory: e.target.value })} placeholder="Memory（长期记忆摘要）" />
              )}
            </div>

            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-3" value={form.capabilities} onChange={(e) => setForm({ ...form, capabilities: e.target.value })} placeholder="能力标签，用逗号分隔" />
            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-5 font-mono" value={form.workspacePath} onChange={(e) => setForm({ ...form, workspacePath: e.target.value })} placeholder="工作空间路径，如 C:/Users/23742/.openclaw" />

            <div className="flex justify-end gap-3">
              <button onClick={() => { setSelected(null); setForm(null); }} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50">取消</button>
              <button
                onClick={saveDetail}
                disabled={!selected._id}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 flex items-center gap-2"
                title={selected._id ? "保存修改" : "主助手为静态展示，不写入数据库"}
              >
                <Save size={15} /> 保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
