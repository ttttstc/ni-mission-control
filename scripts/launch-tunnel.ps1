# launch-tunnel.ps1
# 一键启动本地服务 + Cloudflare Tunnel，返回公网 URL

Write-Host "🚀 启动 ni-mission-control + Cloudflare Tunnel..." -ForegroundColor Cyan

# 1. 启动本地开发服务器（后台）
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$(Split-Path $MyInvocation.MyCommand.Path -Parent)'; npm run dev" -WindowStyle Normal
Write-Host "✅ 本地服务已启动（http://localhost:3000）" -ForegroundColor Green
Start-Sleep -Seconds 5

# 2. 确保 cloudflared 已安装
if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Host "🔧 安装 cloudflared..."
    npm install -g cloudflared
}

# 3. 启动隧道（后台，日志到 tunnel.log）
$_tunnelLog = Join-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) "tunnel.log"
Start-Process cloudflared -ArgumentList "tunnel", "--url", "http://localhost:3000", "--no-autoupdate", "--metrics", ":8081", "--loglevel", "info" -RedirectStandardOutput $_tunnelLog -RedirectStandardError $_tunnelLog -WindowStyle Hidden
Write-Host "🌐 正在建立 Cloudflare Tunnel..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# 4. 从日志提取最新 https://*.trycloudflare.com
$tunnelUrl = $null
if (Test-Path $_tunnelLog) {
    $lines = Get-Content $_tunnelLog -Tail 20
    $urlMatch = $lines | Where-Object { $_ -match 'https://[a-zA-Z0-9\-]+\.trycloudflare\.com' } | Select-Object -First 1
    if ($urlMatch) {
        $tunnelUrl = $urlMatch.Trim()
    }
}

if ($tunnelUrl) {
    Write-Host "✅ 隧道已就绪！公网访问地址：" -ForegroundColor Green
    Write-Host "    $tunnelUrl" -ForegroundColor Cyan

    # 弹出消息框并保持窗口打开
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
        "隧道已就绪！`n`n公网访问地址：`n$tunnelUrl`n`n⚠️ 关闭此窗口将停止本地服务与隧道。",
        "ni-mission-control 已启动",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Information
    )
} else {
    Write-Host "⚠️ 未自动提取到 URL，请手动查看 tunnel.log" -ForegroundColor Yellow
    Read-Host "按 Enter 键继续..."
}

Write-Host "`n📌 请保持此窗口打开，直到你完成操作。" -ForegroundColor Yellow
Write-Host "按 Enter 键退出并停止所有进程..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")