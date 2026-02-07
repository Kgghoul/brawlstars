from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Telegram Bot
    BOT_TOKEN: str
    ADMIN_IDS: str = ""
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 3000
    API_BASE_URL: str = "http://91.229.11.191:8080/api/v1"
    
    # Web App
    WEB_APP_URL: str = "https://kgghoul.github.io/brawlstars"
    
    # Player ID
    DEFAULT_PLAYER_ID: str = "101"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./brawlstars.db"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # Brawl Stars API
    BRAWL_STARS_API_KEY: str = ""
    
    @property
    def admin_ids_list(self) -> List[int]:
        if not self.ADMIN_IDS:
            return []
        return [int(id.strip()) for id in self.ADMIN_IDS.split(",") if id.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
