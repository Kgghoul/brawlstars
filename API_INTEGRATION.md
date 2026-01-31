# Интеграция API Brawl Stars

## Обзор

Этот проект интегрирован с бэкенд API для получения аналитики по игрокам Brawl Stars.

## Структура

```
src/
├── app/
│   ├── services/
│   │   ├── api.service.ts          # HTTP запросы к API
│   │   └── analytics.service.ts    # Бизнес-логика аналитики
│   ├── models/
│   │   └── api.models.ts           # Типы данных API
│   ├── interceptors/
│   │   └── http-error.interceptor.ts  # Обработка HTTP ошибок
│   └── ...
├── environments/
│   ├── environment.ts              # Dev конфигурация
│   └── environment.prod.ts         # Production конфигурация
```

## Настройка

### 1. Установка зависимостей

Убедитесь, что у вас установлен Angular HttpClient (уже настроен в `app.config.ts`).

### 2. Настройка URL API

Измените URL API в файлах environment:

**Development (`src/environments/environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

## Использование

### Установка ID игрока

Перед использованием аналитики, установите ID игрока:

```typescript
// В localStorage
localStorage.setItem('playerId', '#ABC123');

// Или через сервис
constructor(private analyticsService: AnalyticsService) {
  this.analyticsService.setPlayerId('#ABC123');
}
```

### Получение данных аналитики

#### Топ бойцов игрока

```typescript
this.analyticsService.getTopBrawlers(3).subscribe({
  next: (brawlers) => {
    console.log('Топ бойцы:', brawlers);
    // brawlers: BrawlerDisplay[]
  },
  error: (err) => {
    console.error('Ошибка:', err);
  }
});
```

#### Худшие бойцы игрока

```typescript
this.analyticsService.getWorstBrawlers(3).subscribe({
  next: (brawlers) => {
    console.log('Худшие бойцы:', brawlers);
  }
});
```

#### История винрейта бойца

```typescript
this.analyticsService.getBrawlerWinrateHistory('Shelly', 30).subscribe({
  next: (history) => {
    console.log('История винрейта:', history);
    // history.history: Array<{date, matches, wins, win_rate}>
  }
});
```

#### Лучшие бойцы на карте

```typescript
this.analyticsService.getMapBrawlers('Hard Rock Mine').subscribe({
  next: (data) => {
    console.log('Бойцы на карте:', data.brawlers);
  }
});
```

#### Синхронизация данных игрока

```typescript
this.analyticsService.syncPlayer().subscribe({
  next: (response) => {
    console.log('Синхронизация завершена:', response);
  }
});
```

## API Endpoints

### 🔄 Синхронизация игрока

**POST** `/admin/sync/{playerId}`

Принудительное обновление данных игрока.

**Response 200:**
```json
{
  "player_id": "string",
  "last_match_time": "string",
  "message": "string"
}
```

### 🥇 Топ бойцов игрока

**GET** `/analytics/{playerId}/brawlers`

Получение топа бойцов игрока.

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

### 📈 История винрейта бойца

**GET** `/analytics/{playerId}/brawlers/{brawler}/winrate-history`

**Query params:**
- `days?: number` (1-365, default = 30)

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

### 🗺 Лучшие бойцы на карте

**GET** `/analytics/{playerId}/maps/{map}/brawlers`

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

## Обработка ошибок

Все ошибки API обрабатываются автоматически через `HttpErrorInterceptor`. Формат ошибки:

```json
{
  "code": 400,
  "error": "Bad Request",
  "message": "Human readable message"
}
```

### Повторные попытки

HTTP interceptor автоматически повторяет неудачные запросы 1 раз.

## Модели данных

### BrawlerDisplay

```typescript
interface BrawlerDisplay {
  name: string;      // Имя бойца
  winRate: number;   // Винрейт в процентах (0-100)
  pickRate: number;  // Процент пиков (0-100)
  avatar: string;    // Путь к аватару
}
```

### MapDisplay

```typescript
interface MapDisplay {
  name: string;      // Название карты
  winRate: number;   // Винрейт в процентах (0-100)
  image: string;     // Путь к изображению
}
```

## Демо режим

Если ID игрока не установлен или API недоступен, компонент автоматически использует демо-данные:

```typescript
loadDemoData(): void {
  this.bestBrawlers = [
    { name: 'Алли', winRate: 99, pickRate: 20, avatar: 'assets/brawlers/Alli.png' },
    // ...
  ];
}
```

## Примеры использования в компонентах

### В analytics.component.ts

```typescript
export class AnalyticsComponent implements OnInit {
  bestBrawlers: BrawlerDisplay[] = [];
  isLoading = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Установить ID игрока
    const playerId = localStorage.getItem('playerId');
    if (playerId) {
      this.analyticsService.setPlayerId(playerId);
      this.loadAnalyticsData();
    }
  }

  loadAnalyticsData(): void {
    this.isLoading = true;
    
    this.analyticsService.getTopBrawlers(3).subscribe({
      next: (brawlers) => {
        this.bestBrawlers = brawlers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка:', err);
        this.isLoading = false;
      }
    });
  }
}
```

## CORS

Если вы получаете ошибки CORS, убедитесь, что ваш бэкенд настроен для разрешения запросов с вашего фронтенд домена.

## Тестирование

Для тестирования API без реального бэкенда:

1. Используйте JSON Server или Mockoon для создания мок API
2. Установите `apiUrl` в environment на ваш мок сервер
3. Или оставьте пустой `playerId` для использования демо-данных

## Дополнительные возможности

### Кэширование данных

Можно добавить кэширование в `AnalyticsService` для уменьшения количества запросов:

```typescript
private cache = new Map<string, any>();

getTopBrawlers(limit: number = 3): Observable<BrawlerDisplay[]> {
  const cacheKey = `top-brawlers-${this.currentPlayerId}-${limit}`;
  
  if (this.cache.has(cacheKey)) {
    return of(this.cache.get(cacheKey));
  }
  
  return this.apiService.getTopBrawlers(this.currentPlayerId).pipe(
    map(response => {
      const data = this.transformData(response);
      this.cache.set(cacheKey, data);
      return data;
    })
  );
}
```

### Loading индикаторы

В HTML шаблоне:

```html
@if (isLoading) {
  <div class="loading-spinner">Загрузка...</div>
}

@if (error) {
  <div class="error-message">{{ error }}</div>
}
```
