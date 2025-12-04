# Deploy to Netlify Script

Write-Host "Starting Deployment Process..." -ForegroundColor Cyan

# 1. Build Client
Write-Host "Building Client..." -ForegroundColor Yellow
Set-Location "client"
try {
    npm install
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    Write-Host "Client Build Successful!" -ForegroundColor Green
}
catch {
    Write-Error "Failed to build client. Please check errors above."
    exit 1
}

# 2. Check for Netlify CLI
if (Get-Command "netlify" -ErrorAction SilentlyContinue) {
    Write-Host "Netlify CLI found. Deploying..." -ForegroundColor Yellow
    # Deploy to production
    netlify deploy --prod --dir=dist
}
else {
    Write-Warning "Netlify CLI not found."
    Write-Host "To deploy automatically, install the CLI: npm install -g netlify-cli" -ForegroundColor Gray
    Write-Host "---------------------------------------------------" -ForegroundColor White
    Write-Host "MANUAL DEPLOYMENT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Go to https://app.netlify.com"
    Write-Host "2. Drag and drop the 'client/dist' folder into the 'Sites' area."
    Write-Host "---------------------------------------------------" -ForegroundColor White
    
    # Open the dist folder for convenience
    Invoke-Item "dist"
}

Set-Location ..
Write-Host "Done." -ForegroundColor Cyan
