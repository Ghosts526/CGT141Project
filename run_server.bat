REM This is a program to run the game on a local server
REM This is meant for testing purposes
REM This does require Python to be installed on your computer

@echo off
cls
title Operation Breakpoint

echo ===============================
echo  Starting Local Game Server...
echo ===============================
echo.

timeout /t 1 >nul
start "" http://localhost:8000

echo ===============================
echo Local Game Server Is Running...
echo ===============================
echo.

python -m http.server 8000

echo.
echo Server stopped.
pause

