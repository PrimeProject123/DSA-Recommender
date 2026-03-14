# start-all.ps1 - Launch all 3 DSA-Recommender services
# Usage: Right-click > Run with PowerShell, or from terminal: .\start-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DSA-Recommender - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# ---------- 1. Python ML Backend (port 8000) ----------
Write-Host "[1/3] Starting Python ML Backend (port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$root\dsa_backend'; Write-Host 'ML Backend (FastAPI) starting...' -ForegroundColor Green; python main.py"
)

# ---------- 2. Node.js Backend (port 5000) ----------
Write-Host "[2/3] Starting Node.js Backend (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$root\leetcode_backend'; Write-Host 'Node Backend (Express) starting...' -ForegroundColor Green; node app.js"
)

# ---------- 3. Next.js Frontend (port 3000) ----------
Write-Host "[3/3] Starting Next.js Frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$root\frontend'; Write-Host 'Frontend (Next.js) starting...' -ForegroundColor Green; npm run dev"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services launched!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "  Node Backend:    http://localhost:5000" -ForegroundColor White
Write-Host "  ML Backend:      http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "  Each service runs in its own window." -ForegroundColor Gray
Write-Host "  Close the windows to stop individual services." -ForegroundColor Gray
Write-Host ""

# Optional: wait for user input before closing this launcher window
Read-Host "Press Enter to exit this launcher"
