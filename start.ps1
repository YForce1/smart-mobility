# SMART Mobility Platform — PowerShell Launcher
# Run: Right-click → Run with PowerShell
# Or:  powershell -ExecutionPolicy Bypass -File start.ps1

$Host.UI.RawUI.WindowTitle = "SMART Mobility Platform"

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host "   SMART Mobility Platform  -  Launcher    " -ForegroundColor Cyan
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check Node.js ──────────────────────────────────────────
Write-Host "  [1/4] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "        Found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Node.js not found. Download from https://nodejs.org" -ForegroundColor Red
    Read-Host "  Press Enter to exit"
    exit 1
}

# ── 2. Install express if needed ──────────────────────────────
if (-not (Test-Path "node_modules\express")) {
    Write-Host "  [2/4] Installing express..." -ForegroundColor Yellow
    npm install express | Out-Null
    Write-Host "        Done." -ForegroundColor Green
} else {
    Write-Host "  [2/4] express already installed." -ForegroundColor Green
}

# ── 3. Build the React app ────────────────────────────────────
Write-Host "  [3/4] Building React app (this takes ~30s)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERROR] Build failed. Check the errors above." -ForegroundColor Red
    Read-Host "  Press Enter to exit"
    exit 1
}
Write-Host "        Build complete." -ForegroundColor Green

# ── 4. Open Windows Firewall port 3000 ───────────────────────
Write-Host "  [4/4] Configuring firewall..." -ForegroundColor Yellow

# Remove old rule if exists, then add fresh
netsh advfirewall firewall delete rule name="SMART Mobility 3000" >$null 2>&1
$result = netsh advfirewall firewall add rule `
    name="SMART Mobility 3000" `
    dir=in action=allow protocol=TCP localport=3000 2>&1

if ($result -match "Ok") {
    Write-Host "        Firewall port 3000 opened." -ForegroundColor Green
} else {
    Write-Host "        Could not open firewall (may need Admin). Continuing anyway." -ForegroundColor Yellow
}

# ── Print network addresses ───────────────────────────────────
Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host "   Share these URLs with your testers:     " -ForegroundColor Cyan
Write-Host "  ==========================================" -ForegroundColor Cyan

$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -ne "127.0.0.1" -and $_.PrefixOrigin -ne "WellKnown"
}

foreach ($ip in $ips) {
    Write-Host "   http://$($ip.IPAddress):3000" -ForegroundColor White
}
Write-Host ""
Write-Host "   Local: http://localhost:3000" -ForegroundColor White
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Starting server... (Ctrl+C to stop)" -ForegroundColor Yellow
Write-Host ""

# ── Start the server ─────────────────────────────────────────
node server.js
