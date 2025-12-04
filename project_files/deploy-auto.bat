@echo off
echo ========================================
echo Automated Netlify Deployment
echo ========================================
echo.

cd simple-client

echo Creating new Netlify site...
netlify sites:create --name wedding-planner-%RANDOM% --manual

echo.
echo Deploying to production...
netlify deploy --prod --dir=.

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
pause
