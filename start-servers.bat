@echo off
title Dan Classic Furniture - Server Launcher
echo ========================================
echo   Dan Classic Furniture - Starting...
echo ========================================
echo.

:: Start Backend Server in new window
echo Starting Backend Server (FastAPI)...
start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to initialize
timeout /t 2 /nobreak > nul

:: Start Frontend Server in new window
echo Starting Frontend Server (Vite)...
start "Frontend - Vite" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
echo   Close both terminal windows to stop.
echo ========================================
echo.

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo Browser opened! You can close this window.
timeout /t 3 > nul
