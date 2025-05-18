export interface ITTerm {
  term: string;
  fullName: string;
  description: string;
}

// ゲームログのインターフェースを追加
export interface GameLog {
  action: string;
  timestamp: string;
  details: {
    word_points?: number;
    bonus_points?: number;
    term?: string;
    bonus_message?: string;
  };
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
