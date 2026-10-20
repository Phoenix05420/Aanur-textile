@echo off
title Aanur Textile
color 0E

echo ============================================
echo          Aanur Textile
echo         Comfort, Considered.
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH.
    echo         Download it from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Show Node.js and npm versions
echo [INFO] Node.js version:
call node --version
echo [INFO] npm version:
call npm --version
echo.

:: Install dependencies if node_modules is missing or incomplete
if not exist "node_modules\" (
    echo [SETUP] node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] npm install failed. Check your network connection.
        pause
        exit /b 1
    )
    echo [SETUP] Dependencies installed successfully.
    echo.
) else (
    echo [OK] node_modules found. Skipping install.
    echo.
)

:: Check MongoDB Atlas configuration in .env
if exist ".env" (
    findstr /C:"mongodb" ".env" >nul 2>nul
    if %errorlevel% equ 0 (
        echo [DATABASE] MongoDB Atlas connection active in .env
    ) else (
        echo [DATABASE] MongoDB Atlas not configured. Add MONGODB_URI to .env
    )
    findstr /C:"re_" ".env" >nul 2>nul
    if %errorlevel% equ 0 (
        echo [EMAIL]    Resend Email active (Order details will be sent to Gmail)
    ) else (
        echo [EMAIL]    Resend Email not configured. Add RESEND_API_KEY to .env to send order emails to Gmail.
    )
) else (
    echo [DATABASE] Create .env with MONGODB_URI to connect MongoDB Atlas.
)
echo.

:: Start the Vite dev server
echo [START] Launching Vite dev server (Frontend + Express API)...
echo         The site will open at  http://localhost:5173
echo         Press Ctrl+C to stop the server.
echo ============================================
echo.

call npm run dev
