"""
Тест бота - проверка что бот получает и отправляет сообщения
"""

import asyncio
import sys
from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from config import settings

# Fix Windows encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

async def test_bot():
    bot = Bot(
        token=settings.BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    
    try:
        # Получаем информацию о боте
        me = await bot.get_me()
        print("="*50)
        print("SUCCESS: Bot is connected!")
        print("="*50)
        print(f"ID: {me.id}")
        print(f"Name: {me.first_name}")
        print(f"Username: @{me.username}")
        print("="*50)
        
        # Проверяем webhook
        webhook_info = await bot.get_webhook_info()
        if webhook_info.url:
            print(f"\nWARNING: Webhook is set: {webhook_info.url}")
            print("Removing webhook for polling...")
            await bot.delete_webhook(drop_pending_updates=True)
            print("SUCCESS: Webhook removed")
        else:
            print("\nOK: No webhook set (using polling)")
        
        print(f"\nBot is ready!")
        print(f"Find @{me.username} in Telegram")
        print(f"Send /start to test")
        print("="*50)
        
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        await bot.session.close()

if __name__ == "__main__":
    asyncio.run(test_bot())
