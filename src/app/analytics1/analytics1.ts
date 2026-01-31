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

  // Данные для карт в анализе
  mapsAnalysis = [
    { name: 'Кристальный форт', winRate: 21, image: 'assets/maps/crystalfort.png' },
    { name: 'Вжух-Вжух', winRate: 91, image: 'assets/maps/juhjuh.png' },
    { name: 'Роковая шахта', winRate: 87, image: 'assets/maps/mine.png' }
  ];

  averageWR = 67;

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
