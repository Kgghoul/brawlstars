# Интеграция Angular с Telegram WebApp

## 1. Добавить Telegram WebApp SDK

В `brawlstars-app/src/index.html`:

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Brawl Stars Analytics</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  
  <!-- Telegram WebApp SDK -->
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

## 2. Создать Telegram сервис

`brawlstars-app/src/app/services/telegram.service.ts`:

```typescript
import { Injectable } from '@angular/core';

declare const Telegram: any;

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private webApp: any;
  
  constructor() {
    if (typeof Telegram !== 'undefined') {
      this.webApp = Telegram.WebApp;
      this.webApp.ready();
      this.webApp.expand();
    }
  }
  
  /**
   * Проверить, запущено ли приложение в Telegram
   */
  isInTelegram(): boolean {
    return typeof Telegram !== 'undefined' && this.webApp;
  }
  
  /**
   * Получить данные пользователя
   */
  getUser(): TelegramUser | null {
    if (!this.isInTelegram()) {
      return null;
    }
    
    return this.webApp.initDataUnsafe?.user || null;
  }
  
  /**
   * Получить ID пользователя
   */
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.id.toString() : null;
  }
  
  /**
   * Получить initData для отправки на сервер
   */
  getInitData(): string {
    if (!this.isInTelegram()) {
      return '';
    }
    
    return this.webApp.initData;
  }
  
  /**
   * Показать главную кнопку
   */
  showMainButton(text: string, onClick: () => void) {
    if (!this.isInTelegram()) {
      return;
    }
    
    this.webApp.MainButton.text = text;
    this.webApp.MainButton.show();
    this.webApp.MainButton.onClick(onClick);
  }
  
  /**
   * Скрыть главную кнопку
   */
  hideMainButton() {
    if (!this.isInTelegram()) {
      return;
    }
    
    this.webApp.MainButton.hide();
  }
  
  /**
   * Показать всплывающее окно
   */
  showAlert(message: string) {
    if (!this.isInTelegram()) {
      alert(message);
      return;
    }
    
    this.webApp.showAlert(message);
  }
  
  /**
   * Показать подтверждение
   */
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isInTelegram()) {
        resolve(confirm(message));
        return;
      }
      
      this.webApp.showConfirm(message, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
  }
  
  /**
   * Закрыть WebApp
   */
  close() {
    if (!this.isInTelegram()) {
      return;
    }
    
    this.webApp.close();
  }
  
  /**
   * Установить цвет заголовка
   */
  setHeaderColor(color: string) {
    if (!this.isInTelegram()) {
      return;
    }
    
    this.webApp.setHeaderColor(color);
  }
  
  /**
   * Установить цвет фона
   */
  setBackgroundColor(color: string) {
    if (!this.isInTelegram()) {
      return;
    }
    
    this.webApp.setBackgroundColor(color);
  }
}
```

## 3. Обновить AnalyticsComponent

`brawlstars-app/src/app/analytics/analytics.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { TelegramService } from '../services/telegram.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit {
  // ... остальной код ...
  
  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private telegramService: TelegramService  // Добавили
  ) { }
  
  ngOnInit(): void {
    // Настройка Telegram WebApp
    if (this.telegramService.isInTelegram()) {
      // Установить темную тему
      this.telegramService.setHeaderColor('#1a1a2e');
      this.telegramService.setBackgroundColor('#1a1a2e');
      
      // Получить ID пользователя из Telegram
      const telegramUserId = this.telegramService.getUserId();
      
      if (telegramUserId) {
        // Использовать Telegram ID как player ID
        this.analyticsService.setPlayerId(telegramUserId);
        this.loadAnalyticsData();
      } else {
        // Попробовать загрузить из localStorage
        const storedId = this.getPlayerIdFromStorage();
        if (storedId) {
          this.analyticsService.setPlayerId(storedId);
          this.loadAnalyticsData();
        } else {
          this.loadDemoData();
        }
      }
    } else {
      // Обычный режим (не в Telegram)
      const playerId = this.getPlayerIdFromStorage();
      if (playerId) {
        this.analyticsService.setPlayerId(playerId);
        this.loadAnalyticsData();
      } else {
        this.loadDemoData();
      }
    }
  }
  
  syncPlayerData(): void {
    if (this.isLoading) return;
    
    // Показать уведомление в Telegram
    if (this.telegramService.isInTelegram()) {
      this.telegramService.showAlert('Начинаем синхронизацию...');
    }
    
    const playerId = this.analyticsService.getPlayerId();
    if (!playerId) {
      console.warn('ID игрока не установлен');
      return;
    }
    
    this.isLoading = true;
    this.analyticsService.syncPlayer().subscribe({
      next: (response) => {
        console.log('Данные синхронизированы:', response);
        this.loadAnalyticsData();
        
        // Показать успех в Telegram
        if (this.telegramService.isInTelegram()) {
          this.telegramService.showAlert('Данные обновлены!');
        }
      },
      error: (err) => {
        console.error('Ошибка синхронизации:', err);
        this.error = 'Не удалось синхронизировать данные';
        this.isLoading = false;
        
        // Показать ошибку в Telegram
        if (this.telegramService.isInTelegram()) {
          this.telegramService.showAlert('Ошибка синхронизации!');
        }
      }
    });
  }
}
```

## 4. Обновить API сервис для отправки Telegram данных

`brawlstars-app/src/app/services/api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TelegramService } from './telegram.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private telegramService: TelegramService  // Добавили
  ) { }
  
  /**
   * Получить заголовки с Telegram initData
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    // Добавить Telegram initData для авторизации
    if (this.telegramService.isInTelegram()) {
      const initData = this.telegramService.getInitData();
      if (initData) {
        headers = headers.set('Authorization', initData);
      }
    }
    
    return headers;
  }
  
  /**
   * Топ бойцов игрока
   */
  getTopBrawlers(playerId: string): Observable<TopBrawlersResponse> {
    return this.http.get<TopBrawlersResponse>(
      `${this.baseUrl}/analytics/${playerId}/brawlers`,
      { headers: this.getHeaders() }
    );
  }
  
  // ... остальные методы с добавлением headers ...
}
```

## 5. Тестирование

### Локальное тестирование

1. Запустите Python API:
```bash
cd telegram-bot
python api.py
```

2. Запустите Angular приложение:
```bash
cd brawlstars-app
npm start
```

3. Откройте бота в Telegram и нажмите кнопку WebApp

### Тестирование без Telegram

Приложение будет работать и в обычном браузере, используя localStorage для хранения playerId.

## 6. Deploy

### Хостинг Angular приложения

Можно использовать:
- Vercel (рекомендуется для Angular)
- Netlify
- GitHub Pages
- Firebase Hosting

```bash
ng build --configuration production
# Загрузите содержимое dist/ на хостинг
```

### Хостинг Python API

Можно использовать:
- Railway
- Render
- Heroku
- DigitalOcean

### Обновить .env

```env
WEB_APP_URL=https://your-angular-app.vercel.app
API_BASE_URL=https://your-api.railway.app
```

### Установить WebApp URL в BotFather

1. Откройте @BotFather
2. `/setmenubutton`
3. Выберите вашего бота
4. Отправьте URL: `https://your-angular-app.vercel.app`

## 7. Пример работы

1. Пользователь открывает бота
2. Бот показывает кнопку "📊 Открыть аналитику"
3. При нажатии открывается Angular приложение в WebApp
4. Angular получает Telegram user ID автоматически
5. Загружается аналитика пользователя
6. Пользователь видит свою статистику

## Troubleshooting

### WebApp не открывается

1. Проверьте URL в `.env`: `WEB_APP_URL`
2. Убедитесь что Angular приложение доступно по HTTPS (для production)
3. Проверьте консоль браузера в Telegram Desktop

### Данные пользователя не получаются

1. Убедитесь что SDK загружен: проверьте `index.html`
2. Проверьте в консоли: `console.log(Telegram.WebApp.initDataUnsafe)`
3. Убедитесь что `webApp.ready()` вызван

### CORS ошибки

Убедитесь что в `api.py` настроен CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-angular-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
