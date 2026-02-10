import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, forkJoin, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { WinrateHistoryPoint } from '../models/api.models';

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
          pickRate: brawler.pick_rate ?? this.calculatePickRate(brawler.matches, response.brawlers),
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
          winRate: brawler.win_rate,
          pickRate: brawler.pick_rate ?? this.calculatePickRate(brawler.matches, response.brawlers),
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
   * Агрегированная история за день по всем бойцам (общая сумма matches/wins за дату)
   */
  getAggregatedWinrateHistory(days: number = 30): Observable<WinrateHistoryPoint[]> {
    if (!this.currentPlayerId) {
      return of([]);
    }

    return this.apiService.getTopBrawlers(this.currentPlayerId).pipe(
      map(response => response.brawlers.map(b => b.brawler)),
      catchError(() => of([])),
      switchMap(brawlerNames => {
        if (brawlerNames.length === 0) return of([]);
        return forkJoin(
          brawlerNames.map(name =>
            this.apiService.getBrawlerWinrateHistory(this.currentPlayerId, name, days).pipe(
              catchError(() => of({ history: [] }))
            )
          )
        ).pipe(
          map((responses: unknown[]) => {
            const byDate = new Map<string, { matches: number; wins: number }>();
            for (const resp of responses) {
              const data = resp as { history?: WinrateHistoryPoint[] };
              for (const pt of data.history || []) {
                const cur = byDate.get(pt.date) || { matches: 0, wins: 0 };
                cur.matches += pt.matches ?? 0;
                cur.wins += pt.wins ?? 0;
                byDate.set(pt.date, cur);
              }
            }
            const result: WinrateHistoryPoint[] = [];
            byDate.forEach((v, date) => {
              const winRate = v.matches > 0 ? v.wins / v.matches : 0;
              result.push({ date, matches: v.matches, wins: v.wins, win_rate: winRate });
            });
            return result.sort((a, b) => a.date.localeCompare(b.date));
          })
        );
      }),
      catchError(() => of([]))
    );
  }

  /**
   * История винрейта игрока по дням (график) — GET /analytics/{playerId}/winrate-history
   */
  getPlayerWinrateHistory(days: number = 30): Observable<{ history: WinrateHistoryPoint[] } | null> {
    if (!this.currentPlayerId) return of(null);
    return this.apiService.getPlayerWinrateHistory(this.currentPlayerId, days).pipe(
      catchError(err => {
        console.error('Ошибка получения истории винрейта:', err);
        return of(null);
      })
    );
  }

  /** @deprecated используй getPlayerWinrateHistory */
  getBrawlerWinrateHistory(brawler: string, days: number = 30): Observable<any> {
    return this.getPlayerWinrateHistory(days);
  }

  /**
   * Топ лучших карт (API уже возвращает отсортированные)
   */
  getBestMaps(limit: number = 3): Observable<MapDisplay[]> {
    if (!this.currentPlayerId) return of([]);
    return this.apiService.getBestMaps(this.currentPlayerId, limit).pipe(
      map(r => (r.maps || []).map(m => ({
        name: m.map,
        winRate: m.win_rate > 1 ? m.win_rate : Math.round(m.win_rate * 100),
        image: this.getMapImage(m.map)
      }))),
      catchError(() => of([]))
    );
  }

  /**
   * Топ худших карт (API уже возвращает отсортированные)
   */
  getWorstMaps(limit: number = 3): Observable<MapDisplay[]> {
    if (!this.currentPlayerId) return of([]);
    return this.apiService.getWorstMaps(this.currentPlayerId, limit).pipe(
      map(r => (r.maps || []).map(m => ({
        name: m.map,
        winRate: m.win_rate > 1 ? m.win_rate : Math.round(m.win_rate * 100),
        image: this.getMapImage(m.map)
      }))),
      catchError(() => of([]))
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
   * Получить путь к изображению карты
   */
  private getMapImage(mapName: string): string {
    const key = mapName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const known: Record<string, string> = {
      'hard-rock-mine': 'assets/maps/mine.png'
    };
    return known[key] ?? 'assets/maps/mine.png';
  }

  /**
   * Получить путь к аватару бойца (public/assets/brawlers/{name}_portrait.png)
   * Имя в API может быть с заглавной/строчной
   */
  private getBrawlerAvatar(brawlerName: string): string {
    const base = brawlerName
      .replace(/\s*&\s*/g, '-')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\./g, '')
      .replace(/'/g, '');
    const special: Record<string, string> = {
      '8-bit': '8bit',
      'mrp': 'mrp',
      'rt': 'rt',
      'shelly': 'Shelly',
      'mina': 'Mina',
      'kaze': 'Kaze',
      'ziggy': 'Ziggy',
      'jae-yong': 'Jae-Yong',
    };
    const fileName = (special[base] ?? base) + '_portrait';
    return `assets/brawlers/${fileName}.png`;
  }
}
