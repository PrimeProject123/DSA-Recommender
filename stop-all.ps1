# stop-all.ps1 — Stop all DSA-Recommender services
# Kills processes on ports 3000, 5000, and 8000

Write-Host "Stopping DSA-Recommender services..." -ForegroundColor Yellow

$ports = @(3000, 5000, 8000)
$labels = @{ 3000 = "Frontend (Next.js)"; 5000 = "Node Backend (Express)"; 8000 = "ML Backend (FastAPI)" }

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "  Stopping $($labels[$port]) (PID $procId)..." -ForegroundColor Red
                Stop-Process -Id $procId -Force
            }
        }
    } else {
        Write-Host "  $($labels[$port]) — not running" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "All services stopped." -ForegroundColor Green
