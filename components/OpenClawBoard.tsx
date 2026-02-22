"use client";

import { BarChart3, Clock3, Coins, Database, RefreshCw } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function formatNumber(n: number) {
  return new Intl.NumberFormat("zh-CN").format(n);
}

export default function OpenClawBoard() {
  const summary = useQuery(api.tokenMetrics.summary);
  const byModel = useQuery(api.tokenMetrics.byModel);
  const recent = useQuery(api.tokenMetrics.recent, { limit: 20 });

  return (
    <div className="h-full w-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col shadow-inner">
      <div className="bg-indigo-600 px-6 py-2 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">OpenClaw Token Monitor</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-[10px] font-medium opacity-90 hover:opacity-100 flex items-center gap-1"
          title="刷新监控数据"
        >
          <RefreshCw size={12} /> 刷新
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard icon={<Database size={16} />} label="请求总数" value={summary ? formatNumber(summary.requests) : "--"} />
          <MetricCard icon={<Coins size={16} />} label="输入 Tokens" value={summary ? formatNumber(summary.inputTokens) : "--"} />
          <MetricCard icon={<Coins size={16} />} label="输出 Tokens" value={summary ? formatNumber(summary.outputTokens) : "--"} />
          <MetricCard icon={<BarChart3 size={16} />} label="总 Tokens" value={summary ? formatNumber(summary.totalTokens) : "--"} />
          <MetricCard icon={<Clock3 size={16} />} label="估算成本($)" value={summary ? summary.costUsd.toFixed(4) : "--"} />
        </div>

        <section className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">模型调用分布</h3>
          <div className="space-y-3">
            {(byModel ?? []).length === 0 && <p className="text-xs text-slate-400">暂无模型调用数据</p>}
            {(byModel ?? []).map((row) => (
              <div key={row.model} className="grid grid-cols-12 items-center gap-3 text-xs">
                <div className="col-span-4 font-semibold text-slate-700 truncate" title={row.model}>{row.model}</div>
                <div className="col-span-2 text-slate-500">{row.requests} 次</div>
                <div className="col-span-3 text-slate-500">输入 {formatNumber(row.inputTokens)}</div>
                <div className="col-span-3 text-slate-500">总计 {formatNumber(row.totalTokens)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">最近请求（每次 token 使用）</h3>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b">
                  <th className="py-2 pr-2">时间</th>
                  <th className="py-2 pr-2">模型</th>
                  <th className="py-2 pr-2">类型</th>
                  <th className="py-2 pr-2">输入</th>
                  <th className="py-2 pr-2">输出</th>
                  <th className="py-2 pr-2">总计</th>
                  <th className="py-2 pr-2">耗时</th>
                  <th className="py-2 pr-2">状态</th>
                </tr>
              </thead>
              <tbody>
                {(recent ?? []).map((r) => (
                  <tr key={r._id} className="border-b border-slate-50 text-slate-600">
                    <td className="py-2 pr-2">{new Date(r.createdAt).toLocaleString("zh-CN")}</td>
                    <td className="py-2 pr-2">{r.model}</td>
                    <td className="py-2 pr-2">{r.requestType}</td>
                    <td className="py-2 pr-2">{formatNumber(r.inputTokens)}</td>
                    <td className="py-2 pr-2">{formatNumber(r.outputTokens)}</td>
                    <td className="py-2 pr-2 font-semibold">{formatNumber(r.totalTokens)}</td>
                    <td className="py-2 pr-2">{r.durationMs ? `${r.durationMs}ms` : "-"}</td>
                    <td className="py-2 pr-2">{r.status}</td>
                  </tr>
                ))}
                {(recent ?? []).length === 0 && (
                  <tr>
                    <td className="py-4 text-slate-400" colSpan={8}>暂无请求记录。可通过 `tokenMetrics:record` 写入数据后查看。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 text-slate-400 mb-2">{icon}<span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></div>
      <div className="text-lg font-black text-slate-800">{value}</div>
    </div>
  );
}
