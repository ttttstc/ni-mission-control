"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Trash2, User, Bot } from "lucide-react";

const statusLabels: Record<string, string> = {
  todo: "待办",
  "in-progress": "进行中",
  done: "已完成",
};

export default function TaskBoard() {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);

  const [newTaskText, setNewTaskText] = useState("");
  const [newAssignee, setNewAssignee] = useState<"user" | "assistant">("assistant");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await createTask({ text: newTaskText, status: "todo", assignee: newAssignee });
    setNewTaskText("");
  };

  if (!tasks) return <div className="p-8 text-center text-slate-500">正在努力加载任务中...</div>;

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleAddTask} className="mb-10 flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="想要做点什么？在这里输入新任务..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <select 
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value as "user" | "assistant")}
          className="px-3 py-2 border rounded-xl bg-white shadow-sm cursor-pointer"
        >
          <option value="user">分配给我</option>
          <option value="assistant">分配给小泥巴</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95">
          <Plus size={18} /> 添加
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pb-8">
        {["todo", "in-progress", "done"].map((status) => (
          <div key={status} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-widest text-slate-500 flex items-center gap-2">
              {status === "todo" && <Circle size={16} className="text-slate-300" />}
              {status === "in-progress" && <Clock size={16} className="text-amber-500" />}
              {status === "done" && <CheckCircle2 size={16} className="text-emerald-500" />}
              {statusLabels[status]}
            </h2>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-slate-800 text-[15px] leading-relaxed">{task.text}</p>
                    <button 
                      onClick={() => removeTask({ id: task._id })}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-50">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${task.assignee === 'user' ? 'text-blue-500' : 'text-purple-500'}`}>
                      {task.assignee === "user" ? <User size={12}/> : <Bot size={12}/>}
                      {task.assignee === "user" ? "ni ni" : "小泥巴"}
                    </div>
                    <select 
                      value={task.status}
                      onChange={(e) => updateStatus({ id: task._id, status: e.target.value })}
                      className="text-[10px] bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      <option value="todo">待办</option>
                      <option value="in-progress">进行中</option>
                      <option value="done">已完成</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
