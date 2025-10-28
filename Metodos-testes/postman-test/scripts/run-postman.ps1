# start-postman.ps1
# Starts backend in in-memory mode, waits for /health and runs Postman collections via Newman.
# Usage: Open PowerShell as Administrator and run from repo root:
#   .\postman-test\scripts\run-postman.ps1

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Write-Host "Repository root detected: $repoRoot"

# Paths
$backendPath = Join-Path $repoRoot 'cinema-challenge-back'
$frontCollection = Join-Path $repoRoot 'postman-test\postman-front\test-front'
$backCollection = Join-Path $repoRoot 'postman-test\postman-back\test-back'
$reportsDir = Join-Path $repoRoot 'postman-test\reports'

# Ensure reports dir
if (-Not (Test-Path $reportsDir)) { New-Item -ItemType Directory -Path $reportsDir | Out-Null }

# Start backend in-memory
Write-Host "Starting backend (in-memory)..."
Push-Location $backendPath
# Use Start-Process to detach so we can run Newman from this script
$nodeCmd = "node"
$envCommand = "`$env:USE_IN_MEMORY_DB='true'; $nodeCmd src/index.js"
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoProfile -Command $envCommand"
Pop-Location

# Poll /health
$baseApi = 'http://localhost:5000/api/v1'
$healthUrl = "$baseApi/health"
$maxWaitSec = 60
$waited = 0
Write-Host "Waiting for backend health at $healthUrl (timeout ${maxWaitSec}s)..."
while ($waited -lt $maxWaitSec) {
    try {
        $resp = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5
        if ($resp.StatusCode -eq 200) { Write-Host "Backend healthy."; break }
    } catch {
        Start-Sleep -Seconds 1
        $waited += 1
    }
}
if ($waited -ge $maxWaitSec) { Write-Error "Backend did not become healthy within timeout."; exit 1 }

# Run Newman collections
Write-Host "Running backend Postman collection via Newman..."
$backJson = Join-Path $reportsDir 'newman-back-report.json'
$backHtml = Join-Path $reportsDir 'newman-back-report.html'
npx newman run "$backCollection" --env-var "base_api=http://localhost:5000/api/v1" -r cli,html,json --reporter-html-export "$backHtml" --reporter-json-export "$backJson"

Write-Host "Running front Postman collection via Newman..."
$frontJson = Join-Path $reportsDir 'newman-front-report.json'
$frontHtml = Join-Path $reportsDir 'newman-front-report.html'
npx newman run "$frontCollection" --env-var "base_front=http://127.0.0.1:3002" -r cli,html,json --reporter-html-export "$frontHtml" --reporter-json-export "$frontJson"

# Parse and update README using Node script
$parser = Join-Path $repoRoot 'postman-test\scripts\parse-newman-and-update-readme.js'
if (Test-Path $parser) {
    Write-Host "Parsing Newman JSON and updating Playwright manual README..."
    node $parser --back $backJson --front $frontJson --readme "$repoRoot\playwright-tests\test-manual\Readme.md"
} else {
    Write-Host "Parser script not found, skipping README update."
}

Write-Host "Done. Reports are in: $reportsDir"
