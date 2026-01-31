/**
 * Модели для API запросов и ответов
 */

// ============= Sync API =============

export interface SyncResponse {
  player_id: string;
  last_match_time: string;
  message: string;
}

// ============= Analytics API =============

export interface BrawlerStats {
  brawler: string;
  matches: number;
  wins: number;
  win_rate: number;
}

export interface TopBrawlersResponse {
  player_id: string;
  count: number;
  brawlers: BrawlerStats[];
}

export interface WinrateHistoryPoint {
  date: string;
  matches: number;
  wins: number;
  win_rate: number;
}

export interface BrawlerWinrateHistoryResponse {
  player_id: string;
  brawler: string;
  days: number;
  history: WinrateHistoryPoint[];
}

export interface MapBrawlerStats {
  brawler: string;
  map: string;
  matches: number;
  wins: number;
  win_rate: number;
}

export interface MapBrawlersResponse {
  player_id: string;
  map: string;
  count: number;
  brawlers: MapBrawlerStats[];
}

// ============= Error Response =============

export interface ErrorResponse {
  code: number;
  error: string;
  message: string;
}
