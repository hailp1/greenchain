# GreenChain Environment Setup Script (Windows PowerShell)

Write-Host "--- GreenChain System Initialization ---" -ForegroundColor Cyan

# 1. Check for Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Node.js is installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found. Please install it from https://nodejs.org/" -ForegroundColor Red
    exit
}

# 2. Check for Go
if (Get-Command go -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Go is installed" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Go not found. Cosmos SDK requires Go." -ForegroundColor Yellow
}

# 3. Check for Ignite CLI
if (Get-Command ignite -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Ignite CLI is installed" -ForegroundColor Green
} else {
    Write-Host "[INFO] Ignite CLI not found. Installing now..." -ForegroundColor Cyan
    # Installation command for Ignite on Windows usually requires manual or curl
    Write-Host "Please run: curl https://get.ignite.com/cli! | bash" -ForegroundColor Yellow
}

# 4. Install NPM Dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Cyan
npm install

# 5. Create .env if not exists
if (!(Test-Path .env)) {
    Write-Host "Creating .env template..." -ForegroundColor Cyan
    @'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
COSMOS_RPC_URL=http://localhost:26657
PORT=3000
'@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "[OK] .env created. Please fill in your Supabase credentials." -ForegroundColor Green
}

Write-Host "`nSetup Complete! To start the system:" -ForegroundColor Cyan
Write-Host "1. Run 'ignite chain serve' in a separate terminal."
Write-Host "2. Run 'node api.js' to start the receiver."
Write-Host "3. Run 'node bridge.js' to start anchoring."
