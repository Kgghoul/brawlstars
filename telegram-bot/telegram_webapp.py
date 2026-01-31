"""
Интеграция с Telegram WebApp
"""

from typing import Optional
import hashlib
import hmac
import json
from urllib.parse import parse_qsl


class TelegramWebApp:
    """Класс для работы с Telegram WebApp"""
    
    def __init__(self, bot_token: str):
        self.bot_token = bot_token
    
    def verify_init_data(self, init_data: str) -> bool:
        """
        Проверка подлинности данных из Telegram WebApp
        
        Args:
            init_data: Строка initData из Telegram.WebApp
            
        Returns:
            bool: True если данные подлинные
        """
        try:
            parsed_data = dict(parse_qsl(init_data))
            
            if 'hash' not in parsed_data:
                return False
            
            received_hash = parsed_data.pop('hash')
            
            # Создаем строку для проверки
            data_check_string = '\n'.join(
                f'{k}={v}' for k, v in sorted(parsed_data.items())
            )
            
            # Вычисляем hash
            secret_key = hmac.new(
                b'WebAppData',
                self.bot_token.encode(),
                hashlib.sha256
            ).digest()
            
            calculated_hash = hmac.new(
                secret_key,
                data_check_string.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return calculated_hash == received_hash
            
        except Exception as e:
            print(f"Error verifying init data: {e}")
            return False
    
    def extract_user_data(self, init_data: str) -> Optional[dict]:
        """
        Извлечь данные пользователя из initData
        
        Args:
            init_data: Строка initData
            
        Returns:
            dict: Данные пользователя или None
        """
        try:
            parsed_data = dict(parse_qsl(init_data))
            
            if 'user' in parsed_data:
                return json.loads(parsed_data['user'])
            
            return None
            
        except Exception as e:
            print(f"Error extracting user data: {e}")
            return None


# Пример использования в FastAPI

from fastapi import FastAPI, Header, HTTPException
from config import settings

app = FastAPI()
telegram_webapp = TelegramWebApp(settings.BOT_TOKEN)


@app.get("/api/user-data")
async def get_user_data(authorization: str = Header(None)):
    """
    Получить данные пользователя из Telegram WebApp
    
    Frontend должен отправить initData в заголовке Authorization
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    # Проверяем подлинность данных
    if not telegram_webapp.verify_init_data(authorization):
        raise HTTPException(status_code=403, detail="Invalid init data")
    
    # Извлекаем данные пользователя
    user_data = telegram_webapp.extract_user_data(authorization)
    
    if not user_data:
        raise HTTPException(status_code=400, detail="User data not found")
    
    return {
        "user_id": user_data.get("id"),
        "first_name": user_data.get("first_name"),
        "last_name": user_data.get("last_name"),
        "username": user_data.get("username")
    }
