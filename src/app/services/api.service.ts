import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TopBrawlersResponse,
  BrawlerWinrateHistoryResponse,
  MapBrawlersResponse,
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
    const url = `${this.baseUrl}/analytics/${playerId}/brawlers`;
    console.log('🌐 API запрос:', url);
    return this.http.get<TopBrawlersResponse>(url);
  }

  /**
   * История винрейта бойца (график)
   * GET /analytics/{playerId}/brawlers/{brawler}/winrate-history
   */
  getBrawlerWinrateHistory(
    playerId: string,
    brawler: string,
    days: number = 30
  ): Observable<BrawlerWinrateHistoryResponse> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<BrawlerWinrateHistoryResponse>(
      `${this.baseUrl}/analytics/${playerId}/brawlers/${brawler}/winrate-history`,
      { params }
    );
  }

  /**
   * Лучшие бойцы на конкретной карте
   * GET /analytics/{playerId}/maps/{map}/brawlers
   */
  getMapBrawlers(playerId: string, map: string): Observable<MapBrawlersResponse> {
    return this.http.get<MapBrawlersResponse>(`${this.baseUrl}/analytics/${playerId}/maps/${map}/brawlers`);
  }
}
