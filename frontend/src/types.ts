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
}

// ゲームログのインターフェースを修正
export interface GameLog {
  action: string;
  timestamp: string;
  details: GameLogDetails;
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
}
