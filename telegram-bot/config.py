from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Telegram Bot
    BOT_TOKEN: str
    ADMIN_IDS: str = ""
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 3000
    API_BASE_URL: str = "http://localhost:3000"
    
    # Web App
    WEB_APP_URL: str = "http://localhost:4200"
    
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
