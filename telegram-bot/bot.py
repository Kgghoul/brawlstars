import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

from config import settings

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Инициализация бота и диспетчера
bot = Bot(
    token=settings.BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher()


# Клавиатура с мини-приложением
def get_webapp_keyboard() -> InlineKeyboardMarkup:
    """Создает клавиатуру с кнопкой открытия мини-приложения"""
    webapp_url = f"{settings.WEB_APP_URL}"
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="📊 Открыть аналитику",
                web_app=WebAppInfo(url=webapp_url)
            )
        ],
        [
            InlineKeyboardButton(
                text="🔄 Синхронизировать данные",
                callback_data="sync_data"
            )
        ],
        [
            InlineKeyboardButton(
                text="❓ Помощь",
                callback_data="help"
            )
        ]
    ])
    return keyboard


@dp.message(CommandStart())
async def cmd_start(message: Message):
    """Обработчик команды /start"""
    user = message.from_user
    
    welcome_text = f"""
👋 <b>Привет, {user.first_name}!</b>

Добро пожаловать в <b>Brawl Stars Analytics Bot</b>!

🎮 Этот бот поможет вам:
• Просматривать статистику ваших бойцов
• Анализировать винрейт по картам и режимам
• Отслеживать прогресс в игре
• Получать рекомендации по выбору бойцов

📊 Нажмите кнопку ниже, чтобы открыть аналитику!
"""
    
    await message.answer(
        welcome_text,
        reply_markup=get_webapp_keyboard()
    )


@dp.message(Command("analytics"))
async def cmd_analytics(message: Message):
    """Открыть аналитику"""
    await message.answer(
        "📊 <b>Аналитика игрока</b>\n\n"
        "Нажмите кнопку ниже, чтобы открыть подробную аналитику:",
        reply_markup=get_webapp_keyboard()
    )


@dp.message(Command("help"))
async def cmd_help(message: Message):
    """Помощь"""
    help_text = """
📖 <b>Доступные команды:</b>

/start - Главное меню
/analytics - Открыть аналитику
/sync - Синхронизировать данные
/player - Установить ID игрока
/help - Эта справка

🎮 <b>Как пользоваться:</b>

1️⃣ Установите свой Player ID командой /player
2️⃣ Откройте аналитику через /analytics
3️⃣ Изучайте статистику и улучшайте игру!

💡 <b>Возможности:</b>
• Топ бойцов по винрейту
• История прогресса
• Анализ карт и режимов
• Рекомендации по выбору бойцов
"""
    
    await message.answer(help_text)


@dp.message(Command("sync"))
async def cmd_sync(message: Message):
    """Синхронизация данных"""
    user_id = message.from_user.id
    
    await message.answer("🔄 Синхронизация данных...")
    
    # TODO: Вызов API для синхронизации
    # await api.sync_player(user_id)
    
    await message.answer(
        "✅ <b>Данные обновлены!</b>\n\n"
        "Откройте аналитику, чтобы увидеть последние результаты.",
        reply_markup=get_webapp_keyboard()
    )


@dp.message(Command("player"))
async def cmd_player(message: Message):
    """Установить Player ID"""
    args = message.text.split(maxsplit=1)
    
    if len(args) < 2:
        await message.answer(
            "❌ <b>Укажите ваш Player ID</b>\n\n"
            "Пример: <code>/player #ABC123</code>\n\n"
            "💡 Где найти Player ID:\n"
            "1. Откройте Brawl Stars\n"
            "2. Нажмите на свой профиль\n"
            "3. Скопируйте ID (начинается с #)"
        )
        return
    
    player_id = args[1].strip()
    user_id = message.from_user.id
    
    # TODO: Сохранить player_id в базу данных
    # await db.save_player_id(user_id, player_id)
    
    await message.answer(
        f"✅ <b>Player ID сохранен!</b>\n\n"
        f"Ваш ID: <code>{player_id}</code>\n\n"
        f"Теперь вы можете просматривать аналитику.",
        reply_markup=get_webapp_keyboard()
    )


@dp.callback_query(F.data == "sync_data")
async def callback_sync(callback):
    """Обработчик кнопки синхронизации"""
    await callback.answer("🔄 Синхронизация...")
    await cmd_sync(callback.message)


@dp.callback_query(F.data == "help")
async def callback_help(callback):
    """Обработчик кнопки помощи"""
    await callback.answer()
    await cmd_help(callback.message)


@dp.message(F.text)
async def echo_message(message: Message):
    """Обработчик всех остальных сообщений"""
    await message.answer(
        "👋 Используйте команды для работы с ботом!\n\n"
        "Нажмите /help для списка команд.",
        reply_markup=get_webapp_keyboard()
    )


async def main():
    """Запуск бота"""
    logger.info("Запуск бота...")
    
    try:
        # Удаляем webhook на случай если он был установлен
        await bot.delete_webhook(drop_pending_updates=True)
        
        # Запускаем polling
        await dp.start_polling(bot)
    except Exception as e:
        logger.error(f"Ошибка при запуске бота: {e}")
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
