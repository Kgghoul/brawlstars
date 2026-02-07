import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
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

  // Данные для карт (API не предоставляет endpoint для всех карт, только /maps/{map}/brawlers)
  // У игрока 101 только одна карта: Hard Rock Mine
  bestMaps: MapDisplay[] = [
    { name: 'Hard Rock Mine', winRate: 0, image: 'assets/maps/mine.png' }
  ];

  worstMaps: MapDisplay[] = [
    { name: 'Hard Rock Mine', winRate: 0, image: 'assets/maps/mine.png' }
  ];

  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('🚀 ngOnInit вызван');
    // Используем ID игрока из environment
    const playerId = environment.playerId || '101';
    console.log('📋 Player ID:', playerId);
    console.log('🌐 API URL:', environment.apiUrl);
    this.analyticsService.setPlayerId(playerId);
    console.log('📞 Вызываем loadAnalyticsData...');
    this.loadAnalyticsData();
  }

  /**
   * Загрузка данных аналитики с сервера
   */
  loadAnalyticsData(): void {
    console.log('🔄 loadAnalyticsData начал работу');
    this.isLoading = true;
    this.error = null;

    // Загружаем топ бойцов
    console.log('📤 Запрашиваем топ бойцов...');
    this.analyticsService.getTopBrawlers(3).subscribe({
      next: (brawlers) => {
        console.log('✅ Получены лучшие бойцы:', brawlers);
        this.bestBrawlers = brawlers;
        this.cdr.detectChanges();
        console.log('🔄 Change detection triggered');
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки топ бойцов:', err);
        this.error = 'Не удалось загрузить данные';
        this.bestBrawlers = [];
      }
    });

    // Загружаем худших бойцов
    console.log('📤 Запрашиваем худших бойцов...');
    this.analyticsService.getWorstBrawlers(3).subscribe({
      next: (brawlers) => {
        console.log('✅ Получены худшие бойцы:', brawlers);
        this.worstBrawlers = brawlers;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('🔄 Change detection triggered');
      },
      error: (err) => {
        console.error('❌ Ошибка загрузки худших бойцов:', err);
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
