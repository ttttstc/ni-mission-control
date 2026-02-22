"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { 
  Lightbulb, 
  FileText, 
  Video, 
  Scissors, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon,
  ChevronRight,
  X,
  Trash2
} from "lucide-react";

const STAGES = [
  { id: "idea", label: "灵感储备", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "scripting", label: "脚本撰写", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "production", label: "拍摄制作", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "editing", label: "后期剪辑", icon: Scissors, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "published", label: "已经发布", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
];

export default function ContentPipeline() {
  const contents = useQuery(api.content.list);
  const createContent = useMutation(api.content.create);
  const updateContent = useMutation(api.content.update);
  const removeContent = useMutation(api.content.remove);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const selectedItem = contents?.find(c => c._id === selectedId);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const id = await createContent({ title: newTitle, stage: "idea" });
    setNewTitle("");
    setIsAdding(false);
    setSelectedId(id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedId) return;

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    await updateContent({ id: selectedId as any, imageId: storageId });
  };

  if (!contents) return <div className="p-8 text-center text-slate-500">正在进入内容工坊...</div>;

  return (
    <div className="flex flex-col h-full relative">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-700">内容创作状态</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Plus size={18} /> 新灵感
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-max">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-64 flex flex-col h-full">
              <div className={`flex items-center gap-2 mb-4 px-2`}>
                <stage.icon size={18} className={stage.color} />
                <h3 className="font-bold text-sm text-slate-600">{stage.label}</h3>
                <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  {contents.filter(c => c.stage === stage.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {contents.filter(c => c.stage === stage.id).map(item => (
                  <div 
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-4">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] text-slate-400">
                        {item.imageId ? <ImageIcon size={12} /> : "N"}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Sidebar */}
      {selectedId && selectedItem && (
        <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-2xl border-l z-20 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span>{STAGES.find(s => s.id === selectedItem.stage)?.label}</span>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-medium">详情编辑</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { if(confirm("确定要删除吗？")) { removeContent({ id: selectedId as any }); setSelectedId(null); } }}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setSelectedId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">内容标题</label>
              <input 
                value={selectedItem.title}
                onChange={(e) => updateContent({ id: selectedId as any, title: e.target.value })}
                className="w-full text-xl font-bold border-none focus:ring-0 p-0 placeholder:text-slate-200"
                placeholder="在此输入标题..."
              />
            </section>

            <section className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">当前阶段</label>
                <select 
                  value={selectedItem.stage}
                  onChange={(e) => updateContent({ id: selectedId as any, stage: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 py-1.5"
                >
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="w-1/3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">图片</label>
                <label className="flex items-center justify-center w-full h-8 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-dashed border-slate-300">
                  <ImageIcon size={14} className="text-slate-400" />
                  <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">灵感笔记</label>
              <textarea 
                value={selectedItem.idea || ""}
                onChange={(e) => updateContent({ id: selectedId as any, idea: e.target.value })}
                className="w-full h-24 bg-slate-50 border-none rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500"
                placeholder="记录你的灵感碎片..."
              />
            </section>

            <section>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">完整脚本</label>
              <textarea 
                value={selectedItem.script || ""}
                onChange={(e) => updateContent({ id: selectedId as any, script: e.target.value })}
                className="w-full h-64 bg-indigo-50/30 border-none rounded-xl p-4 text-xs leading-relaxed font-mono focus:ring-2 focus:ring-indigo-500"
                placeholder="在此编写详细脚本..."
              />
            </section>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAdd}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
          >
            <h2 className="text-lg font-bold mb-4">孵化新灵感</h2>
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="内容的标题是？"
              className="w-full px-4 py-2 border rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-xl"
              >
                取消
              </button>
              <button 
                type="submit"
                className="flex-1 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-700"
              >
                开始创作
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
