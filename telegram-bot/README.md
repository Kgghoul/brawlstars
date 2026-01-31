# Telegram Bot для Brawl Stars Analytics

Telegram бот с мини-приложением для аналитики игроков Brawl Stars.

## Возможности

- 🤖 Telegram бот с командами
- 📊 Мини-приложение (WebApp) с полной аналитикой
- 🔄 Синхронизация данных игроков
- 📈 API для получения статистики
- 💾 База данных для хранения данных

## Структура проекта

```
telegram-bot/
├── bot.py                  # Telegram бот (aiogram)
├── api.py                  # FastAPI сервер
├── config.py               # Конфигурация
├── requirements.txt        # Зависимости
├── .env                    # Переменные окружения
├── database/
│   ├── models.py          # SQLAlchemy модели
│   └── crud.py            # CRUD операции
├── services/
│   └── brawl_stars.py     # Интеграция с Brawl Stars API
└── README.md
```

## Установка

### 1. Клонировать репозиторий

```bash
cd telegram-bot
```

### 2. Создать виртуальное окружение

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### 4. Настроить переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

```env
BOT_TOKEN=8553648447:AAF96eTpR9UqQatdkLO5PFRKfpsDR3J1Tl8
WEB_APP_URL=http://localhost:4200
API_BASE_URL=http://localhost:3000
```

## Запуск

### Вариант 1: Запуск бота и API отдельно

**Терминал 1: API сервер**
```bash
python api.py
```

**Терминал 2: Telegram бот**
```bash
python bot.py
```

### Вариант 2: Запуск через uvicorn + отдельно бот

```bash
# API
uvicorn api:app --host 0.0.0.0 --port 3000 --reload

# Бот
python bot.py
```

## Использование

### Команды бота

- `/start` - Главное меню с кнопкой мини-приложения
- `/analytics` - Открыть аналитику
- `/sync` - Синхронизировать данные
- `/player <ID>` - Установить Player ID
- `/help` - Справка

### Пример использования

1. Отправьте `/start` боту
2. Установите свой Player ID: `/player #ABC123`
3. Нажмите кнопку "📊 Открыть аналитику"
4. Изучайте статистику в мини-приложении

## API Endpoints

### Analytics

**GET** `/analytics/{player_id}/brawlers`
```json
{
  "player_id": "ABC123",
  "count": 10,
  "brawlers": [
    {
      "brawler": "Shelly",
      "matches": 120,
      "wins": 70,
      "win_rate": 0.583
    }
  ]
}
```

**GET** `/analytics/{player_id}/brawlers/{brawler}/winrate-history?days=30`
```json
{
  "player_id": "ABC123",
  "brawler": "Shelly",
  "days": 30,
  "history": [
    {
      "date": "2025-01-01",
      "matches": 5,
      "wins": 3,
      "win_rate": 0.6
    }
  ]
}
```

**GET** `/analytics/{player_id}/maps/{map}/brawlers`
```json
{
  "player_id": "ABC123",
  "map": "Gem Grab - Hard Rock Mine",
  "count": 5,
  "brawlers": [...]
}
```

**POST** `/admin/sync/{player_id}`
```json
{
  "player_id": "ABC123",
  "last_match_time": "2025-01-15T18:30:00Z",
  "message": "Данные успешно синхронизированы"
}
```

## Интеграция с Angular приложением

### 1. Обновите environment.ts

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // URL FastAPI сервера
};
```

### 2. Настройте Telegram WebApp

В `index.html` добавьте:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

В Angular компоненте:

```typescript
declare const Telegram: any;

ngOnInit() {
  // Получить данные от Telegram
  if (typeof Telegram !== 'undefined') {
    const webApp = Telegram.WebApp;
    const userId = webApp.initDataUnsafe?.user?.id;
    
    if (userId) {
      this.analyticsService.setPlayerId(userId.toString());
    }
  }
}
```

## Development

### Тестирование API

```bash
# Через curl
curl http://localhost:3000/analytics/ABC123/brawlers

# Через httpie
http GET http://localhost:3000/analytics/ABC123/brawlers

# Swagger UI
http://localhost:3000/docs
```

### Тестирование бота

1. Найдите вашего бота в Telegram: @YourBotUsername
2. Отправьте `/start`
3. Проверьте все команды

## Production Deployment

### 1. Настройте переменные окружения

```env
BOT_TOKEN=your_production_token
WEB_APP_URL=https://your-domain.com
API_BASE_URL=https://api.your-domain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 2. Запустите через systemd или supervisor

**systemd service для API:**

```ini
[Unit]
Description=Brawl Stars API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/telegram-bot
ExecStart=/path/to/venv/bin/uvicorn api:app --host 0.0.0.0 --port 3000
Restart=always

[Install]
WantedBy=multi-user.target
```

**systemd service для бота:**

```ini
[Unit]
Description=Brawl Stars Telegram Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/telegram-bot
ExecStart=/path/to/venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

### 3. Настройте Nginx

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Бот не отвечает

1. Проверьте токен в `.env`
2. Убедитесь, что бот запущен: `python bot.py`
3. Проверьте логи

### API не работает

1. Проверьте, что сервер запущен: `python api.py`
2. Проверьте порт 3000: `netstat -tulpn | grep 3000`
3. Откройте http://localhost:3000/docs

### WebApp не открывается

1. Проверьте `WEB_APP_URL` в `.env`
2. Убедитесь, что Angular приложение запущено
3. Проверьте CORS настройки в `api.py`

## Полезные команды

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск API с автоперезагрузкой
uvicorn api:app --reload

# Запуск бота
python bot.py

# Проверка здоровья API
curl http://localhost:3000/health

# Просмотр логов
tail -f bot.log
```

## TODO

- [ ] Интеграция с официальным Brawl Stars API
- [ ] База данных для хранения истории
- [ ] Кэширование данных
- [ ] Уведомления о новых матчах
- [ ] Статистика по времени суток
- [ ] Сравнение с друзьями
- [ ] Достижения и бейджи

## Лицензия

MIT

## Контакты

Для вопросов и предложений создайте issue в репозитории.
