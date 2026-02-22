@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Run from project root
cd /d "%~dp0.."

echo [1/3] Start local dev server...
start "ni-mission-control-dev" cmd.exe /k "cd /d "%cd%" && npm run dev"

timeout /t 6 /nobreak >nul

echo [2/3] Start Cloudflare tunnel...
if exist "tunnel.log" del /f /q "tunnel.log" >nul 2>nul
start "ni-mission-control-tunnel" cmd.exe /k "cd /d "%cd%" && npx cloudflared@latest tunnel --url http://localhost:3000 > tunnel.log 2>&1"

echo [3/3] Parse public URL from tunnel.log...
set "TUNNEL_URL="
for /l %%i in (1,1,40) do (
  for /f "tokens=* delims=" %%u in ('findstr /r /c:"https://[a-z0-9-]*\.trycloudflare\.com" "tunnel.log" 2^>nul') do set "TUNNEL_URL=%%u"
  if defined TUNNEL_URL goto :found
  timeout /t 1 /nobreak >nul
)

:found
if defined TUNNEL_URL (
  echo Public URL: !TUNNEL_URL!
  powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Tunnel ready.`n`nPublic URL:`n!TUNNEL_URL!`n`nKeep tunnel window open.','ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information)" >nul
) else (
  echo Could not parse URL automatically. Please check tunnel.log.
  powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Could not parse public URL automatically. Please open tunnel.log.','ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Warning)" >nul
)

echo.
echo This window will stay open. Press any key to exit this launcher.
pause >nul
