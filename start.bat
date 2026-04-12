@echo off
title SMART Mobility Platform

echo.
echo  ==========================================
echo   SMART Mobility Platform — Launcher
echo  ==========================================
echo.

:: Check Node is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js not found. Install from nodejs.org
  pause
  exit /b 1
)

:: Install express if node_modules missing
if not exist "node_modules\express" (
  echo  [1/3] Installing express...
  call npm install express
  echo.
)

:: Build the React app
echo  [2/3] Building React app...
call npm run build
if %errorlevel% neq 0 (
  echo  [ERROR] Build failed. Check errors above.
  pause
  exit /b 1
)
echo.

:: Open firewall port 3000 silently (needs admin — skip if it fails)
echo  [3/3] Opening firewall port 3000...
netsh advfirewall firewall add rule name="SMART Mobility 3000" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1

:: Start the server
echo.
echo  Starting server...
echo.
node server.js

pause
