# ВАЖНО: Создайте файл .env в папке telegram-bot/

Скопируйте содержимое ниже в новый файл `.env`:

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

## Создание файла .env

### Вариант 1: Через командную строку (Windows)

```powershell
cd telegram-bot
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

### Вариант 2: Вручную

1. Откройте VS Code или любой текстовый редактор
2. Создайте новый файл в папке `telegram-bot`
3. Назовите его `.env` (с точкой в начале)
4. Вставьте содержимое выше
5. Сохраните

### Вариант 3: Скопируйте из .env.example

```powershell
cd telegram-bot
copy .env.example .env
```

Затем отредактируйте `.env` если нужно.

## После создания .env

Запустите снова:

```powershell
cd telegram-bot
python run_all.py
```

Или запустите раздельно:

```powershell
# Терминал 1
python api.py

# Терминал 2
python bot.py
```
