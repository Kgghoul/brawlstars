import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TopBrawlersResponse,
  BrawlerWinrateHistoryResponse,
  MapBrawlersResponse,
  TopMapsResponse,
  SyncResponse,
  ErrorResponse
} from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Ручная синхронизация игрока
   * POST /admin/sync/{playerId}
   */
  syncPlayer(playerId: string): Observable<SyncResponse> {
    return this.http.post<SyncResponse>(`${this.baseUrl}/admin/sync/${playerId}`, {});
  }

  /**
   * Топ бойцов игрока
   * GET /analytics/{playerId}/brawlers
   */
  getTopBrawlers(playerId: string): Observable<TopBrawlersResponse> {
    return this.http.get<TopBrawlersResponse>(`${this.baseUrl}/analytics/${playerId}/brawlers`);
  }

  /**
   * История винрейта игрока по дням (график)
   * GET /analytics/{playerId}/winrate-history?days=30
   */
  getPlayerWinrateHistory(playerId: string, days: number = 30): Observable<BrawlerWinrateHistoryResponse> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<BrawlerWinrateHistoryResponse>(
      `${this.baseUrl}/analytics/${playerId}/winrate-history`,
      { params }
    );
  }

  /** @deprecated использовать getPlayerWinrateHistory — бэкенд отдаёт общий винрейт по игроку */
  getBrawlerWinrateHistory(
    playerId: string,
    _brawler: string,
    days: number = 30
  ): Observable<BrawlerWinrateHistoryResponse> {
    return this.getPlayerWinrateHistory(playerId, days);
  }

  /**
   * Лучшие бойцы на конкретной карте
   * GET /analytics/{playerId}/maps/{map}/brawlers
   */
  getMapBrawlers(playerId: string, map: string): Observable<MapBrawlersResponse> {
    return this.http.get<MapBrawlersResponse>(`${this.baseUrl}/analytics/${playerId}/maps/${map}/brawlers`);
  }

  /**
   * Топ лучших карт по бойцу
   * GET /analytics/{playerId}/maps/best?limit=3
   */
  getBestMaps(playerId: string, limit: number = 3): Observable<TopMapsResponse> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopMapsResponse>(`${this.baseUrl}/analytics/${playerId}/maps/best`, { params });
  }

  /**
   * Топ худших карт по бойцу
   * GET /analytics/{playerId}/maps/worst?limit=3
   */
  getWorstMaps(playerId: string, limit: number = 3): Observable<TopMapsResponse> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopMapsResponse>(`${this.baseUrl}/analytics/${playerId}/maps/worst`, { params });
  }
}
