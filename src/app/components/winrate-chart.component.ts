import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinrateHistoryPoint } from '../models/api.models';
import { ChartDataService, ChartPoint } from '../services/chart-data.service';

@Component({
  selector: 'app-winrate-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-title" *ngIf="title">{{ title }}</div>
      
      <svg 
        [attr.width]="width" 
        [attr.height]="height" 
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        
        <!-- Сетка -->
        <g class="grid" *ngIf="showGrid">
          <line 
            *ngFor="let y of gridLines" 
            [attr.x1]="0" 
            [attr.y1]="y" 
            [attr.x2]="width" 
            [attr.y2]="y"
            stroke="rgba(255, 255, 255, 0.1)" 
            stroke-width="1" />
        </g>

        <!-- Заливка -->
        <path 
          *ngIf="fillPath"
          [attr.d]="fillPath"
          [attr.fill]="fillGradientId"
          opacity="0.3" />

        <!-- Линия графика -->
        <path 
          *ngIf="linePath"
          [attr.d]="linePath"
          [attr.stroke]="lineColor"
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none" />

        <!-- Точки на графике -->
        <g class="data-points" *ngIf="showPoints">
          <circle 
            *ngFor="let point of chartPoints"
            [attr.cx]="point.x"
            [attr.cy]="point.y"
            r="4"
            [attr.fill]="lineColor"
            class="chart-point"
            [attr.data-date]="point.date"
            [attr.data-winrate]="point.winRate" />
        </g>

        <!-- Градиент для заливки -->
        <defs>
          <linearGradient 
            [attr.id]="gradientId" 
            x1="0" 
            y1="0" 
            x2="0" 
            y2="1">
            <stop offset="0%" [attr.stop-color]="lineColor" />
            <stop offset="100%" [attr.stop-color]="lineColor" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Подсказка при наведении -->
      <div 
        class="chart-tooltip" 
        *ngIf="tooltipVisible"
        [style.left.px]="tooltipX"
        [style.top.px]="tooltipY">
        <div class="tooltip-date">{{ tooltipDate }}</div>
        <div class="tooltip-winrate">WR: {{ tooltipWinRate }}%</div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
    }

    .chart-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #fff;
    }

    svg {
      width: 100%;
      height: auto;
    }

    .chart-point {
      cursor: pointer;
      transition: r 0.2s ease;
    }

    .chart-point:hover {
      r: 6;
    }

    .chart-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      pointer-events: none;
      z-index: 100;
      white-space: nowrap;
      transform: translate(-50%, -100%);
      margin-top: -8px;
    }

    .tooltip-date {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .tooltip-winrate {
      color: #EF7527;
    }
  `]
})
export class WinrateChartComponent implements OnChanges {
  @Input() data: WinrateHistoryPoint[] = [];
  @Input() width: number = 272;
  @Input() height: number = 180;
  @Input() lineColor: string = '#EF7527';
  @Input() showGrid: boolean = true;
  @Input() showPoints: boolean = false;
  @Input() title?: string;

  chartPoints: ChartPoint[] = [];
  linePath: string = '';
  fillPath: string = '';
  gridLines: number[] = [];
  gradientId: string = '';
  fillGradientId: string = '';

  // Tooltip
  tooltipVisible: boolean = false;
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipDate: string = '';
  tooltipWinRate: number = 0;

  constructor(private chartDataService: ChartDataService) {
    this.gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    this.fillGradientId = `url(#${this.gradientId})`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    // Преобразуем данные в точки графика
    this.chartPoints = this.chartDataService.convertWinrateHistoryToChartPoints(
      this.data,
      this.width,
      this.height
    );

    // Создаем пути для SVG
    this.linePath = this.chartDataService.createSmoothSVGPath(this.chartPoints);
    this.fillPath = this.chartDataService.createFillPath(this.chartPoints, this.height);

    // Создаем линии сетки
    if (this.showGrid) {
      this.gridLines = [];
      const gridStep = this.height / 10;
      for (let i = 0; i <= 10; i++) {
        this.gridLines.push(i * gridStep);
      }
    }
  }

  showTooltip(event: MouseEvent, point: ChartPoint): void {
    this.tooltipVisible = true;
    this.tooltipX = point.x;
    this.tooltipY = point.y;
    this.tooltipDate = this.chartDataService.formatDate(point.date);
    this.tooltipWinRate = point.winRate;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }
}
