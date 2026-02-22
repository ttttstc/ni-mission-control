"use client";

import { ShieldAlert } from "lucide-react";

export default function OpenClawBoard() {
  // 动态使用 Cloudflare Tunnel 的公网地址，确保公网访问不被拦截
  const TUNNEL_URL = "https://sunrise-pens-translations-attorneys.trycloudflare.com";

  return (
    <div className="h-full w-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col relative shadow-inner">
      {/* Top Banner for Security context */}
      <div className="bg-indigo-600 px-6 py-2 flex items-center justify-between text-white shadow-md">
         <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">OpenClaw Remote Gateway</span>
         </div>
         <span className="text-[10px] font-medium opacity-70">Secured via Cloudflare Tunnel</span>
      </div>

      {/* The Iframe to OpenClaw Board */}
      <div className="flex-1 w-full bg-white relative">
        <iframe 
          src={TUNNEL_URL} 
          className="w-full h-full border-none"
          title="OpenClaw Control Board"
          allow="camera; microphone; display-capture"
        />
        
        {/* Fallback instructions if it doesn't load */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-center p-10">
           <div className="text-4xl mb-4">🛸</div>
           <h3 className="font-bold text-slate-800 mb-2">正在通过加密隧道连接...</h3>
           <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
             如果页面长时间未加载，请检查本地 OpenClaw 进程是否活跃，并确保网络环境允许访问 trycloudflare.com 域名。
           </p>
        </div>
      </div>
    </div>
  );
}
