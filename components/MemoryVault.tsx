"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { 
  Book, 
  Search, 
  Tag, 
  Calendar, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Edit3,
  FileText
} from "lucide-react";

export default function MemoryVault() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (isComposing) return;
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchInput, isComposing]);

  const memories = useQuery(api.memories.search, { query: searchQuery });
  const createMemory = useMutation(api.memories.create);
  const updateMemory = useMutation(api.memories.update);
  const removeMemory = useMutation(api.memories.remove);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const selectedItem = memories?.find(m => m._id === selectedId);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const id = await createMemory({ 
      title: newTitle, 
      content: "", 
      category: "project", 
      tags: [] 
    });
    setNewTitle("");
    setIsAdding(false);
    setSelectedId(id);
  };

  if (!memories) return <div className="p-8 text-center text-slate-500">正在开启记忆库...</div>;

  return (
    <div className="flex h-full gap-8 relative overflow-hidden">
      {/* List Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-700">知识与记忆</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm text-sm active:scale-95"
            >
              <Plus size={16} /> 新记事
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setSearchInput(e.currentTarget.value);
                setSearchQuery(e.currentTarget.value);
              }}
              placeholder="搜索标题、正文、标签、分类..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 outline-none"
            />
          </div>
          <p className="text-xs text-slate-400 -mt-2">
            {searchInput.trim() ? `“${searchInput}” 匹配 ${memories?.length ?? 0} 条` : `共 ${memories.length} 条记忆`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 xl:grid-cols-2 gap-4 pb-10">
          {memories.map(memory => (
            <div 
              key={memory._id}
              onClick={() => setSelectedId(memory._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group ${selectedId === memory._id ? 'bg-white border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-400 shadow-sm'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {new Date(memory.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{memory.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {memory.content || "暂无详细内容..."}
              </p>
              <div className="flex gap-2">
                {memory.tags.map(tag => (
                  <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
          {memories.length === 0 && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed rounded-3xl">
              <Book size={48} className="mb-4 opacity-20" />
              <p>没有找到相关记忆</p>
            </div>
          )}
        </div>
      </div>

      {/* Reader View / Editor View */}
      {selectedId && selectedItem && (
        <div className="w-[500px] bg-white border rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase font-bold tracking-widest">{selectedItem.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { if(confirm("确定要删除这段记忆吗？")) { removeMemory({ id: selectedId as any }); setSelectedId(null); } }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setSelectedId(null)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <section>
              <input 
                value={selectedItem.title}
                onChange={(e) => updateMemory({ id: selectedId as any, title: e.target.value })}
                className="w-full text-2xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 text-slate-800"
                placeholder="标题..."
              />
            </section>

            <section className="flex gap-4 items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag size={14} />
                <span className="text-xs">分类:</span>
                <select 
                  value={selectedItem.category}
                  onChange={(e) => updateMemory({ id: selectedId as any, category: e.target.value })}
                  className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="project">项目决策</option>
                  <option value="personal">个人偏好</option>
                  <option value="technical">技术架构</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </section>

            <section className="prose prose-slate max-w-none">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">内容正文</label>
              <textarea 
                value={selectedItem.content}
                onChange={(e) => updateMemory({ id: selectedId as any, content: e.target.value })}
                className="w-full h-[500px] bg-slate-50/50 border-none rounded-2xl p-6 text-sm leading-relaxed focus:ring-2 focus:ring-slate-100 outline-none"
                placeholder="在此记录重要的事情..."
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
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200"
          >
            <h2 className="text-xl font-black mb-6">新增记忆</h2>
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="这组记忆的标题是？"
              className="w-full px-5 py-3 border-2 border-slate-100 rounded-2xl mb-8 focus:border-slate-900 outline-none text-sm transition-colors"
            />
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 text-slate-500 text-sm font-bold hover:bg-slate-50 rounded-2xl transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
              >
                确 认
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
