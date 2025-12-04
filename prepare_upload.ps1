$ErrorActionPreference = 'Stop'
$src = 'C:\Users\cc022\.gemini\antigravity\playground\gravitic-cluster'
$dest = 'C:\Users\cc022\.gemini\antigravity\playground\gravitic-cluster\temp_deploy'
$zip = 'C:\Users\cc022\.gemini\antigravity\playground\gravitic-cluster\project_files.zip'

Write-Host "Cleaning up previous runs..."
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
if (Test-Path $zip) { Remove-Item $zip -Force }

Write-Host "Creating temp directory..."
New-Item -ItemType Directory -Path $dest | Out-Null

Write-Host "Copying files (excluding node_modules, .git, etc)..."
# Get top level items
$items = Get-ChildItem $src -Exclude 'node_modules', '.git', '.netlify', '.vercel', 'dist', 'build', 'temp_deploy', 'project_files.zip', 'gravitic-cluster.zip'

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $dest -Recurse -Container
}

Write-Host "Removing nested node_modules..."
Get-ChildItem $dest -Include 'node_modules' -Recurse | Remove-Item -Recurse -Force

Write-Host "Zipping files to $zip..."
Compress-Archive -Path "$dest\*" -DestinationPath $zip -Force

Write-Host "Cleaning up temp directory..."
Remove-Item $dest -Recurse -Force

Write-Host "Done! Zip created at $zip"
