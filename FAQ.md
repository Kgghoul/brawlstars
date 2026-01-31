# FAQ - Часто задаваемые вопросы

## Установка и настройка

### Q: Как установить проект?

```bash
npm install
```

### Q: Как запустить приложение?

**С Mock API (для разработки):**
```bash
# Терминал 1
npm run mock-api

# Терминал 2
npm start
```

**С реальным API:**
```bash
# Настройте apiUrl в src/environments/environment.ts
npm start
```

### Q: Где изменить URL бэкенда?

В файлах `src/environments/`:
- `environment.ts` - для development
- `environment.prod.ts` - для production

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-backend-url' // Измените здесь
};
```

---

## Работа с данными

### Q: Как установить ID игрока?

**Вариант 1 (рекомендуется):**
```javascript
localStorage.setItem('playerId', 'ABC123');
```

**Вариант 2:**
```typescript
constructor(private analyticsService: AnalyticsService) {
  this.analyticsService.setPlayerId('ABC123');
}
```

### Q: Почему не загружаются данные?

Проверьте:
1. Mock API сервер запущен (`npm run mock-api`)
2. playerId установлен в localStorage
3. URL в environment.ts правильный
4. Нет CORS ошибок в консоли браузера
5. Backend API доступен

### Q: Как работает fallback на demo данные?

Если API недоступен или playerId не установлен, компонент автоматически использует демо-данные из метода `loadDemoData()`.

### Q: Можно ли использовать приложение без бэкенда?

Да! Есть 2 варианта:
1. Использовать Mock API (`npm run mock-api`)
2. Не устанавливать playerId - будут показаны demo данные

---

## API и Endpoints

### Q: Какие endpoints доступны?

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/analytics/{playerId}/brawlers` | GET | Топ бойцов |
| `/analytics/{playerId}/brawlers/{brawler}/winrate-history` | GET | История винрейта |
| `/analytics/{playerId}/maps/{map}/brawlers` | GET | Бойцы на карте |
| `/admin/sync/{playerId}` | POST | Синхронизация |

### Q: Как тестировать API?

**cURL:**
```bash
curl http://localhost:3000/analytics/ABC123/brawlers
```

**REST Client (VS Code):**
Откройте файл `api-tests.http` и используйте расширение "REST Client"

**Браузер:**
Откройте `http://localhost:3000/analytics/ABC123/brawlers`

### Q: Что такое Mock API?

Mock API - это тестовый сервер на базе json-server, который имитирует реальный бэкенд. Используется для разработки frontend без готового backend.

### Q: Как добавить свои тестовые данные в Mock API?

Отредактируйте `mock-api/db.json`:

```json
{
  "analytics": {
    "YOUR_ID": {
      "brawlers": {
        "player_id": "YOUR_ID",
        "brawlers": [
          // ваши данные
        ]
      }
    }
  }
}
```

---

## Ошибки и проблемы

### Q: Ошибка "Port 3000 already in use"

**Решение:** Измените порт в `mock-api/server.js`:

```javascript
const PORT = 3001; // Измените на свободный порт
```

И в `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3001'
```

### Q: CORS ошибки

Mock API уже настроен для разрешения CORS.

Для реального бэкенда, добавьте заголовки:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Q: Данные не обновляются после синхронизации

Убедитесь, что после вызова `syncPlayer()` вы вызываете `loadAnalyticsData()`:

```typescript
syncPlayerData(): void {
  this.analyticsService.syncPlayer().subscribe({
    next: (response) => {
      this.loadAnalyticsData(); // Важно!
    }
  });
}
```

### Q: TypeError: Cannot read property 'brawlers' of undefined

Проверьте:
1. playerId существует в Mock API (db.json)
2. Формат данных соответствует типам в `api.models.ts`
3. API возвращает правильную структуру

---

## Разработка

### Q: Как добавить новый endpoint?

1. Добавьте метод в `ApiService`:
```typescript
getNewData(playerId: string): Observable<NewDataResponse> {
  return this.http.get<NewDataResponse>(`${this.baseUrl}/new-endpoint/${playerId}`);
}
```

2. Добавьте типы в `api.models.ts`:
```typescript
export interface NewDataResponse {
  // поля
}
```

3. Используйте в компоненте через `AnalyticsService`

### Q: Как добавить loading индикатор?

В компоненте:
```typescript
isLoading = false;

loadData(): void {
  this.isLoading = true;
  this.service.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}
```

В HTML:
```html
@if (isLoading) {
  <div class="spinner">Загрузка...</div>
}
```

### Q: Как добавить кэширование?

В `AnalyticsService`:
```typescript
private cache = new Map<string, any>();

getData(): Observable<Data> {
  const key = 'data-key';
  
  if (this.cache.has(key)) {
    return of(this.cache.get(key));
  }
  
  return this.apiService.getData().pipe(
    tap(data => this.cache.set(key, data))
  );
}
```

---

## Компоненты

### Q: Как использовать WinrateChartComponent?

```html
<app-winrate-chart
  [data]="chartData"
  [width]="272"
  [height]="180"
  [lineColor]="'#EF7527'"
  [showGrid]="true"
  [showPoints]="false"
  [title]="'График винрейта'">
</app-winrate-chart>
```

```typescript
import { WinrateChartComponent } from '../components/winrate-chart.component';

@Component({
  imports: [WinrateChartComponent],
  // ...
})
export class YourComponent {
  chartData: WinrateHistoryPoint[] = [];
  
  loadChart() {
    this.analyticsService.getBrawlerWinrateHistory('Shelly', 30)
      .subscribe(response => {
        this.chartData = response.history;
      });
  }
}
```

### Q: Можно ли кастомизировать график?

Да! Доступные параметры:
- `[data]` - данные истории
- `[width]` - ширина в px
- `[height]` - высота в px
- `[lineColor]` - цвет линии (hex)
- `[showGrid]` - показать сетку (boolean)
- `[showPoints]` - показать точки (boolean)
- `[title]` - заголовок графика

---

## Производство (Production)

### Q: Как собрать для production?

```bash
npm run build
```

Результат в папке `dist/`

### Q: Где настроить production URL?

В `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

### Q: Нужно ли изменять код для production?

Нет! Angular автоматически использует правильный environment файл при сборке:

```bash
ng build --configuration production
```

---

## Безопасность

### Q: Как добавить аутентификацию?

Создайте interceptor:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    
    return next.handle(req);
  }
}
```

Добавьте в `app.config.ts`:
```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
```

### Q: Безопасно ли хранить playerId в localStorage?

Для публичных данных - да.  
Для приватных данных используйте:
- Session Storage (для текущей сессии)
- HTTP-only cookies (для чувствительных данных)
- Authentication tokens

---

## Производительность

### Q: Как уменьшить количество API запросов?

1. **Кэширование** (см. выше)
2. **Debounce** для поиска:
```typescript
import { debounceTime } from 'rxjs/operators';

searchControl.valueChanges.pipe(
  debounceTime(300)
).subscribe(value => {
  this.search(value);
});
```

3. **Pagination** для больших списков

### Q: Как отменить предыдущий запрос?

```typescript
private subscription?: Subscription;

loadData() {
  this.subscription?.unsubscribe();
  
  this.subscription = this.service.getData().subscribe({
    next: (data) => {
      // обработка
    }
  });
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
```

---

## Дополнительно

### Q: Где найти полную документацию?

- `API_INTEGRATION.md` - полная документация API
- `QUICK_START_API.md` - быстрый старт
- `MOCK_API_SETUP.md` - настройка mock сервера
- `ARCHITECTURE.md` - архитектура проекта
- `INTEGRATION_SUMMARY.md` - сводка интеграции

### Q: Как внести вклад в проект?

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

### Q: Есть ли примеры использования?

Да! Смотрите:
- `src/app/analytics/analytics.ts` - пример компонента
- `api-tests.http` - примеры HTTP запросов
- `mock-api/db.json` - примеры данных

---

## Помощь

### Q: Где получить помощь?

1. Проверьте документацию в корне проекта
2. Откройте DevTools → Console для ошибок
3. Проверьте DevTools → Network для HTTP запросов
4. Используйте `console.log()` для отладки

### Q: Как сообщить о баге?

Создайте issue с:
- Описанием проблемы
- Шагами для воспроизведения
- Скриншотом/логами ошибок
- Версией Angular и браузера
