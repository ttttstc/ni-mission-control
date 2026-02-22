$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path $PSScriptRoot 'launch-tunnel-gui.ps1'
$outPath = Join-Path $PSScriptRoot 'launch-tunnel-gui.exe'

try { Set-PSRepository -Name PSGallery -InstallationPolicy Trusted -ErrorAction SilentlyContinue } catch {}
if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) {
  Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Scope CurrentUser
}

if (-not (Get-Module -ListAvailable -Name ps2exe)) {
  Install-Module -Name ps2exe -Scope CurrentUser -Force -AllowClobber
}

Import-Module ps2exe -Force
Invoke-ps2exe -inputFile $scriptPath -outputFile $outPath -noConsole -title 'ni-mission-control launcher' -description 'Start local service + tunnel + open URL'
Write-Host "EXE built: $outPath"