@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0.."

echo 🚀 启动 ni-mission-control + Cloudflare Tunnel...
echo.

:: 1) 启动本地服务
start "ni-mission-control-dev" cmd /k "npm run dev"
timeout /t 6 /nobreak >nul
echo ✅ 本地服务已启动: http://localhost:3000

:: 2) 启动 cloudflared
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo 🔧 未检测到 cloudflared，正在安装...
  npm i -g cloudflared
)

echo 🌐 正在建立 Cloudflare Tunnel...
start "ni-mission-control-tunnel" cmd /k "cloudflared tunnel --url http://localhost:3000 --no-autoupdate --loglevel info"
timeout /t 8 /nobreak >nul

:: 3) 通过 PowerShell 获取最新 trycloudflare URL（从 cloudflared 进程输出较难直取，这里主动请求本地日志接口不可用时给出提示）
set "TUNNEL_URL="
for /f "usebackq delims=" %%u in (`powershell -NoProfile -Command "$p = Get-Process cloudflared -ErrorAction SilentlyContinue; if(-not $p){exit 0}; ''"`) do set "TUNNEL_URL=%%u"

:: 这里直接让用户从 tunnel 窗口复制 URL，同时弹窗提示
powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('本地服务和 Tunnel 已启动。\n\n请在名为 ni-mission-control-tunnel 的窗口中复制最新 https://*.trycloudflare.com 地址。\n\n关闭该 tunnel 窗口即停止公网访问。','ni-mission-control 已启动',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information)" >nul

echo.
echo 📌 已保持窗口不退出。请不要关闭 tunnel 窗口。
echo 按任意键结束此脚本（不会自动关闭已打开的 dev/tunnel 窗口）...
pause >nul
