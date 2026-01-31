# Визуальный гайд по использованию API

## 1. Запуск Mock API сервера

### Терминал 1: Mock API

```bash
C:\Users\ASUS\Documents\brawlstarsweb\brawlstars-app> npm run mock-api

> brawlstars-app@0.0.0 mock-api
> node mock-api/server.js

Mock API Server запущен на http://localhost:3000
Доступные эндпоинты:
  GET  /analytics/:playerId/brawlers
  GET  /analytics/:playerId/brawlers/:brawler/winrate-history?days=30
  GET  /analytics/:playerId/maps/:map/brawlers
  POST /admin/sync/:playerId
```

✅ **Успех!** Mock API запущен и готов к работе.

---

## 2. Запуск Angular приложения

### Терминал 2: Angular

```bash
C:\Users\ASUS\Documents\brawlstarsweb\brawlstars-app> npm start

> brawlstars-app@0.0.0 start
> ng serve

Initial chunk files | Names         |  Raw size
polyfills.js        | polyfills     |  83.60 kB
main.js             | main          | 123.45 kB
styles.css          | styles        |  45.23 kB

✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

✅ **Успех!** Приложение доступно на http://localhost:4200

---

## 3. Настройка ID игрока

### В браузере (Developer Tools Console)

**Chrome/Edge: F12 → Console**

```javascript
// Установить ID игрока
localStorage.setItem('playerId', 'ABC123');

// Проверить установку
console.log(localStorage.getItem('playerId'));
// Output: "ABC123"
```

✅ **ID установлен!** Теперь перезагрузите страницу.

---

## 4. Структура данных в Mock API

### Пример ответа: Топ бойцов

**URL:** http://localhost:3000/analytics/ABC123/brawlers

```json
{
  "player_id": "ABC123",
  "count": 10,
  "brawlers": [
    {
      "brawler": "Edgar",
      "matches": 200,
      "wins": 180,
      "win_rate": 0.90
    },
    {
      "brawler": "Amber",
      "matches": 102,
      "wins": 82,
      "win_rate": 0.804
    },
    {
      "brawler": "Colt",
      "matches": 150,
      "wins": 120,
      "win_rate": 0.80
    }
  ]
}
```

### Преобразование в UI

```typescript
// API Response (win_rate: 0.90)
{
  "brawler": "Edgar",
  "win_rate": 0.90
}

// ↓ Преобразование в AnalyticsService

// UI Display (winRate: 90)
{
  "name": "Edgar",
  "winRate": 90,
  "pickRate": 35,
  "avatar": "assets/brawlers/edgar.png"
}
```

---

## 5. Что вы увидите в приложении

### Страница аналитики (без API)

```
┌─────────────────────────────────────┐
│        АНАЛИТИКА                    │
├─────────────────────────────────────┤
│  [ОБЩАЯ] [ДЕТАЛЬНАЯ]                │
├─────────────────────────────────────┤
│                                     │
│  ЛУЧШИЕ КАРТЫ                       │
│  [Кремовый торт] 89%                │
│  [Взятие моста]  91%                │
│  [Роковая шахта] 87%                │
│                                     │
│  ЛУЧШИЕ БОЙЦЫ                       │
│  👤 Алли    WR: 99%  PICK: 20%      │
│  👤 Брок    WR: 87%  PICK: 15%      │
│  👤 Белль   WR: 79%  PICK: 7%       │
│                                     │
└─────────────────────────────────────┘
```

### После подключения API

```
┌─────────────────────────────────────┐
│        АНАЛИТИКА                    │
├─────────────────────────────────────┤
│  [ОБЩАЯ] [ДЕТАЛЬНАЯ]                │
├─────────────────────────────────────┤
│  [Загрузка...] ← isLoading = true   │
│                                     │
│  ↓ После загрузки                   │
│                                     │
│  ЛУЧШИЕ БОЙЦЫ (реальные данные)     │
│  👤 Edgar   WR: 90%  PICK: 35%      │
│  👤 Amber   WR: 80%  PICK: 18%      │
│  👤 Colt    WR: 80%  PICK: 26%      │
│                                     │
│  ХУДШИЕ БОЙЦЫ (реальные данные)     │
│  👤 Mortis  WR: 12%  PICK: 14%      │
│  👤 Poco    WR: 22%  PICK: 16%      │
│  👤 Crow    WR: 39%  PICK: 15%      │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Network запросы (DevTools)

### Chrome DevTools → Network вкладка

```
Name                                      Status  Type  Size    Time
────────────────────────────────────────────────────────────────────
analytics/ABC123/brawlers                   200   xhr   2.1 KB  45ms
  ↳ Request URL: http://localhost:3000/analytics/ABC123/brawlers
  ↳ Method: GET
  ↳ Status: 200 OK
  ↳ Response: {"player_id":"ABC123","count":10,"brawlers":[...]}

analytics/ABC123/brawlers/Shelly/...       200   xhr   1.5 KB  32ms
  ↳ Request URL: http://localhost:3000/analytics/.../winrate-history?days=30
  ↳ Method: GET
  ↳ Status: 200 OK
```

✅ **Запросы успешны!** Данные загружаются.

---

## 7. Обработка ошибок

### Сценарий 1: API недоступен

```
Console:
❌ HTTP Error: Failed to fetch
🔄 Retry attempt 1...
❌ Still failed
✅ Fallback to demo data
```

**Результат:** Пользователь видит demo данные вместо пустого экрана.

### Сценарий 2: Неверный playerId

```
Network:
GET /analytics/INVALID_ID/brawlers
Status: 404 Not Found

Response:
{
  "code": 404,
  "error": "Not Found",
  "message": "Player not found"
}

Console:
❌ Ошибка загрузки топ бойцов: Player not found
✅ Fallback to demo data
```

---

## 8. График винрейта

### Данные из API

```json
{
  "player_id": "ABC123",
  "brawler": "Shelly",
  "days": 15,
  "history": [
    {"date": "2025-01-01", "win_rate": 0.6},
    {"date": "2025-01-02", "win_rate": 0.625},
    {"date": "2025-01-03", "win_rate": 0.333},
    ...
  ]
}
```

### Визуализация

```
WinRate
  100%  ┤
   80%  ┤    ╱╲    ╱╲
   60%  ┤   ╱  ╲  ╱  ╲╱
   40%  ┤  ╱    ╲╱
   20%  ┤ ╱
    0%  ┼───────────────────
        01  03  05  07  09  Date
```

---

## 9. Тестирование с REST Client (VS Code)

### Файл: api-tests.http

```http
### 1. Получить топ бойцов игрока
GET http://localhost:3000/analytics/ABC123/brawlers
Content-Type: application/json

###
```

**Результат в VS Code:**

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "player_id": "ABC123",
  "count": 10,
  "brawlers": [...]
}

⏱ Time: 45ms
📦 Size: 2.1 KB
✅ Status: 200 OK
```

---

## 10. Синхронизация данных

### Кнопка в UI (будущее)

```typescript
// В компоненте
syncPlayerData(): void {
  this.isLoading = true;
  this.analyticsService.syncPlayer().subscribe({
    next: (response) => {
      console.log('✅ Синхронизация завершена:', response);
      this.loadAnalyticsData(); // Перезагрузить данные
    },
    error: (err) => {
      console.error('❌ Ошибка синхронизации:', err);
      this.isLoading = false;
    }
  });
}
```

**UI:**

```
┌──────────────────────────────────┐
│  [🔄 Обновить данные]            │
│       ↓ Click                    │
│  [⏳ Загрузка...]                │
│       ↓ Success                  │
│  ✅ Данные обновлены!            │
└──────────────────────────────────┘
```

---

## 11. Console логи (для отладки)

### Успешная загрузка

```javascript
// AnalyticsComponent
ngOnInit() called
Player ID from storage: ABC123
Loading analytics data...

// AnalyticsService
Getting top brawlers for ABC123

// ApiService
GET http://localhost:3000/analytics/ABC123/brawlers

✅ Top brawlers loaded: 10 brawlers
✅ Worst brawlers loaded: 10 brawlers
```

### Ошибка загрузки

```javascript
❌ HTTP Error: Connection refused
🔄 Retrying request...
❌ Retry failed
⚠️ Ошибка загрузки топ бойцов: Failed to fetch
✅ Loading demo data as fallback
```

---

## 12. LocalStorage проверка

### Application вкладка (DevTools)

```
Storage → Local Storage → http://localhost:4200

Key         Value
─────────────────────
playerId    "ABC123"
```

**Удалить:**
```javascript
localStorage.removeItem('playerId');
// Приложение переключится на demo данные
```

---

## 13. Поток данных (визуальный)

```
User Action
   ↓
[Открыть страницу аналитики]
   ↓
Component.ngOnInit()
   ↓
localStorage.getItem('playerId') → "ABC123"
   ↓
AnalyticsService.setPlayerId("ABC123")
   ↓
loadAnalyticsData()
   ↓
getTopBrawlers(3)
   ↓
ApiService.getTopBrawlers("ABC123")
   ↓
HTTP GET http://localhost:3000/analytics/ABC123/brawlers
   ↓
HttpErrorInterceptor (обработка)
   ↓
Response (200 OK)
   ↓
Transform data (win_rate: 0.9 → winRate: 90)
   ↓
Update component (bestBrawlers = [...])
   ↓
UI renders with real data
   ↓
✅ User sees analytics!
```

---

## 14. Сравнение Demo vs API данных

### Demo данные (жестко закодированы)

```typescript
bestBrawlers = [
  { name: 'Алли', winRate: 99, pickRate: 20 },
  { name: 'Брок', winRate: 87, pickRate: 15 },
  { name: 'Белль', winRate: 79, pickRate: 7 }
];
```

**Всегда одинаковые, не обновляются**

### API данные (динамические)

```typescript
// Загружаются из API
this.analyticsService.getTopBrawlers(3).subscribe({
  next: (brawlers) => {
    this.bestBrawlers = brawlers;
    // Данные реальные и актуальные!
  }
});
```

**Обновляются при каждой синхронизации**

---

## 15. Production vs Development

### Development (localhost)

```
environment.ts
├─ apiUrl: 'http://localhost:3000'
└─ production: false

Mock API запущен локально
Данные из db.json
```

### Production (реальный сервер)

```
environment.prod.ts
├─ apiUrl: 'https://api.brawlstars.example.com'
└─ production: true

Реальный бэкенд
Данные из базы данных
Аутентификация
Rate limiting
```

---

## Полезные ссылки

- Mock API: http://localhost:3000
- Приложение: http://localhost:4200
- Аналитика: http://localhost:4200/analytics
- Консоль: F12 → Console
- Network: F12 → Network
- Storage: F12 → Application → Local Storage

## Горячие клавиши

- `F12` - открыть DevTools
- `Ctrl+Shift+R` - жесткая перезагрузка
- `Ctrl+Shift+C` - инспектор элементов
- `Ctrl+Shift+J` - консоль (прямо)
