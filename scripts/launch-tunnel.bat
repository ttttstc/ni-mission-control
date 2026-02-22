@echo off
setlocal enabledelayedexpansion

echo 🚀 启动 ni-mission-control + Cloudflare Tunnel...
echo.

:: 1. 启动本地开发服务器
start "" cmd /c "cd /d "%~dp0.." && npm run dev"

timeout /t 5 /nobreak >nul
echo ✅ 本地服务已启动（http://localhost:3000）

:: 2. 安装并运行 cloudflared tunnel
echo.
echo 🌐 正在启动 Cloudflare Tunnel...
if exist "%LOCALAPPDATA%\npm\cloudflared.cmd" (
    echo 使用已有 cloudflared...
) else (
    echo 正在安装 cloudflared...
    npm install -g cloudflared
)

:: 启动隧道（后台）
start "" cmd /c "cloudflared tunnel --url http://localhost:3000 --no-autoupdate --metrics :8081 > tunnel.log 2>&1"

timeout /t 8 /nobreak >nul

:: 3. 提取最新隧道 URL（从日志中找）
set TUNNEL_URL=
for /f "tokens=*" %%a in ('findstr /c:"https://" tunnel.log ^| findstr /v "INFO" ^| tail -n 1 2^>nul') do set TUNNEL_URL=%%a
if "!TUNNEL_URL!"=="" (
    for /f "tokens=*" %%a in ('type tunnel.log ^| findstr /c:"https://" ^| findstr /v "INFO" ^| tail -n 1 2^>nul') do set TUNNEL_URL=%%a
)

:: 如果 still empty, fallback to known pattern
if "!TUNNEL_URL!"=="" (
    echo ⚠️ 未自动提取到 URL，使用默认模板：
    echo    https://*.trycloudflare.com
    echo 请手动查看 tunnel.log 获取真实地址
) else (
    echo ✅ 隧道已就绪！公网访问地址：
    echo    !TUNNEL_URL!
)

echo.
echo 📝 提示：按 Ctrl+C 可停止所有进程（或关闭此窗口）
pause