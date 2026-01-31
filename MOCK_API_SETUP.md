# Инструкция по установке и запуску Mock API

## Установка

Установите необходимые зависимости:

```bash
npm install
```

Это установит `json-server` и все другие зависимости.

## Запуск Mock API сервера

### Вариант 1: Только Mock API

```bash
npm run mock-api
```

Mock API сервер будет доступен на `http://localhost:3000`

### Вариант 2: Mock API + Angular приложение одновременно

```bash
npm run dev
```

Это запустит:
- Mock API на `http://localhost:3000`
- Angular приложение на `http://localhost:4200`

### Вариант 3: Раздельный запуск (рекомендуется для Windows)

**Терминал 1:**
```bash
npm run mock-api
```

**Терминал 2:**
```bash
npm start
```

## Тестирование API

### Используя curl

**Получить топ бойцов:**
```bash
curl http://localhost:3000/analytics/ABC123/brawlers
```

**Получить историю винрейта:**
```bash
curl "http://localhost:3000/analytics/ABC123/brawlers/Shelly/winrate-history?days=15"
```

**Получить бойцов для карты:**
```bash
curl "http://localhost:3000/analytics/ABC123/maps/Hard Rock Mine/brawlers"
```

**Синхронизация игрока:**
```bash
curl -X POST http://localhost:3000/admin/sync/ABC123
```

### Используя браузер

Откройте в браузере:
- http://localhost:3000/analytics/ABC123/brawlers
- http://localhost:3000/analytics/ABC123/brawlers/Shelly/winrate-history?days=15

### Используя Postman или Thunder Client

Импортируйте следующие endpoints:

1. **GET** `http://localhost:3000/analytics/ABC123/brawlers`
2. **GET** `http://localhost:3000/analytics/ABC123/brawlers/Shelly/winrate-history?days=30`
3. **GET** `http://localhost:3000/analytics/ABC123/maps/Hard Rock Mine/brawlers`
4. **POST** `http://localhost:3000/admin/sync/ABC123`

## Использование в приложении

1. Убедитесь, что Mock API сервер запущен (`npm run mock-api`)

2. В Angular приложении откройте консоль браузера и выполните:

```javascript
localStorage.setItem('playerId', 'ABC123');
```

3. Перезагрузите страницу аналитики

4. Приложение автоматически загрузит данные из Mock API

## Добавление своих данных

Отредактируйте файл `mock-api/db.json`:

```json
{
  "analytics": {
    "YOUR_PLAYER_ID": {
      "brawlers": {
        "player_id": "YOUR_PLAYER_ID",
        "count": 3,
        "brawlers": [
          {
            "brawler": "YourBrawler",
            "matches": 100,
            "wins": 75,
            "win_rate": 0.75
          }
        ]
      }
    }
  }
}
```

Затем используйте:
```javascript
localStorage.setItem('playerId', 'YOUR_PLAYER_ID');
```

## Доступные Mock данные

В `mock-api/db.json` есть данные для игрока `ABC123`:

- **10 бойцов** с различным винрейтом
- **История винрейта** для Shelly и Colt (15 дней)
- **Данные карты** для "Hard Rock Mine" (5 бойцов)
- **Синхронизация** для игрока ABC123

## Остановка сервера

Нажмите `Ctrl+C` в терминале где запущен сервер.

## Troubleshooting

### Порт 3000 уже занят

Измените порт в `mock-api/server.js`:

```javascript
const PORT = 3001; // Измените на свободный порт
```

И в `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001'
};
```

### CORS ошибки

Mock API сервер уже настроен для разрешения CORS запросов через `jsonServer.defaults()`.

### Данные не загружаются

1. Проверьте, что Mock API запущен (должно быть сообщение "Mock API Server запущен...")
2. Проверьте, что `playerId` установлен в localStorage
3. Откройте DevTools → Network и проверьте HTTP запросы
4. Убедитесь, что `apiUrl` в environment.ts указывает на `http://localhost:3000`

### Windows специфичные проблемы

Если команда `npm run dev` не работает (запускает только один процесс), используйте раздельный запуск в двух терминалах.

Или установите `concurrently`:

```bash
npm install --save-dev concurrently
```

И измените скрипт в package.json:

```json
"dev": "concurrently \"npm run mock-api\" \"npm start\""
```
