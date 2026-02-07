# Telegram Bot для Brawl Stars Analytics

## Описание
Telegram бот для просмотра аналитики игроков Brawl Stars через мини-приложение.

## Установка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Создайте файл `.env` и укажите токен бота:
```bash
python setup_env.py
```

Или создайте вручную файл `.env`:
```env
BOT_TOKEN=your_bot_token_here
API_BASE_URL=http://91.229.11.191:8080
WEB_APP_URL=https://kgghoul.github.io/brawlstars
DEFAULT_PLAYER_ID=101
```

## Запуск

### Запуск только бота:
```bash
python bot.py
```

### Запуск только API:
```bash
python api.py
```

### Запуск бота и API одновременно:
```bash
python run_all.py
```

## Команды бота

- `/start` - Главное меню
- `/analytics` - Открыть аналитику
- `/sync` - Синхронизировать данные с API
- `/player <ID>` - Установить ID игрока
- `/help` - Справка

## Особенности

- Интеграция с реальным API: `http://91.229.11.191:8080`
- Мини-приложение на GitHub Pages: `https://kgghoul.github.io/brawlstars`
- Использует Player ID: `101` по умолчанию
- Поддержка синхронизации данных через API

## Docker

Для развертывания через Docker:

```bash
docker build -t brawlstars-bot .
docker run -d --env-file .env brawlstars-bot
```

## API Endpoints

Документация доступна на: `http://91.229.11.191:8080/swagger/index.html`

Основные эндпоинты:
- `POST /admin/sync/{playerId}` - Синхронизация данных игрока
- `GET /analytics/{playerId}/brawlers` - Топ бойцов игрока
- `GET /analytics/{playerId}/brawlers/{brawler}/winrate-history` - История винрейта
- `GET /analytics/{playerId}/maps/{map}/brawlers` - Лучшие бойцы на карте
