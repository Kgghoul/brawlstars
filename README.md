# Brawl Stars Web - Angular приложение

Современный веб-сайт для игры Brawl Stars с интегрированной аналитикой игроков, созданный на Angular.

## Возможности

- Современный адаптивный дизайн
- Информация о бойцах (персонажах)
- Описание игровых режимов
- **Аналитика игрока с реальными данными**
- **Графики винрейта и статистика**
- **Топ/худшие бойцы и карты**
- Яркий игровой интерфейс с анимациями
- Поддержка русского языка

## Новое: API интеграция

Приложение теперь интегрировано с бэкенд API для получения реальной аналитики игроков:

- Топ бойцов игрока
- История винрейта
- Анализ карт
- Синхронизация данных
- Графики и визуализация

### Быстрый старт с API

```bash
# 1. Установить зависимости
npm install

# 2. Запустить Mock API (терминал 1)
npm run mock-api

# 3. Запустить приложение (терминал 2)
npm start

# 4. В консоли браузера установить ID игрока
localStorage.setItem('playerId', 'ABC123');
```

Подробнее: [QUICK_START_API.md](QUICK_START_API.md)

## Технологии

- Angular 21
- TypeScript 5.9
- RxJS 7.8
- SCSS
- Standalone Components
- HttpClient
- JSON Server (для разработки)

## Установка и запуск

### Предварительные требования

- Node.js (v22+)
- npm (v10+)
- Angular CLI

### Запуск проекта

#### Без API (только UI)

```bash
npm install
npm start
```

Откройте http://localhost:4200/

#### С Mock API (рекомендуется для разработки)

```bash
# Терминал 1: Mock API
npm run mock-api

# Терминал 2: Angular приложение
npm start
```

- Mock API: http://localhost:3000
- Приложение: http://localhost:4200

#### С реальным бэкендом

1. Настройте URL в `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-backend-url'
};
```

2. Запустите приложение:
```bash
npm start
```

## Структура проекта

```
src/
├── app/
│   ├── services/
│   │   ├── api.service.ts          # HTTP запросы к API
│   │   ├── analytics.service.ts    # Бизнес-логика аналитики
│   │   └── chart-data.service.ts   # Работа с графиками
│   ├── models/
│   │   └── api.models.ts           # Типы данных API
│   ├── interceptors/
│   │   └── http-error.interceptor.ts
│   ├── components/
│   │   └── winrate-chart.component.ts
│   ├── analytics/                   # Компоненты аналитики
│   ├── app.ts                       # Главный компонент
│   ├── app.config.ts                # Конфигурация приложения
│   └── app.routes.ts                # Маршруты
├── environments/
│   ├── environment.ts               # Dev конфигурация
│   └── environment.prod.ts          # Prod конфигурация
└── styles.scss

mock-api/
├── db.json                          # Тестовые данные
└── server.js                        # Mock сервер
```

## Разделы приложения

### Главная страница
- Приветственный баннер
- Кнопки действий
- Анимированный фон

### Аналитика (Новое!)
- **Общая аналитика**
  - Лучшие/худшие карты
  - Топ бойцов по винрейту
  - График последних матчей
  
- **Детальная аналитика**
  - Анализ по режимам игры
  - Анализ конкретных карт
  - Средний винрейт

### Бойцы
Карточки популярных бойцов с:
- Именем и иконкой
- Ролью (Боец, Снайпер, Танк)
- Редкостью

### Игровые режимы
- Захват кристаллов
- Ограбление
- Бои за награды
- Brawl Ball

## API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/analytics/{playerId}/brawlers` | Топ бойцов |
| GET | `/analytics/{playerId}/brawlers/{brawler}/winrate-history` | История винрейта |
| GET | `/analytics/{playerId}/maps/{map}/brawlers` | Бойцы на карте |
| POST | `/admin/sync/{playerId}` | Синхронизация |

Подробнее: [API_INTEGRATION.md](API_INTEGRATION.md)

## Документация

- [API_INTEGRATION.md](API_INTEGRATION.md) - Полная документация интеграции
- [QUICK_START_API.md](QUICK_START_API.md) - Быстрый старт с API
- [MOCK_API_SETUP.md](MOCK_API_SETUP.md) - Настройка Mock сервера
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура проекта
- [FAQ.md](FAQ.md) - Часто задаваемые вопросы
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Сводка интеграции

## Команды

```bash
# Разработка
npm start              # Запустить приложение
npm run mock-api       # Запустить Mock API
npm run dev            # Запустить оба одновременно (не работает на Windows)

# Сборка
npm run build          # Production сборка
npm run watch          # Сборка с отслеживанием изменений

# Тестирование
npm test               # Запустить тесты
```

## Тестирование API

### REST Client (VS Code)

Откройте `api-tests.http` и используйте расширение "REST Client"

### cURL

```bash
curl http://localhost:3000/analytics/ABC123/brawlers
```

### Postman/Thunder Client

Импортируйте endpoints из `api-tests.http`

## Примеры использования

### Получить аналитику игрока

```typescript
import { AnalyticsService } from './services/analytics.service';

constructor(private analyticsService: AnalyticsService) {
  this.analyticsService.setPlayerId('ABC123');
  
  this.analyticsService.getTopBrawlers(3).subscribe({
    next: (brawlers) => {
      console.log('Топ бойцы:', brawlers);
    }
  });
}
```

### Отобразить график винрейта

```html
<app-winrate-chart
  [data]="chartData"
  [width]="272"
  [height]="180"
  [lineColor]="'#EF7527'">
</app-winrate-chart>
```

## Дизайн

Дизайн выполнен в игровом стиле с:
- Темной цветовой схемой
- Яркими градиентами (золотой, оранжевый, красный)
- Плавными анимациями и переходами
- Эффектами свечения
- SVG графиками и визуализацией
- Адаптивной версткой для всех устройств

## Production сборка

```bash
npm run build
```

Результат в папке `dist/`

Для production настройте URL в `src/environments/environment.prod.ts`

## Troubleshooting

### Данные не загружаются?

1. Проверьте, что Mock API запущен (`npm run mock-api`)
2. Установите playerId: `localStorage.setItem('playerId', 'ABC123')`
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что порт 3000 свободен

### CORS ошибки?

Mock API уже настроен для CORS. Для реального бэкенда добавьте CORS заголовки.

### Порт занят?

Измените порт в `mock-api/server.js` и `src/environments/environment.ts`

Больше решений: [FAQ.md](FAQ.md)

## Лицензия

Этот проект создан в образовательных целях.

## Автор

Разработано с использованием Angular CLI и современных практик веб-разработки.
