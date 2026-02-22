"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 默认访问密码，从环境变量读取
  const ACCESS_PASSWORD = process.env.NEXT_PUBLIC_ACCESS_PASSWORD || "nini"; 

  useEffect(() => {
    const auth = localStorage.getItem("workspace_auth");
    if (auth === "true") {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      localStorage.setItem("workspace_auth", "true");
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (isLoading) return null;

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 shadow-indigo-200">
              <Lock size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mission Control</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">请输入访问密码进入统一工作空间</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="访问密码"
                autoFocus
                className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold tracking-widest text-center ${
                  error ? "border-red-200 bg-red-50 text-red-500 animate-shake" : "border-transparent focus:border-indigo-500 focus:bg-white text-slate-800"
                }`}
              />
              {error && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center mt-3 animate-pulse">密码错误，请重试</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
            >
              验证身份 <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2 text-slate-300">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Secure Access for ni ni</span>
          </div>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
