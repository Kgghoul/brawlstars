# 🔒 Проблема HTTPS для GitHub Pages

## Текущая ситуация

✅ **Приложение работает локально** (`http://localhost:4200`)  
❌ **НЕ работает на GitHub Pages** (`https://kgghoul.github.io/brawlstars/`)

## Причина

GitHub Pages использует **HTTPS**, а ваш API работает по **HTTP**. Браузеры блокируют такие запросы (Mixed Content).

```
Mixed Content: The page at 'https://kgghoul.github.io/...' 
was loaded over HTTPS, but requested an insecure endpoint 
'http://91.229.11.191:8080/...'
```

---

## Решения

### ✅ Решение 1: Настроить HTTPS на API сервере (Рекомендуется)

**Что нужно сделать:**
1. Получить SSL сертификат (бесплатно через Let's Encrypt)
2. Настроить веб-сервер (Nginx/Apache) на использование HTTPS
3. Изменить `environment.prod.ts` на `https://91.229.11.191:8080/api/v1`

**Пример для Nginx:**
```nginx
server {
    listen 443 ssl;
    server_name 91.229.11.191;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api/ {
        proxy_pass http://localhost:8080;
    }
}
```

**Команды для Let's Encrypt (на сервере):**
```bash
sudo apt update
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

---

### ✅ Решение 2: Использовать CORS Proxy

**Бесплатные прокси (для теста):**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://cors-anywhere.herokuapp.com/http://91.229.11.191:8080/api/v1',
  playerId: '101'
};
```

**Или создать свой прокси (Node.js):**
```javascript
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'http://91.229.11.191:8080',
  changeOrigin: true
}));

app.listen(443); // Нужен SSL сертификат
```

---

### ✅ Решение 3: Развернуть API на платформе с автоматическим HTTPS

**Платформы с бесплатным HTTPS:**
- **Railway** - https://railway.app
- **Render** - https://render.com
- **Vercel** - https://vercel.com (для serverless)
- **Heroku** - https://heroku.com
- **Fly.io** - https://fly.io

**После развертывания:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-app.railway.app/api/v1', // HTTPS!
  playerId: '101'
};
```

---

### ✅ Решение 4: Использовать Cloudflare (Проще всего)

1. Зарегистрируйтесь на https://cloudflare.com
2. Добавьте ваш домен (или получите бесплатный)
3. Настройте Page Rule для проксирования API
4. Cloudflare автоматически добавит HTTPS

---

## Временное решение для разработки

Отключить проверку Mixed Content в браузере (только для разработки!):

**Chrome:**
```bash
chrome.exe --disable-web-security --user-data-dir="C:/temp"
```

**Или использовать расширение:** 
- Allow CORS: Access-Control-Allow-Origin

---

## Проверка HTTPS на сервере

Проверьте, доступен ли ваш API по HTTPS:

```bash
curl https://91.229.11.191:8080/api/v1/analytics/101/brawlers
```

Если возвращается ошибка SSL - нужно настроить сертификат.

---

## Текущая конфигурация

**Локально (работает):**
```
http://localhost:4200 → http://91.229.11.191:8080/api/v1
```

**GitHub Pages (НЕ работает):**
```
https://kgghoul.github.io/brawlstars/ → http://91.229.11.191:8080/api/v1
                                        ↑ HTTP блокируется!
```

**Нужно:**
```
https://kgghoul.github.io/brawlstars/ → https://91.229.11.191:8080/api/v1
                                        ↑ HTTPS работает!
```

---

## Статус

- ✅ API работает по HTTP
- ✅ Приложение работает локально
- ✅ Данные загружаются и отображаются
- ❌ GitHub Pages блокирует HTTP запросы
- ⚠️ **Нужно настроить HTTPS на API сервере**

---

## Что делать сейчас

1. **Если у вас есть доступ к серверу API** → настройте HTTPS (Решение 1)
2. **Если нет доступа** → используйте CORS proxy (Решение 2)
3. **Для production** → разверните API на платформе с HTTPS (Решение 3)
4. **Самое быстрое** → используйте Cloudflare (Решение 4)

После настройки HTTPS измените `src/environments/environment.prod.ts` на HTTPS URL и задеплойте:

```bash
ng build --base-href=/brawlstars/ --configuration=production
npx angular-cli-ghpages --dir=dist/brawlstars-app/browser
```

🔐 **Без HTTPS приложение будет работать только локально!**
