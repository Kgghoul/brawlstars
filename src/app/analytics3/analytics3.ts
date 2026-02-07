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

  // Данные карты
  mapData = {
    name: 'Вжух-Вжух',
    image: 'assets/maps/juhjuh.png',
    wins: 94,
    losses: 10,
    winRate: 91
  };

  // Лучшие бойцы
  bestBrawlers = [
    { name: 'Алли', avatar: 'assets/brawlers/Alli.png', winRate: 99, pickRate: 20 },
    { name: 'Брок', avatar: 'assets/brawlers/broke.png', winRate: 87, pickRate: 15 },
    { name: 'Белль', avatar: 'assets/brawlers/bell.png', winRate: 79, pickRate: 7 }
  ];

  // Худшие бойцы
  worstBrawlers = [
    { name: 'Алли', avatar: 'assets/brawlers/Alli.png', winRate: 0, pickRate: 1 },
    { name: 'Брок', avatar: 'assets/brawlers/broke.png', winRate: 1, pickRate: 1 },
    { name: 'Белль', avatar: 'assets/brawlers/bell.png', winRate: 2, pickRate: 1 }
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
