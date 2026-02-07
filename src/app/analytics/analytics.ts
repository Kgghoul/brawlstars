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
    // Используем ID игрока из environment
    const playerId = environment.playerId || '101';
    console.log('Player ID:', playerId);
    console.log('API URL:', environment.apiUrl);
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
        console.log('✅ Получены лучшие бойцы:', brawlers);
        this.bestBrawlers = brawlers;
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки топ бойцов:', err);
        console.error('Детали ошибки:', err.status, err.statusText, err.error);
        this.error = 'Не удалось загрузить данные';
        this.bestBrawlers = [];
      }
    });

    // Загружаем худших бойцов
    this.analyticsService.getWorstBrawlers(3).subscribe({
      next: (brawlers) => {
        console.log('✅ Получены худшие бойцы:', brawlers);
        this.worstBrawlers = brawlers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки худших бойцов:', err);
        console.error('Детали ошибки:', err.status, err.statusText, err.error);
        this.error = 'Не удалось загрузить данные';
        this.worstBrawlers = [];
        this.isLoading = false;
      }
    });
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
