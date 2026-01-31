# Быстрый старт Telegram бота

## 1. Установка

```bash
cd telegram-bot
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

## 2. Настройка

Создайте файл `.env` (скопируйте из .env.example):

```env
BOT_TOKEN=8553648447:AAF96eTpR9UqQatdkLO5PFRKfpsDR3J1Tl8
WEB_APP_URL=http://localhost:4200
API_BASE_URL=http://localhost:3000
```

## 3. Запуск

### Вариант 1: Автоматический запуск (рекомендуется)

```bash
python run_all.py
```

Это запустит:
- API сервер на http://localhost:3000
- Telegram бота

### Вариант 2: Раздельный запуск

**Терминал 1 (API):**
```bash
python api.py
# или
uvicorn api:app --host 0.0.0.0 --port 3000 --reload
```

**Терминал 2 (Бот):**
```bash
python bot.py
```

## 4. Использование

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Установите Player ID: `/player #ABC123`
4. Нажмите "📊 Открыть аналитику"

## 5. Интеграция с Angular приложением

В `brawlstars-app/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // URL Python API
};
```

Запустите Angular приложение:

```bash
cd ../brawlstars-app
npm start
```

Теперь у вас работает:
- ✅ Telegram бот
- ✅ Python API (FastAPI)
- ✅ Angular Web App

## API Документация

Откройте: http://localhost:3000/docs

## Команды бота

- `/start` - Начать работу
- `/analytics` - Открыть аналитику
- `/sync` - Синхронизировать данные
- `/player <ID>` - Установить Player ID
- `/help` - Помощь

## Troubleshooting

### Бот не отвечает

```bash
# Проверьте токен
cat .env | grep BOT_TOKEN

# Проверьте логи
python bot.py
```

### API не работает

```bash
# Проверьте порт
netstat -tulpn | grep 3000  # Linux
netstat -ano | findstr :3000  # Windows

# Откройте в браузере
http://localhost:3000/health
```

### WebApp не открывается

1. Убедитесь что Angular запущен: `http://localhost:4200`
2. Проверьте `WEB_APP_URL` в `.env`
3. Проверьте CORS в `api.py`
