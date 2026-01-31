@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   Brawl Stars Analytics Bot
echo ============================================
echo.

echo Starting Telegram Bot...
python bot.py

pause
