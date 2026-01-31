from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

from config import settings

app = FastAPI(
    title="Brawl Stars Analytics API",
    description="API для аналитики игроков Brawl Stars",
    version="1.0.0"
)

# CORS для Angular приложения
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В production укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= Models =============

class BrawlerStats(BaseModel):
    brawler: str
    matches: int
    wins: int
    win_rate: float


class TopBrawlersResponse(BaseModel):
    player_id: str
    count: int
    brawlers: List[BrawlerStats]


class WinrateHistoryPoint(BaseModel):
    date: str
    matches: int
    wins: int
    win_rate: float


class BrawlerWinrateHistoryResponse(BaseModel):
    player_id: str
    brawler: str
    days: int
    history: List[WinrateHistoryPoint]


class MapBrawlerStats(BaseModel):
    brawler: str
    map: str
    matches: int
    wins: int
    win_rate: float


class MapBrawlersResponse(BaseModel):
    player_id: str
    map: str
    count: int
    brawlers: List[MapBrawlerStats]


class SyncResponse(BaseModel):
    player_id: str
    last_match_time: str
    message: str


class ErrorResponse(BaseModel):
    code: int
    error: str
    message: str


# ============= Mock Data Generator =============

def generate_mock_brawlers(player_id: str) -> List[BrawlerStats]:
    """Генерирует моковые данные бойцов"""
    brawlers = [
        "Shelly", "Colt", "Bull", "Brock", "Rico", 
        "Spike", "Crow", "Leon", "Sandy", "Amber",
        "Edgar", "Mortis", "Poco", "Pam", "Frank"
    ]
    
    result = []
    for brawler in brawlers[:10]:
        matches = random.randint(50, 200)
        wins = random.randint(10, matches)
        result.append(BrawlerStats(
            brawler=brawler,
            matches=matches,
            wins=wins,
            win_rate=round(wins / matches, 3)
        ))
    
    # Сортируем по винрейту
    result.sort(key=lambda x: x.win_rate, reverse=True)
    return result


def generate_mock_history(player_id: str, brawler: str, days: int) -> List[WinrateHistoryPoint]:
    """Генерирует моковую историю винрейта"""
    history = []
    base_date = datetime.now()
    
    for i in range(days):
        date = base_date - timedelta(days=days - i - 1)
        matches = random.randint(3, 12)
        wins = random.randint(0, matches)
        
        history.append(WinrateHistoryPoint(
            date=date.strftime("%Y-%m-%d"),
            matches=matches,
            wins=wins,
            win_rate=round(wins / matches if matches > 0 else 0, 3)
        ))
    
    return history


def generate_mock_map_brawlers(player_id: str, map_name: str) -> List[MapBrawlerStats]:
    """Генерирует моковые данные бойцов для карты"""
    brawlers = ["Poco", "Pam", "Gene", "Tara", "Sandy"]
    
    result = []
    for brawler in brawlers:
        matches = random.randint(10, 30)
        wins = random.randint(5, matches)
        result.append(MapBrawlerStats(
            brawler=brawler,
            map=map_name,
            matches=matches,
            wins=wins,
            win_rate=round(wins / matches, 3)
        ))
    
    result.sort(key=lambda x: x.win_rate, reverse=True)
    return result


# ============= Endpoints =============

@app.get("/")
async def root():
    """Главная страница API"""
    return {
        "name": "Brawl Stars Analytics API",
        "version": "1.0.0",
        "endpoints": {
            "analytics": "/analytics/{player_id}/brawlers",
            "history": "/analytics/{player_id}/brawlers/{brawler}/winrate-history",
            "map": "/analytics/{player_id}/maps/{map}/brawlers",
            "sync": "/admin/sync/{player_id}"
        }
    }


@app.get("/analytics/{player_id}/brawlers", response_model=TopBrawlersResponse)
async def get_top_brawlers(player_id: str):
    """
    Получить топ бойцов игрока
    
    Используется для:
    - главного экрана аналитики
    - таблицы «кем чаще всего играет»
    """
    try:
        brawlers = generate_mock_brawlers(player_id)
        
        return TopBrawlersResponse(
            player_id=player_id,
            count=len(brawlers),
            brawlers=brawlers
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(
                code=404,
                error="Not Found",
                message=f"Player {player_id} not found"
            ).dict()
        )


@app.get(
    "/analytics/{player_id}/brawlers/{brawler}/winrate-history",
    response_model=BrawlerWinrateHistoryResponse
)
async def get_brawler_winrate_history(
    player_id: str,
    brawler: str,
    days: int = Query(default=30, ge=1, le=365)
):
    """
    Получить историю винрейта бойца
    
    Используется для:
    - line chart
    - аналитики прогресса
    """
    try:
        history = generate_mock_history(player_id, brawler, days)
        
        return BrawlerWinrateHistoryResponse(
            player_id=player_id,
            brawler=brawler,
            days=days,
            history=history
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(
                code=404,
                error="Not Found",
                message=f"History for {brawler} not found"
            ).dict()
        )


@app.get("/analytics/{player_id}/maps/{map_name}/brawlers", response_model=MapBrawlersResponse)
async def get_map_brawlers(player_id: str, map_name: str):
    """
    Получить лучших бойцов на конкретной карте
    
    Используется для:
    - выбора бойца под карту
    - map-specific аналитики
    """
    try:
        brawlers = generate_mock_map_brawlers(player_id, map_name)
        
        return MapBrawlersResponse(
            player_id=player_id,
            map=f"Gem Grab - {map_name}",
            count=len(brawlers),
            brawlers=brawlers
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(
                code=404,
                error="Not Found",
                message=f"Map data not found"
            ).dict()
        )


@app.post("/admin/sync/{player_id}", response_model=SyncResponse)
async def sync_player(player_id: str):
    """
    Ручная синхронизация игрока
    
    Используется для принудительного обновления данных игрока
    """
    try:
        # TODO: Реальная синхронизация с Brawl Stars API
        
        return SyncResponse(
            player_id=player_id,
            last_match_time=datetime.now().isoformat(),
            message=f"Данные игрока {player_id} успешно синхронизированы"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                code=500,
                error="Internal Server Error",
                message="Failed to sync player data"
            ).dict()
        )


@app.get("/health")
async def health_check():
    """Проверка здоровья API"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
