import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnalyticsService, BrawlerDisplay, MapDisplay } from '../services/analytics.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit {
  activeTab = signal<'general' | 'detailed'>('general');

  // Данные для бойцов
  bestBrawlers: BrawlerDisplay[] = [];
  worstBrawlers: BrawlerDisplay[] = [];

  // Данные для карт (временные, пока нет API для карт)
  bestMaps: MapDisplay[] = [
    { name: 'Кремовый торт', winRate: 89, image: 'assets/maps/creamycake.png' },
    { name: 'Взятие моста', winRate: 91, image: 'assets/maps/bridgetaking.png' },
    { name: 'Роковая шахта', winRate: 87, image: 'assets/maps/mine.png' }
  ];

  worstMaps: MapDisplay[] = [
    { name: 'Кремовый торт', winRate: 32, image: 'assets/maps/creamycake.png' },
    { name: 'Взятие моста', winRate: 27, image: 'assets/maps/bridgetaking.png' },
    { name: 'Роковая шахта', winRate: 41, image: 'assets/maps/mine.png' }
  ];

  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    // Сначала загружаем demo-данные
    this.loadDemoData();
    
    // Затем пытаемся загрузить реальные данные
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

    // Загружаем топ бойцов
    this.analyticsService.getTopBrawlers(3).subscribe({
      next: (brawlers) => {
        if (brawlers && brawlers.length > 0) {
          this.bestBrawlers = brawlers;
          console.log('✅ Загружены лучшие бойцы:', brawlers);
        }
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки топ бойцов:', err);
        console.log('📊 Используются demo-данные');
        this.error = 'Не удалось загрузить данные с сервера. Показаны тестовые данные.';
      }
    });

    // Загружаем худших бойцов
    this.analyticsService.getWorstBrawlers(3).subscribe({
      next: (brawlers) => {
        if (brawlers && brawlers.length > 0) {
          this.worstBrawlers = brawlers;
          console.log('✅ Загружены худшие бойцы:', brawlers);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки худших бойцов:', err);
        console.log('📊 Используются demo-данные');
        this.error = 'Не удалось загрузить данные с сервера. Показаны тестовые данные.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Загрузка демо-данных (заглушка)
   */
  loadDemoData(): void {
    this.bestBrawlers = [
      { name: 'Алли', winRate: 99, pickRate: 20, avatar: 'assets/brawlers/Alli.png' },
      { name: 'Брок', winRate: 87, pickRate: 15, avatar: 'assets/brawlers/broke.png' },
      { name: 'Белль', winRate: 79, pickRate: 7, avatar: 'assets/brawlers/bell.png' }
    ];

    this.worstBrawlers = [
      { name: 'Алли', winRate: 0, pickRate: 1, avatar: 'assets/brawlers/Alli.png' },
      { name: 'Брок', winRate: 1, pickRate: 1, avatar: 'assets/brawlers/broke.png' },
      { name: 'Белль', winRate: 2, pickRate: 1, avatar: 'assets/brawlers/bell.png' }
    ];
  }

  /**
   * Получить ID игрока из хранилища
   */
  private getPlayerIdFromStorage(): string | null {
    // Попробуем получить ID из localStorage
    return localStorage.getItem('playerId');
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
