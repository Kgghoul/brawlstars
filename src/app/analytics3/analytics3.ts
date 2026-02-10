import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics3.html',
  styleUrl: './analytics3.scss'
})
export class Analytics3Component {
  activeTab = signal<'general' | 'detailed'>('detailed');

  constructor(private router: Router) { }

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

  // Данные карты (реальные данные игрока 101)
  mapData = {
    name: 'Hard Rock Mine',
    image: 'assets/maps/mine.png',
    wins: 0,
    losses: 1,
    winRate: 0
  };

  // Лучшие бойцы на этой карте (реальные данные из API)
  bestBrawlers = [
    { name: 'Pam', avatar: 'assets/brawlers/pam_portrait.png', winRate: 0, pickRate: 100 }
  ];

  // Худшие бойцы на этой карте
  worstBrawlers = [
    { name: 'Pam', avatar: 'assets/brawlers/pam_portrait.png', winRate: 0, pickRate: 100 }
  ];

  setTab(tab: 'general' | 'detailed') {
    this.activeTab.set(tab);
    if (tab === 'general') {
      this.router.navigate(['/analytics']);
    } else if (tab === 'detailed') {
      this.router.navigate(['/analytics1']);
    }
  }
}
