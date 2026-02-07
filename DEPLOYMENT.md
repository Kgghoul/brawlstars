# Deployment Guide

## GitHub Pages (Angular App)

Приложение автоматически развернуто на GitHub Pages:
- **URL**: https://kgghoul.github.io/brawlstars/
- **Branch**: `gh-pages`

### Обновление на GitHub Pages

```bash
# Сборка production версии
ng build --base-href=/brawlstars/ --configuration=production

# Деплой на GitHub Pages
npx angular-cli-ghpages --dir=dist/brawlstars-app/browser
```

### Автоматический деплой

При каждом пуше в `main` можно настроить GitHub Actions для автоматического деплоя.

---

## Docker Deployment

### Angular App

```bash
# Сборка образа
docker build -t brawlstars-app .

# Запуск контейнера
docker run -d -p 80:80 brawlstars-app
```

### Telegram Bot

```bash
cd telegram-bot

# Создайте .env файл
cp env.example .env
# Отредактируйте .env

# Сборка образа
docker build -t brawlstars-bot .

# Запуск контейнера
docker run -d --env-file .env brawlstars-bot
```

### Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка
docker-compose down
```

---

## Cloud Platforms

### Railway

1. Подключите GitHub репозиторий
2. Railway автоматически обнаружит `Dockerfile`
3. Укажите переменные окружения в настройках
4. Деплой произойдет автоматически

### Render

1. Создайте новый Web Service
2. Подключите GitHub репозиторий
3. Выберите Docker как среду
4. Укажите переменные окружения
5. Deploy

### Vercel / Netlify (Angular App)

```bash
# Установка CLI
npm i -g vercel
# или
npm i -g netlify-cli

# Деплой
vercel
# или
netlify deploy --prod
```

---

## Environment Variables

### Angular App

Настройки в `src/environments/`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://91.229.11.191:8080',
  playerId: '101'
};
```

### Telegram Bot

Создайте `.env` файл:

```env
BOT_TOKEN=your_bot_token
API_BASE_URL=http://91.229.11.191:8080
WEB_APP_URL=https://kgghoul.github.io/brawlstars
DEFAULT_PLAYER_ID=101
```

---

## API Configuration

Убедитесь, что API доступен по адресу:
- **Development**: http://91.229.11.191:8080
- **Production**: http://91.229.11.191:8080
- **Swagger Docs**: http://91.229.11.191:8080/swagger/index.html

### CORS настройки

API должен разрешать запросы с:
- `https://kgghoul.github.io`
- `http://localhost:4200` (для разработки)
- Telegram WebView origins

---

## Troubleshooting

### Angular App не загружается на GitHub Pages

1. Проверьте `base-href` в команде сборки
2. Убедитесь, что пути к ресурсам относительные (`assets/...`, не `/assets/...`)
3. Проверьте `.nojekyll` файл в `gh-pages` ветке

### Telegram Bot не запускается

1. Проверьте правильность `BOT_TOKEN`
2. Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`
3. Проверьте доступность API: `curl http://91.229.11.191:8080/swagger/index.html`

### Docker образ не собирается

1. Проверьте наличие `Dockerfile`
2. Убедитесь, что `.dockerignore` настроен правильно
3. Проверьте логи сборки: `docker build -t app . --progress=plain`

### CORS ошибки

Если возникают CORS ошибки при обращении к API:
1. Проверьте, что API разрешает запросы с вашего домена
2. Используйте прокси в `angular.json` для разработки
3. Убедитесь, что заголовки CORS настроены на сервере

---

## Monitoring & Logs

### GitHub Pages

Проверьте статус деплоя:
- Settings → Pages → Build and deployment

### Docker

```bash
# Логи контейнера
docker logs <container_id>

# Мониторинг ресурсов
docker stats
```

### Railway / Render

Логи доступны в веб-интерфейсе платформы.
