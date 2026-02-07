# API Mapping Documentation

## Текущая интеграция

### ✅ 1. GET `/api/v1/analytics/{playerId}/brawlers`

**API Response:**
```json
{
  "player_id": "101",
  "count": 2,
  "brawlers": [
    {
      "brawler": "Pam",
      "matches": 1,
      "wins": 0,
      "win_rate": 0
    }
  ]
}
```

**Наше преобразование:**
```typescript
{
  name: brawler.brawler,        // "Pam"
  winRate: brawler.win_rate,    // 0 (в процентах)
  pickRate: calculated,          // Расчет: (matches / totalMatches) * 100
  avatar: getBrawlerAvatar(),    // "assets/brawlers/pam.png"
  matches: brawler.matches,      // 1
  wins: brawler.wins            // 0
}
```

**Где используется:**
- `src/app/analytics/analytics.html` - Лучшие/Худшие бойцы
- Метод: `AnalyticsService.getTopBrawlers()` и `getWorstBrawlers()`

**Статус:** ✅ Полностью реализовано

---

### ⚠️ 2. GET `/api/v1/analytics/{playerId}/brawlers/{brawler}/winrate-history`

**API Response (по документации):**
```json
{
  "player_id": "101",
  "brawler": "Colt",
  "days": 30,
  "history": [
    {
      "date": "2025-01-01",
      "matches": 5,
      "wins": 3,
      "win_rate": 60
    }
  ]
}
```

**Наш интерфейс:**
```typescript
export interface WinrateHistoryPoint {
  date: string;
  matches: number;
  wins: number;
  win_rate: number;  // В процентах (60) или decimal (0.6)?
}
```

**Где используется:**
- `src/app/analytics/analytics.html` - График "Последние матчи" (пока статичный SVG)
- Метод: `AnalyticsService.getBrawlerWinrateHistory()`

**Статус:** ⚠️ Метод реализован, но не используется в UI
**TODO:** Подключить к графику вместо статичного SVG

---

### ⚠️ 3. GET `/api/v1/analytics/{playerId}/maps/{map}/brawlers`

**API Response (по документации):**
```json
{
  "player_id": "101",
  "map": "Gem Grab - Hard Rock Mine",
  "count": 2,
  "brawlers": [
    {
      "brawler": "Poco",
      "map": "Hard Rock Mine",
      "matches": 20,
      "wins": 14,
      "win_rate": 70
    }
  ]
}
```

**Наш интерфейс:**
```typescript
export interface MapBrawlerStats {
  brawler: string;
  map: string;
  matches: number;
  wins: number;
  win_rate: number;  // В процентах
}
```

**Где используется:**
- `src/app/analytics3/analytics3.ts` - Анализ по карте
- Метод: `AnalyticsService.getMapBrawlers()`

**Статус:** ⚠️ Метод реализован, но использует hardcoded данные
**TODO:** Заменить hardcoded данные на реальные из API

---

### ⚠️ 4. POST `/api/v1/admin/sync/{playerId}`

**API Response (по документации):**
```json
{
  "player_id": "101",
  "last_match_time": "2026-02-07T20:00:00Z",
  "message": "Player data synchronized"
}
```

**Наш интерфейс:**
```typescript
export interface SyncResponse {
  player_id: string;
  last_match_time: string;
  message: string;
}
```

**Где используется:**
- `src/app/analytics/analytics.ts` - Метод `syncPlayerData()`
- Telegram Bot - Команда `/sync`

**Статус:** ✅ Полностью реализовано, но не отображается в UI
**TODO:** Добавить кнопку синхронизации в UI

---

## Проверка соответствия

### ✅ Что работает правильно:

1. **Endpoints:**
   - ✅ `/api/v1/analytics/{playerId}/brawlers` - работает
   - ✅ Player ID = 101 используется везде

2. **Поля данных:**
   - ✅ `brawler` → `name`
   - ✅ `win_rate` - API возвращает проценты (0, 100), не decimal
   - ✅ `matches` - используется
   - ✅ `wins` - теперь передается

3. **Логика:**
   - ✅ Сортировка худших бойцов (по возрастанию win_rate)
   - ✅ Расчет pickRate из matches
   - ✅ Преобразование имени в путь к аватару

### ⚠️ Что нужно добавить/исправить:

1. **История винрейта (график):**
   - Метод есть, но не используется
   - График сейчас статичный SVG
   - TODO: Подключить реальные данные

2. **Анализ по картам:**
   - Метод есть, но используются hardcoded данные
   - TODO: Вызывать API при открытии Analytics3

3. **Синхронизация:**
   - API endpoint работает
   - TODO: Добавить кнопку "Синхронизировать" в UI

4. **Отображение matches/wins:**
   - Данные теперь есть в BrawlerDisplay
   - TODO: Можно добавить в UI если нужно

---

## Рекомендации

### Критично:
- ✅ API endpoint для топ бойцов работает корректно
- ✅ Данные соответствуют документации
- ✅ win_rate в процентах (0-100), не decimal (0-1)

### Можно улучшить:
1. Подключить реальные данные для графика winrate history
2. Подключить реальные данные для Analytics3 (анализ по картам)
3. Добавить кнопку синхронизации в UI
4. Обработать случай когда бойцов нет (count: 0)

---

## Проверка через Swagger

Для проверки откройте:
```
http://91.229.11.191:8080/swagger/index.html
```

Проверьте endpoints:
1. `GET /api/v1/analytics/101/brawlers` - должно вернуть список бойцов
2. `POST /api/v1/admin/sync/101` - синхронизация
3. `GET /api/v1/analytics/101/brawlers/Pam/winrate-history?days=30` - история
4. `GET /api/v1/analytics/101/maps/{mapName}/brawlers` - бойцы на карте

**Если какие-то endpoints возвращают другую структуру - нужно обновить интерфейсы!**
