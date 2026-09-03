@echo off
title Install OMINIX Office Add-in
color 0A

echo ========================================================
echo    OMINIX OFFICE AI - MICROSOFT OFFICE ADD-IN INSTALLER
echo    Developed by Mr Ali (https://github.com/ali-shortcuts)
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0
set MANIFEST_PATH=%SCRIPT_DIR%manifest.xml
set TARGET_DIR=%APPDATA%\Microsoft\Office\OMINIX-Addin

if not exist "%MANIFEST_PATH%" (
    echo [!] Error: manifest.xml not found in %SCRIPT_DIR%
    pause
    exit /b 1
)

echo [*] Creating Office Add-in destination directory...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [*] Copying manifest.xml...
copy /y "%MANIFEST_PATH%" "%TARGET_DIR%\manifest.xml" >nul

echo [*] Configuring Windows Registry for Office Trusted Catalogs...
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{D72B380A-5DFB-4024-8F24-9DFA868A8B5E}" /v "Id" /t REG_SZ /d "{D72B380A-5DFB-4024-8F24-9DFA868A8B5E}" /f >nul
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{D72B380A-5DFB-4024-8F24-9DFA868A8B5E}" /v "Url" /t REG_SZ /d "%TARGET_DIR%" /f >nul
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{D72B380A-5DFB-4024-8F24-9DFA868A8B5E}" /v "Flags" /t REG_DWORD /d 1 /f >nul

echo.
echo ========================================================
echo [✓] OMINIX Add-in has been successfully registered!
echo.
echo  Next steps:
echo  1. Launch OMINIX-Launcher.bat (or OMINIX.exe).
echo  2. Open Word, Excel, or PowerPoint.
echo  3. Go to Insert - My Add-ins - Shared Folder, or look
echo     for the "OMINIX AI" tab in the Ribbon.
echo ========================================================
echo.
pause
