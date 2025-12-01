# Deploy Simple Client to Netlify

Write-Host "Deploying Wedding Planner to Netlify..." -ForegroundColor Cyan

# Check if Netlify CLI is installed
if (-not (Get-Command "netlify" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install Netlify CLI"
        exit 1
    }
}

Write-Host "Netlify CLI ready!" -ForegroundColor Green

# Navigate to simple-client directory
Set-Location "simple-client"

Write-Host "`nDeploying to Netlify..." -ForegroundColor Yellow
Write-Host "Directory: simple-client" -ForegroundColor Gray

# Deploy to Netlify
# First deployment will prompt for site setup
netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "`nYour site is now live on Netlify!" -ForegroundColor Cyan
}
else {
    Write-Error "Deployment failed. Please check the errors above."
}

Set-Location ..
