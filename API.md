# API Documentation

## Base URL
```
http://91.229.11.191:8080
```

## Player ID
По умолчанию используется: **101**

## Swagger Documentation
Полная интерактивная документация API доступна по адресу:
```
http://91.229.11.191:8080/swagger/index.html
```

## Endpoints

### 1. Ручная синхронизация игрока
```
POST /admin/sync/{playerId}
```
Используется для принудительного обновления данных игрока.

**Path Parameters:**
- `playerId` (string) - ID игрока

**Response 200:**
```json
{
  "player_id": "string",
  "last_match_time": "string",
  "message": "string"
}
```

**Response 500:**
```json
{
  "code": 500,
  "error": "string",
  "message": "string"
}
```

---

### 2. Топ бойцов игрока
```
GET /analytics/{playerId}/brawlers
```
Используется для главного экрана аналитики и таблицы «кем чаще всего играет».

**Path Parameters:**
- `playerId` (string) - ID игрока

**Response 200:**
```json
{
  "player_id": "string",
  "count": 3,
  "brawlers": [
    {
      "brawler": "Shelly",
      "matches": 120,
      "wins": 70,
      "win_rate": 0.58
    }
  ]
}
```

**Response 404:**
```json
{
  "code": 404,
  "error": "Not Found",
  "message": "Player not found"
}
```

---

### 3. История винрейта бойца (график)
```
GET /analytics/{playerId}/brawlers/{brawler}/winrate-history
```
Используется для line chart аналитики прогресса.

**Path Parameters:**
- `playerId` (string) - ID игрока
- `brawler` (string) - Имя бойца

**Query Parameters:**
- `days` (number, optional) - Количество дней (1-365, default = 30)

**Response 200:**
```json
{
  "player_id": "string",
  "brawler": "Colt",
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

---

### 4. Лучшие бойцы на конкретной карте
```
GET /analytics/{playerId}/maps/{map}/brawlers
```
Используется для выбора бойца под карту и map-specific аналитики.

**Path Parameters:**
- `playerId` (string) - ID игрока
- `map` (string) - Название карты

**Response 200:**
```json
{
  "player_id": "string",
  "map": "Gem Grab - Hard Rock Mine",
  "count": 2,
  "brawlers": [
    {
      "brawler": "Poco",
      "map": "Hard Rock Mine",
      "matches": 20,
      "wins": 14,
      "win_rate": 0.7
    }
  ]
}
```

---

## Общий формат ошибки

```json
{
  "code": 400,
  "error": "Bad Request",
  "message": "Human readable message"
}
```

## Примеры использования

### JavaScript/TypeScript (Angular)
```typescript
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://91.229.11.191:8080';
const PLAYER_ID = '101';

// Получить топ бойцов
this.http.get(`${API_URL}/analytics/${PLAYER_ID}/brawlers`)
  .subscribe(data => console.log(data));
```

### Python (aiohttp)
```python
import aiohttp

async def sync_player(player_id: str):
    async with aiohttp.ClientSession() as session:
        url = f"http://91.229.11.191:8080/admin/sync/{player_id}"
        async with session.post(url) as response:
            return await response.json()
```

### cURL
```bash
# Синхронизация игрока
curl -X POST "http://91.229.11.191:8080/admin/sync/101"

# Получить топ бойцов
curl "http://91.229.11.191:8080/analytics/101/brawlers"

# История винрейта
curl "http://91.229.11.191:8080/analytics/101/brawlers/Shelly/winrate-history?days=30"
```

## CORS
API поддерживает CORS запросы для работы с веб-приложениями.

## Rate Limiting
Информация о лимитах запросов уточняйте в Swagger документации.
