@echo off
TITLE MetroHealth AI Platform Launcher
echo ===================================================
echo     Launching MetroHealth AI Hospital Platform
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "MetroHealth Backend" cmd /k "cd backend && python -m uvicorn app.main:app --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Vite Frontend on http://localhost:5173 ...
start "MetroHealth Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo   System is running! 
echo   Backend: http://127.0.0.1:8000/docs
echo   Frontend: http://localhost:5173
echo ===================================================
pause
