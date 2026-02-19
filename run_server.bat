@echo off
cls
title Codename NOVA

echo ===============================
echo   Starting Game Dev Server...
echo ===============================
echo.

timeout /t 1 >nul
start "" http://localhost:8000
python -m http.server 8000

echo.
echo Server stopped.
pause

