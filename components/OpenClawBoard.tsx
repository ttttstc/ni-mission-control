"use client";

import { ShieldAlert, RefreshCw } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function OpenClawBoard() {
  // 从 Convex 实时获取最新的隧道地址
  const tunnelUrl = useQuery(api.settings.get, { key: "openclaw_tunnel_url" });

  return (
    <div className="h-full w-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col relative shadow-inner">
      {/* Top Banner for Security context */}
      <div className="bg-indigo-600 px-6 py-2 flex items-center justify-between text-white shadow-md">
         <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">OpenClaw Remote Gateway</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-medium opacity-70">Secured via Cloudflare Tunnel</span>
            {tunnelUrl && (
               <button 
                  onClick={() => window.location.reload()} 
                  className="hover:rotate-180 transition-transform duration-500"
                  title="刷新连接"
               >
                  <RefreshCw size={12} />
               </button>
            )}
         </div>
      </div>

      {/* The Iframe to OpenClaw Board */}
      <div className="flex-1 w-full bg-white relative">
        {tunnelUrl ? (
          <iframe 
            src={tunnelUrl} 
            className="w-full h-full border-none"
            title="OpenClaw Control Board"
            allow="camera; microphone; display-capture"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-slate-50">
             <div className="text-4xl mb-4 animate-bounce">🛸</div>
             <h3 className="font-bold text-slate-800 mb-2">等待本地隧道建立...</h3>
             <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
               本地 OpenClaw 助手尚未上报隧道地址。请确保小泥巴已在本地启动 cloudflared 隧道。
             </p>
          </div>
        )}
        
        {/* Fallback instructions in background */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-center p-10">
           <h3 className="font-bold text-slate-800 mb-2">正在通过加密隧道连接...</h3>
        </div>
      </div>
    </div>
  );
}
