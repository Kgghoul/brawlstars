import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api.service';

export interface BrawlerDisplay {
  name: string;
  winRate: number;
  pickRate: number;
  avatar: string;
  matches: number;  // Добавили
  wins: number;     // Добавили
}

export interface MapDisplay {
  name: string;
  winRate: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private currentPlayerId: string = ''; // ID текущего игрока

  constructor(private apiService: ApiService) { }

  /**
   * Установить ID текущего игрока
   */
  setPlayerId(playerId: string): void {
    this.currentPlayerId = playerId;
  }

  /**
   * Получить ID текущего игрока
   */
  getPlayerId(): string {
    return this.currentPlayerId;
  }

  /**
   * Получить топ бойцов с преобразованием для UI
   */
  getTopBrawlers(limit: number = 3): Observable<BrawlerDisplay[]> {
    if (!this.currentPlayerId) {
      return of([]);
    }

    return this.apiService.getTopBrawlers(this.currentPlayerId).pipe(
      map(response => {
        // Сортируем по винрейту от ВЫСОКОГО к НИЗКОМУ (лучшие первые)
        const sorted = [...response.brawlers].sort((a, b) => b.win_rate - a.win_rate);
        return sorted.slice(0, limit).map(brawler => ({
          name: brawler.brawler,
          winRate: brawler.win_rate,
          pickRate: this.calculatePickRate(brawler.matches, response.brawlers),
          avatar: this.getBrawlerAvatar(brawler.brawler),
          matches: brawler.matches,
          wins: brawler.wins
        }));
      }),
      catchError(error => {
        console.error('Ошибка получения топ бойцов:', error);
        return of([]);
      })
    );
  }

  /**
   * Получить худших бойцов с преобразованием для UI
   */
  getWorstBrawlers(limit: number = 3): Observable<BrawlerDisplay[]> {
    if (!this.currentPlayerId) {
      return of([]);
    }

    return this.apiService.getTopBrawlers(this.currentPlayerId).pipe(
      map(response => {
        // Сортируем по винрейту от НИЗКОГО к ВЫСОКОМУ (худшие первые)
        const sorted = [...response.brawlers].sort((a, b) => a.win_rate - b.win_rate);
        return sorted.slice(0, limit).map(brawler => ({
          name: brawler.brawler,
          winRate: brawler.win_rate, // API уже возвращает проценты
          pickRate: this.calculatePickRate(brawler.matches, response.brawlers),
          avatar: this.getBrawlerAvatar(brawler.brawler),
          matches: brawler.matches,
          wins: brawler.wins
        }));
      }),
      catchError(error => {
        console.error('Ошибка получения худших бойцов:', error);
        return of([]);
      })
    );
  }

  /**
   * Получить историю винрейта бойца
   */
  getBrawlerWinrateHistory(brawler: string, days: number = 30): Observable<any> {
    if (!this.currentPlayerId) {
      return of(null);
    }

    return this.apiService.getBrawlerWinrateHistory(this.currentPlayerId, brawler, days).pipe(
      catchError(error => {
        console.error('Ошибка получения истории винрейта:', error);
        return of(null);
      })
    );
  }

  /**
   * Получить лучших бойцов для карты
   */
  getMapBrawlers(map: string): Observable<any> {
    if (!this.currentPlayerId) {
      return of(null);
    }

    return this.apiService.getMapBrawlers(this.currentPlayerId, map).pipe(
      catchError(error => {
        console.error('Ошибка получения бойцов для карты:', error);
        return of(null);
      })
    );
  }

  /**
   * Синхронизация данных игрока
   */
  syncPlayer(playerId?: string): Observable<any> {
    const id = playerId || this.currentPlayerId;
    if (!id) {
      return of(null);
    }

    return this.apiService.syncPlayer(id).pipe(
      catchError(error => {
        console.error('Ошибка синхронизации игрока:', error);
        return of(null);
      })
    );
  }

  /**
   * Вычислить процент пиков (pickRate) для бойца
   */
  private calculatePickRate(matches: number, allBrawlers: any[]): number {
    const totalMatches = allBrawlers.reduce((sum, b) => sum + b.matches, 0);
    return totalMatches > 0 ? Math.round((matches / totalMatches) * 100) : 0;
  }

  /**
   * Получить путь к аватару бойца
   */
  private getBrawlerAvatar(brawlerName: string): string {
    // Преобразуем имя бойца в формат имени файла
    // Пример: "Shelly" -> "assets/brawlers/Shelly.png"
    const fileName = brawlerName.toLowerCase().replace(/\s+/g, '');
    return `assets/brawlers/${fileName}.png`;
  }
}
