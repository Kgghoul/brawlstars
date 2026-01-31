# ВАЖНО: Telegram бот готов, но нужно создать файл .env

## Проблема
Файл `.env` не может быть создан автоматически из-за настроек `.gitignore`.

## Решение (выберите один способ):

### Способ 1: Через PowerShell (САМЫЙ ПРОСТОЙ)

Откройте PowerShell в папке `telegram-bot` и выполните:

```powershell
@"
BOT_TOKEN=8553648447:AAF96eTpR9UqQatdkLO5PFRKfpsDR3J1Tl8
ADMIN_IDS=

API_HOST=0.0.0.0
API_PORT=3000
API_BASE_URL=http://localhost:3000

WEB_APP_URL=http://localhost:4200

DATABASE_URL=sqlite+aiosqlite:///./brawlstars.db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

BRAWL_STARS_API_KEY=
"@ | Out-File -FilePath .env -Encoding utf8
```

### Способ 2: Через Python скрипт

```powershell
cd telegram-bot
python setup_env.py
# Нажмите 'y' если файл уже существует
```

### Способ 3: Вручную

1. Откройте VS Code или Notepad
2. Создайте новый файл
3. Вставьте содержимое ниже
4. Сохраните как `.env` (с точкой!) в папке `telegram-bot`

```env
BOT_TOKEN=8553648447:AAF96eTpR9UqQatdkLO5PFRKfpsDR3J1Tl8
ADMIN_IDS=

API_HOST=0.0.0.0
API_PORT=3000
API_BASE_URL=http://localhost:3000

WEB_APP_URL=http://localhost:4200

DATABASE_URL=sqlite+aiosqlite:///./brawlstars.db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

BRAWL_STARS_API_KEY=
```

## После создания .env запустите бота:

### Вариант 1: Через .bat файлы (РЕКОМЕНДУЕТСЯ)

Дважды кликните на файлы в папке `telegram-bot`:
- `start_bot.bat` - запустить бота
- `start_api.bat` - запустить API

### Вариант 2: Через командную строку

```powershell
cd telegram-bot

# Запустить бота
python bot.py

# В другом терминале - запустить API
python api.py
```

### Вариант 3: Автоматический запуск (обоих)

```powershell
cd telegram-bot
python run_all.py
```

## Проверка работы

1. Бот должен написать в консоли: "Запуск бота..."
2. Найдите вашего бота в Telegram
3. Отправьте `/start`
4. Вы должны увидеть приветствие с кнопками

## Если не работает

### Проверьте что .env создан:

```powershell
cd telegram-bot
dir .env
# Должен показать файл .env
```

### Проверьте содержимое:

```powershell
type .env
# Должен показать содержимое с BOT_TOKEN
```

### Переустановите зависимости:

```powershell
cd telegram-bot
pip install -r requirements.txt
```

## API Документация

После запуска API откройте:
- http://localhost:3000 - главная страница
- http://localhost:3000/docs - Swagger UI
- http://localhost:3000/health - проверка здоровья

## Готово!

После создания .env файла всё заработает!
