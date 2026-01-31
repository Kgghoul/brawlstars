#!/usr/bin/env python3
"""
Скрипт для одновременного запуска API и бота
"""

import asyncio
import subprocess
import sys
import time
import signal
import os
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Цвета для вывода
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_colored(text: str, color: str):
    try:
        print(f"{color}{text}{Colors.ENDC}")
    except UnicodeEncodeError:
        # Fallback без эмоджи
        print(text.encode('ascii', 'ignore').decode())


def check_requirements():
    """Проверить установлены ли зависимости"""
    try:
        import aiogram
        import fastapi
        import uvicorn
        return True
    except ImportError:
        return False


def main():
    print_colored("=" * 60, Colors.HEADER)
    print_colored("🎮 Brawl Stars Analytics Bot", Colors.HEADER + Colors.BOLD)
    print_colored("=" * 60, Colors.HEADER)
    print()
    
    # Проверка зависимостей
    if not check_requirements():
        print_colored("❌ Не установлены зависимости!", Colors.FAIL)
        print_colored("Запустите: pip install -r requirements.txt", Colors.WARNING)
        sys.exit(1)
    
    print_colored("✅ Зависимости установлены", Colors.OKGREEN)
    print()
    
    # Проверка .env файла
    if not Path(".env").exists():
        print_colored("⚠️  Файл .env не найден!", Colors.WARNING)
        print_colored("Скопируйте .env.example в .env и настройте", Colors.WARNING)
        sys.exit(1)
    
    print_colored("✅ Файл .env найден", Colors.OKGREEN)
    print()
    
    processes = []
    
    try:
        # Проверяем что мы в правильной директории
        script_dir = Path(__file__).parent
        os.chdir(script_dir)
        
        # Запуск API сервера
        print_colored("Запуск API сервера...", Colors.OKCYAN)
        api_process = subprocess.Popen(
            [sys.executable, "api.py"],
            cwd=script_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(("API", api_process))
        time.sleep(3)  # Даем время API серверу запуститься
        
        if api_process.poll() is not None:
            print_colored("API сервер не запустился", Colors.FAIL)
            print_colored("Попробуйте запустить вручную: python telegram-bot/api.py", Colors.WARNING)
            sys.exit(1)
        
        print_colored("✅ API сервер запущен на http://localhost:3000", Colors.OKGREEN)
        print()
        
        # Запуск Telegram бота
        print_colored("🤖 Запуск Telegram бота...", Colors.OKCYAN)
        bot_process = subprocess.Popen(
            [sys.executable, "bot.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(("Bot", bot_process))
        time.sleep(2)
        
        if bot_process.poll() is not None:
            print_colored("❌ Бот не запустился", Colors.FAIL)
            sys.exit(1)
        
        print_colored("✅ Telegram бот запущен", Colors.OKGREEN)
        print()
        
        print_colored("=" * 60, Colors.HEADER)
        print_colored("✅ Все сервисы запущены!", Colors.OKGREEN + Colors.BOLD)
        print_colored("=" * 60, Colors.HEADER)
        print()
        
        print_colored("📊 API: http://localhost:3000", Colors.OKBLUE)
        print_colored("📚 API Docs: http://localhost:3000/docs", Colors.OKBLUE)
        print_colored("🤖 Telegram бот: @YourBotName", Colors.OKBLUE)
        print()
        
        print_colored("Нажмите Ctrl+C для остановки", Colors.WARNING)
        print()
        
        # Ожидание
        while True:
            time.sleep(1)
            
            # Проверка что процессы живы
            for name, process in processes:
                if process.poll() is not None:
                    print_colored(f"❌ {name} завершился!", Colors.FAIL)
                    raise KeyboardInterrupt
    
    except KeyboardInterrupt:
        print()
        print_colored("🛑 Остановка сервисов...", Colors.WARNING)
        
        for name, process in processes:
            print_colored(f"Остановка {name}...", Colors.OKCYAN)
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
        
        print_colored("✅ Все сервисы остановлены", Colors.OKGREEN)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_colored(f"❌ Ошибка: {e}", Colors.FAIL)
        sys.exit(1)
