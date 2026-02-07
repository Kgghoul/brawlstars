import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics1',
  imports: [CommonModule],
  templateUrl: './analytics1.html',
  styleUrl: './analytics1.scss'
})
export class Analytics1Component {
  activeTab = signal<'general' | 'detailed'>('detailed');

  constructor(private router: Router) { }

  // Режимы игры
  gameModes = [
    { name: 'Баунти', icon: 'assets/modes/baunti.png' },
    { name: 'Brawl Ball', icon: 'assets/modes/brawlball.png' },
    { name: 'Захват кристаллов', icon: 'assets/modes/gemgrab.png' },
    { name: 'Ограбление', icon: 'assets/modes/haist.png' },
    { name: 'Горячая зона', icon: 'assets/modes/hotzone.png' }
  ];

  // Данные для карт в анализе (реальные данные игрока 101)
  mapsAnalysis = [
    { name: 'Hard Rock Mine', winRate: 0, image: 'assets/maps/mine.png' }
  ];

  averageWR = 0;

  setTab(tab: 'general' | 'detailed') {
    this.activeTab.set(tab);
    if (tab === 'general') {
      this.router.navigate(['/analytics']);
    }
  }

  navigateToMapAnalysis(mapName: string) {
    this.router.navigate(['/analytics3']);
  }
}
