@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   Brawl Stars Analytics API
echo ============================================
echo.

echo Starting API Server...
python api.py

pause
