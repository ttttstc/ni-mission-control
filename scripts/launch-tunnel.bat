@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo 🚀 启动 ni-mission-control + Cloudflare Tunnel...

:: 1) 启动本地服务
start "ni-mission-control-dev" cmd /k "npm run dev"
timeout /t 6 /nobreak >nul

:: 2) 启动 tunnel（按你的要求使用 npx cloudflared@latest）
if exist tunnel.log del /f /q tunnel.log >nul 2>nul
start "ni-mission-control-tunnel" cmd /c "npx cloudflared@latest tunnel --url http://localhost:3000 > tunnel.log 2>&1"

echo 🌐 正在获取公网 URL...
set "TUNNEL_URL="
for /l %%i in (1,1,25) do (
  for /f "tokens=* delims=" %%u in ('findstr /r /c:"https://[a-z0-9-]*\.trycloudflare\.com" tunnel.log 2^>nul') do (
    set "TUNNEL_URL=%%u"
  )
  if defined TUNNEL_URL goto :found
  timeout /t 1 /nobreak >nul
)

:found
if defined TUNNEL_URL (
  echo ✅ 公网地址：!TUNNEL_URL!
  powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('隧道已建立！`n`n公网地址：`n!TUNNEL_URL!`n`n请保持此窗口打开。','ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information)" >nul
) else (
  echo ⚠️ 未自动解析到 URL，请打开 tunnel.log 查看。
  powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('未自动解析到公网地址，请打开 scripts 同级目录下 tunnel.log 查看。','ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Warning)" >nul
)

echo.
echo 📌 脚本不会自动退出。按任意键退出此窗口（不影响已开的 dev 窗口）。
pause >nul
