import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AnalyticsService, BrawlerDisplay, MapDisplay } from '../services/analytics.service';
import { WinrateChartComponent } from '../components/winrate-chart.component';
import { environment } from '../../environments/environment';
import { WinrateHistoryPoint } from '../models/api.models';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, WinrateChartComponent],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit {
  activeTab = signal<'general' | 'detailed'>('general');

  // Данные для бойцов
  bestBrawlers: BrawlerDisplay[] = [];
  worstBrawlers: BrawlerDisplay[] = [];

  // Данные для карт (с API /maps/best и /maps/worst)
  bestMaps: MapDisplay[] = [];
  worstMaps: MapDisplay[] = [];

  isLoading = false;
  chartLoading = false;
  error: string | null = null;

  /** Данные для графика «Последние матчи» (дата + win rate) */
  recentMatchesData: WinrateHistoryPoint[] = [];

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Получить цвет винрейта на основе значения
   * < 30% - красный
   * 30-60% - жёлтый
   * 61-100% - зелёный
   */
  getWinRateColor(winRate: number): string {
    if (winRate < 30) {
      return '#ff4040'; // Красный
    } else if (winRate <= 60) {
      return '#ffcc00'; // Жёлтый
    } else {
      return '#00ff26'; // Зелёный
    }
  }

  ngOnInit(): void {
    const playerId = environment.playerId || '101';
    this.analyticsService.setPlayerId(playerId);
    this.loadAnalyticsData();
  }

  /**
   * Загрузка данных аналитики с сервера
   */
  loadAnalyticsData(): void {
    this.isLoading = true;
    this.error = null;

    this.analyticsService.getTopBrawlers(3).subscribe({
      next: (brawlers) => {
        this.bestBrawlers = brawlers;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки топ бойцов:', err);
        this.error = 'Не удалось загрузить данные';
        this.bestBrawlers = [];
        this.chartLoading = false;
      }
    });

    this.loadRecentMatchesChart();

    forkJoin({
      worstBrawlers: this.analyticsService.getWorstBrawlers(3),
      bestMaps: this.analyticsService.getBestMaps(3),
      worstMaps: this.analyticsService.getWorstMaps(3)
    }).subscribe({
      next: ({ worstBrawlers, bestMaps, worstMaps }) => {
        this.worstBrawlers = worstBrawlers;
        this.bestMaps = bestMaps;
        this.worstMaps = worstMaps;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки данных:', err);
        this.error = 'Не удалось загрузить данные';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Загрузка графика «Последние матчи» из GET /analytics/{playerId}/winrate-history?days=30
   */
  private loadRecentMatchesChart(): void {
    this.chartLoading = true;
    this.analyticsService.getPlayerWinrateHistory(30).subscribe({
      next: (resp) => {
        this.chartLoading = false;
        const history = resp?.history ?? [];
        this.recentMatchesData = this.normalizeWinrate(history);
        this.cdr.detectChanges();
      },
      error: () => {
        this.chartLoading = false;
        this.recentMatchesData = [];
        this.cdr.detectChanges();
      }
    });
  }

  /** win_rate может быть 0–1 или 0–100 */
  private normalizeWinrate(history: WinrateHistoryPoint[]): WinrateHistoryPoint[] {
    const max = Math.max(0, ...history.map(h => h.win_rate ?? 0));
    const scale = max > 1 ? 1 / 100 : 1;
    return history.map(h => ({ ...h, win_rate: (h.win_rate ?? 0) * scale }));
  }

  /**
   * Синхронизация данных игрока
   */
  syncPlayerData(): void {
    if (this.isLoading) return;

    const playerId = this.analyticsService.getPlayerId();
    if (!playerId) {
      console.warn('ID игрока не установлен');
      return;
    }

    this.isLoading = true;
    this.analyticsService.syncPlayer().subscribe({
      next: (response) => {
        console.log('Данные синхронизированы:', response);
        // Перезагружаем данные после синхронизации
        this.loadAnalyticsData();
      },
      error: (err) => {
        console.error('Ошибка синхронизации:', err);
        this.error = 'Не удалось синхронизировать данные';
        this.isLoading = false;
      }
    });
  }

  setTab(tab: 'general' | 'detailed') {
    this.activeTab.set(tab);
    if (tab === 'detailed') {
      this.router.navigate(['/analytics1']);
    }
  }
}
