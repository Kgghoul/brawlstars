# Brawl Stars Analytics

Полнофункциональное веб-приложение для аналитики игроков Brawl Stars с Telegram ботом и мини-приложением.

## 🎮 Возможности

- **Angular Web App** - современный интерфейс для просмотра аналитики
- **Telegram Bot** - бот с WebApp интеграцией (@primerbaotbot)
- **FastAPI Backend** - REST API с mock данными
- **Аналитика игроков** - статистика бойцов, винрейт, карты
- **Графики и визуализация** - интерактивные графики прогресса

## 🚀 Быстрый старт

### Angular Web App

```bash
npm install
npm start
```

Откройте http://localhost:4200

### Telegram Bot + API

```bash
cd telegram-bot
pip install -r requirements.txt

# Создайте .env файл (см. .env.example)
python -c "open('.env', 'w', encoding='utf-8').write('BOT_TOKEN=your_token_here\n...')"

# Запустите
python bot.py     # Терминал 1
python api.py     # Терминал 2
```

## 📚 Структура проекта

```
brawlstars-app/
├── src/                          # Angular приложение
│   ├── app/
│   │   ├── analytics/           # Компоненты аналитики
│   │   ├── services/            # API сервисы
│   │   └── models/              # TypeScript модели
│   └── environments/            # Конфигурация окружений
├── telegram-bot/                # Telegram бот и API
│   ├── bot.py                   # Telegram бот (aiogram)
│   ├── api.py                   # FastAPI сервер
│   ├── config.py                # Конфигурация
│   └── requirements.txt         # Python зависимости
├── mock-api/                    # Mock данные для разработки
└── docs/                        # Документация
```

## 🛠 Технологии

**Frontend:**
- Angular 21
- TypeScript 5.9
- RxJS 7.8
- SCSS

**Backend:**
- Python 3.12
- FastAPI 0.115
- aiogram 3.16 (Telegram Bot)
- uvicorn 0.34

## 📖 Документация

- [API Integration](API_INTEGRATION.md) - Полная документация API
- [Quick Start API](QUICK_START_API.md) - Быстрый старт с API
- [Telegram Bot Setup](telegram-bot/README.md) - Настройка бота
- [Mock API Setup](MOCK_API_SETUP.md) - Настройка mock сервера
- [FAQ](FAQ.md) - Часто задаваемые вопросы

## 🎯 API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/analytics/{playerId}/brawlers` | Топ бойцов игрока |
| GET | `/analytics/{playerId}/brawlers/{brawler}/winrate-history` | История винрейта |
| GET | `/analytics/{playerId}/maps/{map}/brawlers` | Бойцы на карте |
| POST | `/admin/sync/{playerId}` | Синхронизация данных |

## 🤖 Telegram Bot

Бот: [@primerbaotbot](https://t.me/primerbaotbot)

**Команды:**
- `/start` - Главное меню
- `/analytics` - Открыть аналитику
- `/sync` - Синхронизировать данные
- `/player <ID>` - Установить Player ID
- `/help` - Справка

## 🔧 Настройка

### 1. Angular App

```bash
npm install
```

Настройте API URL в `src/environments/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://localhost:3000'
};
```

### 2. Telegram Bot

```bash
cd telegram-bot
pip install -r requirements.txt
```

Создайте `.env` файл:
```env
BOT_TOKEN=your_bot_token
API_HOST=0.0.0.0
API_PORT=3000
WEB_APP_URL=http://localhost:4200
```

### 3. Запуск

```bash
# Angular
npm start

# Telegram Bot
cd telegram-bot
python bot.py

# API Server
cd telegram-bot
python api.py
```

## 📊 Примеры использования

### Получение аналитики через API

```typescript
this.analyticsService.getTopBrawlers(3).subscribe({
  next: (brawlers) => {
    console.log('Топ бойцы:', brawlers);
  }
});
```

### График винрейта

```html
<app-winrate-chart
  [data]="chartData"
  [width]="272"
  [height]="180"
  [lineColor]="'#EF7527'">
</app-winrate-chart>
```

## 🧪 Тестирование

### API

```bash
# Swagger UI
http://localhost:3000/docs

# Health check
curl http://localhost:3000/health

# Test endpoint
curl http://localhost:3000/analytics/ABC123/brawlers
```

### Telegram Bot

```bash
cd telegram-bot
python test_bot.py
```

## 🌐 Production Deploy

### Angular (Vercel/Netlify)

```bash
ng build --configuration production
# Upload dist/ folder
```

### API (Railway/Render)

```bash
cd telegram-bot
# Deploy через Git или Docker
```

### Telegram Bot

Запустите на том же сервере что и API или отдельно.

## 📝 Лицензия

MIT

## 👥 Автор

Разработано с использованием Angular, FastAPI и aiogram.

## 🔗 Ссылки

- [Angular Documentation](https://angular.io/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [aiogram Documentation](https://docs.aiogram.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## ⭐ Поддержка

Если проект полезен, поставьте звезду на GitHub!
