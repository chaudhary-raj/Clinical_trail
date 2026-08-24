@echo off
:: Clinical Trial Management System — Dev Startup Script
:: Double-click this file to start both server and client

set NODE="C:\Users\darkp\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

echo ==========================================
echo  Clinical Trial Management System
echo  Starting development servers...
echo ==========================================
echo.

:: Start the backend server in a new terminal
start "CTMS Backend (port 5000)" cmd /k "cd /d %~dp0server && %NODE% node_modules\.bin\nodemon server.js"

:: Wait 3 seconds for backend to initialise before starting frontend
timeout /t 3 /nobreak >nul

:: Start the React frontend in a new terminal
start "CTMS Frontend (port 3000)" cmd /k "cd /d %~dp0client && set PORT=3000 && %NODE% node_modules\.bin\react-scripts start"

echo Both servers are starting in separate windows:
echo   Backend  ^> http://localhost:5000
echo   Frontend ^> http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
