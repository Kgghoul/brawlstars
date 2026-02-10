import { Injectable } from '@angular/core';
import { WinrateHistoryPoint } from '../models/api.models';

export interface ChartPoint {
  x: number;
  y: number;
  date: string;
  winRate: number;
  matches?: number;
  wins?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  
  /**
   * Преобразовать историю винрейта в точки для SVG графика
   * @param history История винрейта
   * @param width Ширина графика
   * @param height Высота графика
   * @returns Массив точек для отрисовки
   */
  convertWinrateHistoryToChartPoints(
    history: WinrateHistoryPoint[],
    width: number = 272,
    height: number = 180
  ): ChartPoint[] {
    if (!history || history.length === 0) {
      return [];
    }

    const points: ChartPoint[] = [];
    const stepX = width / (history.length - 1 || 1);

    // Найти минимальный и максимальный винрейт для масштабирования
    const winRates = history.map(h => h.win_rate);
    const minWinRate = Math.min(...winRates);
    const maxWinRate = Math.max(...winRates);
    const range = maxWinRate - minWinRate || 1;

    history.forEach((point, index) => {
      const x = index * stepX;
      // Инвертируем Y, так как SVG координаты начинаются сверху
      const normalizedY = (point.win_rate - minWinRate) / range;
      const y = height - (normalizedY * height);

      points.push({
        x,
        y,
        date: point.date,
        winRate: Math.round(point.win_rate * 100),
        matches: point.matches,
        wins: point.wins
      });
    });

    return points;
  }

  /**
   * Создать SVG path строку из точек
   * @param points Массив точек
   * @returns SVG path строка
   */
  createSVGPath(points: ChartPoint[]): string {
    if (points.length === 0) {
      return '';
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  }

  /**
   * Создать SVG path с плавными кривыми (cubic bezier)
   * @param points Массив точек
   * @returns SVG path строка
   */
  createSmoothSVGPath(points: ChartPoint[]): string {
    if (points.length === 0) {
      return '';
    }

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      
      // Контрольные точки для плавной кривой
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    return path;
  }

  /**
   * Создать SVG path для заливки (закрыть путь внизу)
   * @param points Массив точек
   * @param height Высота графика
   * @returns SVG path строка для заливки
   */
  createFillPath(points: ChartPoint[], height: number = 180): string {
    if (points.length === 0) {
      return '';
    }

    const linePath = this.createSmoothSVGPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    // Добавляем линии вниз и обратно к началу
    return `${linePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;
  }

  /**
   * Форматировать дату для отображения
   * @param dateString Строка даты
   * @returns Отформатированная дата
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  }

  /**
   * Получить метки для оси X
   * @param history История винрейта
   * @param maxLabels Максимальное количество меток
   * @returns Массив меток
   */
  getXAxisLabels(history: WinrateHistoryPoint[], maxLabels: number = 5): string[] {
    if (!history || history.length === 0) {
      return [];
    }

    const step = Math.ceil(history.length / maxLabels);
    const labels: string[] = [];

    for (let i = 0; i < history.length; i += step) {
      labels.push(this.formatDate(history[i].date));
    }

    // Всегда добавляем последнюю метку
    if (history.length > 1) {
      labels.push(this.formatDate(history[history.length - 1].date));
    }

    return labels;
  }

  /**
   * Получить метки для оси Y (винрейт)
   * @param minWinRate Минимальный винрейт
   * @param maxWinRate Максимальный винрейт
   * @param steps Количество шагов
   * @returns Массив меток в процентах
   */
  getYAxisLabels(minWinRate: number, maxWinRate: number, steps: number = 5): number[] {
    const range = maxWinRate - minWinRate;
    const step = range / steps;
    const labels: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const value = minWinRate + (step * i);
      labels.push(Math.round(value * 100)); // Преобразуем в проценты
    }

    return labels;
  }
}
