export interface ITTerm {
  term: string;
  fullName: string;
  description: string;
}

// 単語詳細の型を追加
export interface TermDetail {
  term: string;
  fullName: string;
  description: string;
}

// ゲームログの詳細情報の型を拡張
export interface GameLogDetails {
  word_points?: number;
  bonus_points?: number;
  term?: string;
  bonus_message?: string;
  term_description?: string;
  term_fullName?: string;
  term_details?: TermDetail[];
  new_terms?: string[];
  score_change?: number;
  combo_count?: number;
  selectedWord?: string;
}

// ゲームログのインターフェースを修正
export interface GameLog {
  action: string;
  timestamp: string;
  details: GameLogDetails;
}

// プリロードしたゲームデータの型
export interface PreloadedGameData {
  sessionId?: string;
  grid: string[][];
  terms: ITTerm[];
}

export interface GameState {
  sessionId?: string;  // セッションIDを追加
  grid: string[][];
  terms: ITTerm[];     // any から ITTerm に変更
  score: number;
  selectedCells: { row: number; col: number }[];
  time: number;
  gameOver: boolean;
  completedTerms: ITTerm[];  // any から ITTerm に変更
  comboCount: number;
  bonusMessage?: string; // ボーナスメッセージを追加
  showBonus?: boolean;   // ボーナス表示フラグ
  logs?: GameLog[];      // any から GameLog に変更
  gamePhase: 'init' | 'countdown' | 'playing' | 'gameover';
  preloadedData: PreloadedGameData | null; // プリロードデータを追加
  
  // 新しいフィールド
  endTime: number | null;  // ゲーム終了予定時刻（タイムスタンプ）
  serverTimeOffset: number; // サーバー時間とクライアント時間の差分
}

// GameResults型の拡張（/Users/WakaY/giga-p/frontend/src/types.ts）
export interface GameResults {
  score: number;
  completedTerms: ITTerm[];
  availableTerms: ITTerm[]; // グリッドに配置されていたすべての単語
  missedTerms: ITTerm[];    // 未発見だった単語
  isHighScore: boolean;
}
