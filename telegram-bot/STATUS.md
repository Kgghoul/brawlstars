# 🚀 Быстрый запуск всех сервисов

## Текущий статус:

✅ **Telegram Bot** - РАБОТАЕТ!  
✅ **FastAPI API** - РАБОТАЕТ!  
⏳ **Angular App** - запустите отдельно

## Что уже запущено:

### Терминал 1: Telegram Bot
```
Uvicorn running on http://0.0.0.0:3000
Application startup complete
```
**Бот:** @primerbaotbot

### Терминал 2: FastAPI API  
```
INFO: Waiting for application startup
INFO: Application startup complete
```
**API:** http://localhost:3000

## Как запустить Angular (если еще не запущен):

**Терминал 3:**
```bash
npm start
```

**URL:** http://localhost:4200

## Проверка работы:

### 1. API Документация
Откройте: http://localhost:3000/docs

### 2. Telegram Bot
1. Найдите: @primerbaotbot
2. Отправьте: `/start`
3. Нажмите: "📊 Открыть аналитику"

### 3. Тест API
```bash
curl http://localhost:3000/health
curl http://localhost:3000/analytics/ABC123/brawlers
```

## Если нужно перезапустить:

### Остановить всё:
1. Нажмите `Ctrl+C` в терминале с ботом
2. Нажмите `Ctrl+C` в терминале с API
3. Нажмите `Ctrl+C` в терминале с Angular

### Запустить снова:

**Вариант 1: Через .bat файлы (Windows)**
```bash
cd telegram-bot

# Двойной клик или:
start start_bot.bat
start start_api.bat
```

**Вариант 2: Вручную в разных терминалах**

Терминал 1:
```bash
cd telegram-bot
python bot.py
```

Терминал 2:
```bash
cd telegram-bot
python api.py
```

Терминал 3:
```bash
# В корне проекта
npm start
```

**Вариант 3: Автоматический скрипт**
```bash
cd telegram-bot
python run_all.py
```

## Полезные ссылки:

- **API:** http://localhost:3000
- **API Docs:** http://localhost:3000/docs
- **Angular:** http://localhost:4200
- **Telegram Bot:** @primerbaotbot

## Архитектура:

```
Telegram Bot (@primerbaotbot)
    ↓
FastAPI (http://localhost:3000)
    ↓
Mock Data (автоматическая генерация)
    ↑
Angular App (http://localhost:4200)
```

## Всё работает! 🎉

Не нужно ничего дополнительно настраивать - система полностью функциональна!
