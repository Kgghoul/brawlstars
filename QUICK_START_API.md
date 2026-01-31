# Быстрый старт API интеграции

## Шаг 1: Настройка URL бэкенда

Откройте `src/environments/environment.ts` и измените `apiUrl`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // Ваш URL бэкенда
};
```

## Шаг 2: Установка ID игрока

Есть несколько способов установить ID игрока:

### Вариант 1: Через localStorage (рекомендуется)

```typescript
// В любом месте приложения или в console
localStorage.setItem('playerId', '#ABC123');
```

### Вариант 2: Через сервис

```typescript
import { AnalyticsService } from './services/analytics.service';

constructor(private analyticsService: AnalyticsService) {
  this.analyticsService.setPlayerId('#ABC123');
}
```

### Вариант 3: Из URL параметров

В `analytics.component.ts`:

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(
  private route: ActivatedRoute,
  private analyticsService: AnalyticsService
) {}

ngOnInit(): void {
  // Получаем playerId из URL: /analytics?playerId=ABC123
  this.route.queryParams.subscribe(params => {
    const playerId = params['playerId'];
    if (playerId) {
      this.analyticsService.setPlayerId(playerId);
      this.loadAnalyticsData();
    }
  });
}
```

## Шаг 3: Использование в компонентах

### Получить топ бойцов

```typescript
this.analyticsService.getTopBrawlers(3).subscribe({
  next: (brawlers) => {
    this.bestBrawlers = brawlers;
  }
});
```

### Синхронизация данных

```typescript
syncPlayer(): void {
  this.analyticsService.syncPlayer().subscribe({
    next: (response) => {
      console.log('Синхронизация завершена');
      this.loadAnalyticsData(); // Перезагрузить данные
    }
  });
}
```

### История винрейта для графика

```typescript
this.analyticsService.getBrawlerWinrateHistory('Shelly', 30).subscribe({
  next: (data) => {
    this.chartData = data.history;
  }
});
```

## Шаг 4: Использование компонента графика

В вашем HTML:

```html
<app-winrate-chart
  [data]="chartData"
  [width]="272"
  [height]="180"
  [lineColor]="'#EF7527'"
  [showGrid]="true"
  [showPoints]="false"
  [title]="'История винрейта'">
</app-winrate-chart>
```

В вашем TypeScript:

```typescript
import { WinrateChartComponent } from '../components/winrate-chart.component';
import { WinrateHistoryPoint } from '../models/api.models';

@Component({
  imports: [WinrateChartComponent],
  // ...
})
export class YourComponent {
  chartData: WinrateHistoryPoint[] = [];
  
  loadChart(): void {
    this.analyticsService.getBrawlerWinrateHistory('Shelly', 30).subscribe({
      next: (response) => {
        this.chartData = response.history;
      }
    });
  }
}
```

## Шаг 5: Обработка ошибок

Все ошибки автоматически обрабатываются, но вы можете добавить свою логику:

```typescript
this.analyticsService.getTopBrawlers(3).subscribe({
  next: (brawlers) => {
    this.bestBrawlers = brawlers;
    this.error = null;
  },
  error: (err) => {
    console.error('Ошибка:', err);
    this.error = 'Не удалось загрузить данные';
    // Показать демо-данные
    this.loadDemoData();
  }
});
```

## Шаг 6: Добавить кнопку синхронизации в UI

В `analytics.html`:

```html
<button class="sync-button" (click)="syncPlayerData()" [disabled]="isLoading">
  {{ isLoading ? 'Загрузка...' : 'Обновить данные' }}
</button>

@if (error) {
  <div class="error-message">{{ error }}</div>
}
```

## Тестирование без бэкенда

Если бэкенд еще не готов:

1. Не устанавливайте `playerId`
2. Компонент автоматически использует демо-данные
3. Или используйте JSON Server для мока API

### Установка JSON Server (опционально)

```bash
npm install -g json-server

# Создайте db.json с моковыми данными
json-server --watch db.json --port 3000
```

Пример `db.json`:

```json
{
  "analytics": {
    "player_id": "ABC123",
    "count": 3,
    "brawlers": [
      {
        "brawler": "Shelly",
        "matches": 120,
        "wins": 70,
        "win_rate": 0.58
      },
      {
        "brawler": "Colt",
        "matches": 100,
        "wins": 80,
        "win_rate": 0.80
      },
      {
        "brawler": "Poco",
        "matches": 90,
        "wins": 20,
        "win_rate": 0.22
      }
    ]
  }
}
```

## Полезные команды

```bash
# Запуск dev сервера
ng serve

# Сборка для production
ng build --configuration production

# Проверка типов
ng build --watch

# Запуск тестов
ng test
```

## Структура файлов

```
src/app/
├── services/
│   ├── api.service.ts           # HTTP запросы
│   ├── analytics.service.ts     # Бизнес-логика
│   └── chart-data.service.ts    # Работа с графиками
├── models/
│   └── api.models.ts            # Типы данных
├── interceptors/
│   └── http-error.interceptor.ts # Обработка ошибок
├── components/
│   └── winrate-chart.component.ts # Компонент графика
└── analytics/
    ├── analytics.ts             # Главный компонент аналитики
    └── analytics.html
```

## Дополнительная информация

Смотрите полную документацию в `API_INTEGRATION.md`
