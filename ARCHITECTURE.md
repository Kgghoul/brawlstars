# Архитектура API интеграции

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Analytics   │  │ Analytics1   │  │  WinrateChart       │   │
│  │  Component   │  │  Component   │  │  Component          │   │
│  └──────┬───────┘  └──────────────┘  └─────────┬───────────┘   │
│         │                                       │               │
└─────────┼───────────────────────────────────────┼───────────────┘
          │                                       │
          ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AnalyticsService                            │   │
│  │  • Бизнес-логика                                         │   │
│  │  • Управление playerId                                   │   │
│  │  • Преобразование данных для UI                          │   │
│  │  • Fallback на demo данные                               │   │
│  └─────────────────────┬────────────────────────────────────┘   │
│                        │                                         │
│  ┌────────────────────┴─────────────────┬───────────────────┐   │
│  │                                      │                   │   │
│  ▼                                      ▼                   ▼   │
│  ┌──────────────┐  ┌────────────────────────────┐  ┌──────────┐│
│  │  ApiService  │  │  ChartDataService          │  │  Models  ││
│  │              │  │  • SVG path generation     │  │          ││
│  │  • GET/POST  │  │  • Data transformation     │  │  Types   ││
│  │  • Endpoints │  │  • Chart utilities         │  │          ││
│  └──────┬───────┘  └────────────────────────────┘  └──────────┘│
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP Layer                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              HttpClient (Angular)                        │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────┐     │   │
│  │  │   HttpErrorInterceptor                         │     │   │
│  │  │   • Автоматический retry                       │     │   │
│  │  │   • Обработка ошибок                           │     │   │
│  │  │   • Логирование                                │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API                                  │
│                                                                  │
│  Production:                    Development:                     │
│  ┌─────────────────────┐       ┌──────────────────────┐        │
│  │  Real Backend API   │       │   Mock API Server     │        │
│  │                     │       │   (json-server)       │        │
│  │  • Node.js/Express  │       │                       │        │
│  │  • Database         │       │   • db.json           │        │
│  │  • Auth            │       │   • server.js         │        │
│  └─────────────────────┘       └──────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Поток данных

### 1. Инициализация

```
User → localStorage.setItem('playerId', 'ABC123')
     ↓
AnalyticsComponent.ngOnInit()
     ↓
AnalyticsService.setPlayerId('ABC123')
     ↓
loadAnalyticsData()
```

### 2. Запрос данных

```
Component → AnalyticsService.getTopBrawlers(3)
               ↓
          ApiService.getTopBrawlers('ABC123')
               ↓
          HttpClient.get('/analytics/ABC123/brawlers')
               ↓
          HttpErrorInterceptor (перехват)
               ↓
          Backend API
               ↓
          Response → Transform → Component
```

### 3. Обработка ошибок

```
Backend Error
    ↓
HttpErrorInterceptor
    ↓
Retry (1 раз)
    ↓
Still Error?
    ↓
AnalyticsService.catchError()
    ↓
Fallback to Demo Data
    ↓
Component отображает данные
```

## Endpoints и методы

```
┌───────────────────────────────────────────────────────────────┐
│ POST /admin/sync/{playerId}                                   │
│ ├─ ApiService.syncPlayer()                                    │
│ └─ AnalyticsService.syncPlayer()                              │
├───────────────────────────────────────────────────────────────┤
│ GET /analytics/{playerId}/brawlers                            │
│ ├─ ApiService.getTopBrawlers()                                │
│ ├─ AnalyticsService.getTopBrawlers()                          │
│ └─ AnalyticsService.getWorstBrawlers()                        │
├───────────────────────────────────────────────────────────────┤
│ GET /analytics/{playerId}/brawlers/{brawler}/winrate-history │
│ ├─ ApiService.getBrawlerWinrateHistory()                      │
│ └─ AnalyticsService.getBrawlerWinrateHistory()                │
├───────────────────────────────────────────────────────────────┤
│ GET /analytics/{playerId}/maps/{map}/brawlers                │
│ ├─ ApiService.getMapBrawlers()                                │
│ └─ AnalyticsService.getMapBrawlers()                          │
└───────────────────────────────────────────────────────────────┘
```

## Конфигурация окружения

```
┌──────────────────────────────────────────┐
│ environment.ts (Development)             │
│ ├─ apiUrl: 'http://localhost:3000'      │
│ └─ production: false                     │
├──────────────────────────────────────────┤
│ environment.prod.ts (Production)         │
│ ├─ apiUrl: 'https://api.example.com'    │
│ └─ production: true                      │
└──────────────────────────────────────────┘
         ↓
    ApiService
         ↓
    HTTP Requests
```

## Типы данных (Models)

```
┌─────────────────────────────────────────────────────┐
│ API Response                  UI Display            │
├─────────────────────────────────────────────────────┤
│ BrawlerStats                  BrawlerDisplay        │
│ ├─ brawler: string            ├─ name: string       │
│ ├─ matches: number            ├─ winRate: number    │
│ ├─ wins: number               ├─ pickRate: number   │
│ └─ win_rate: number (0-1)     └─ avatar: string     │
├─────────────────────────────────────────────────────┤
│ WinrateHistoryPoint           ChartPoint            │
│ ├─ date: string               ├─ x: number          │
│ ├─ matches: number            ├─ y: number          │
│ ├─ wins: number               ├─ date: string       │
│ └─ win_rate: number           └─ winRate: number    │
└─────────────────────────────────────────────────────┘
```

## Жизненный цикл компонента

```
AnalyticsComponent
    │
    ├─ ngOnInit()
    │   ├─ getPlayerIdFromStorage()
    │   └─ loadAnalyticsData()
    │       ├─ getTopBrawlers() → bestBrawlers
    │       └─ getWorstBrawlers() → worstBrawlers
    │
    ├─ syncPlayerData()
    │   └─ syncPlayer() → loadAnalyticsData()
    │
    └─ setTab()
        └─ router.navigate()
```

## Обработка состояний

```
Component State
    ↓
┌─────────────┐
│ isLoading   │ → Показать spinner
├─────────────┤
│ error       │ → Показать сообщение об ошибке
├─────────────┤
│ data loaded │ → Отобразить данные
├─────────────┤
│ no playerId │ → Показать demo данные
└─────────────┘
```

## Кэширование (будущее улучшение)

```
Request → Cache Check → Hit? → Return cached data
             │
             No
             ↓
        API Request → Cache Store → Return data
```

## Security & Best Practices

```
✓ Environment variables для URL
✓ TypeScript типизация
✓ HTTP Error Interceptor
✓ Retry механизм
✓ Fallback данные
✓ CORS настройки
✓ Error logging
✗ TODO: Authentication headers
✗ TODO: Rate limiting
✗ TODO: Request cancellation
```
