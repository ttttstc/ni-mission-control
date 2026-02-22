Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

function Show-Info($msg){ [System.Windows.Forms.MessageBox]::Show($msg,'ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null }
function Show-Warn($msg){ [System.Windows.Forms.MessageBox]::Show($msg,'ni-mission-control',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Warning) | Out-Null }

Start-Process cmd.exe -ArgumentList '/k', "cd /d \"$projectRoot\" && npm run dev"
Start-Sleep -Seconds 6

$tunnelLog = Join-Path $projectRoot 'tunnel.log'
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }
Start-Process cmd.exe -ArgumentList '/k', "cd /d \"$projectRoot\" && npx cloudflared@latest tunnel --url http://localhost:3000 > tunnel.log 2>&1"

$url = $null
for($i=0; $i -lt 50; $i++){
  Start-Sleep -Seconds 1
  if(Test-Path $tunnelLog){
    $m = Select-String -Path $tunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue
    if($m){
      $url = $m.Matches[-1].Value
      break
    }
  }
}

if(-not $url){
  Show-Warn "未提取到公网 URL，请查看 tunnel.log"
  exit 1
}

Set-Clipboard -Value $url
Start-Process $url
Show-Info "公网 URL 已提取并复制到剪贴板：`n`n$url`n`n已自动在浏览器中打开。"
