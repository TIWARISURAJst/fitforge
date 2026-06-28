@echo off
title FitForge Launcher
echo Starting FitForge Desktop App...

:: Check if the server is already running on port 8000
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo FitForge server is already active.
    goto launch
)

:: Check for python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting background local server via Python...
    start /min "" python -m http.server 8000
    goto wait_and_launch
)

:: Check for node
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting background local server via Node.js...
    start /min "" node server.mjs
    goto wait_and_launch
)

echo ERROR: Neither Python nor Node.js was found in your PATH.
echo Please install Node.js or Python to run FitForge locally.
pause
exit

:wait_and_launch
:: Give the server a second to boot up
timeout /t 2 /nobreak >nul

:launch
echo Launching borderless application interface...
:: Check for Edge, fallback to Chrome, or standard browser
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start msedge --app="http://localhost:8000"
    goto end
)

where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start chrome --app="http://localhost:8000"
    goto end
)

:: Ultimate fallback: default browser
start http://localhost:8000

:end
echo FitForge loaded! You can close this command window.
exit
