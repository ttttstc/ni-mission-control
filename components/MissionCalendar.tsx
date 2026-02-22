"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  Zap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function MissionCalendar() {
  const events = useQuery(api.events.list);
  const createEvent = useMutation(api.events.create);
  const updateStatus = useMutation(api.events.updateStatus);
  const removeEvent = useMutation(api.events.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState("reminder");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime) return;
    await createEvent({ 
      title: newTitle, 
      time: new Date(newTime).getTime(), 
      type: newType, 
      status: "pending" 
    });
    setNewTitle("");
    setNewTime("");
    setIsAdding(false);
  };

  if (!events) return <div className="p-8 text-center text-slate-500">正在同步任务日历...</div>;

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.time).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-700">计划任务排期</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Plus size={18} /> 新计划
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-10">
        {Object.entries(groupedEvents).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, items]) => (
          <div key={date}>
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10 flex items-center gap-2 border-b mb-4">
              <CalendarIcon size={14} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-400">{date}</span>
            </div>
            <div className="space-y-3">
              {items.sort((a, b) => a.time - b.time).map(event => (
                <div key={event._id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${event.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === 'cron' ? 'bg-blue-100 text-blue-600' : 
                      event.type === 'reminder' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {event.type === 'cron' ? <Zap size={20} /> : <Bell size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${event.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded capitalize">
                          {event.type === 'cron' ? '周期任务' : '提醒'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus({ id: event._id, status: 'completed' })}
                        className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        标记完成
                      </button>
                    )}
                    <button 
                      onClick={() => removeEvent({ id: event._id })}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed rounded-3xl">
            <CalendarIcon size={48} className="mb-4 opacity-20" />
            <p>目前还没有安排任何计划任务</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAdd}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
          >
            <h2 className="text-lg font-bold mb-4">计划新任务</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">任务名称</label>
                <input 
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="任务或提醒内容..."
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">计划时间</label>
                <input 
                  type="datetime-local"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">任务类型</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                >
                  <option value="reminder">单次提醒</option>
                  <option value="cron">周期性任务 (Cron)</option>
                  <option value="event">重要事件</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-xl"
              >
                取消
              </button>
              <button 
                type="submit"
                className="flex-1 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700"
              >
                加入排期
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
