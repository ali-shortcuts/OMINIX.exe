@echo off
title OMINIX Office AI - Windows Launcher
color 0B

echo =============================================================
echo    OMINIX OFFICE AI - MICROSOFT OFFICE ADD-IN LAUNCHER
echo    Created by Mr Ali (https://github.com/ali-shortcuts)
echo =============================================================
echo.

echo [*] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js was not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [*] Registering Office Add-in Manifest...
set ADDIN_DIR=%APPDATA%\Microsoft\Office\OMINIX-Addin
if not exist "%ADDIN_DIR%" mkdir "%ADDIN_DIR%"
if exist "office-addin\manifest.xml" (
    copy /y "office-addin\manifest.xml" "%ADDIN_DIR%\manifest.xml" >nul
    echo [✓] Manifest copied to %ADDIN_DIR%
)

echo [*] Starting OMINIX AI Server on port 3000...
start "" cmd /c "npm start || node dist/server.cjs"

timeout /t 3 >nul

echo [*] Opening OMINIX Office AI Taskpane in default browser...
start http://localhost:3000

echo.
echo =============================================================
echo  OMINIX is now running!
echo  Open Microsoft Word, Excel, or PowerPoint to use the add-in.
echo =============================================================
echo.
pause
