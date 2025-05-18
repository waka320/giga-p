export interface ITTerm {
  term: string;
  fullName: string;
  description: string;
}

export interface GameState {
  sessionId?: string;  // セッションIDを追加
  grid: string[][];
  terms: any[];
  score: number;
  selectedCells: { row: number; col: number }[];
  time: number;
  gameOver: boolean;
  completedTerms: any[];
  comboCount: number;
  bonusMessage?: string; // ボーナスメッセージを追加
  showBonus?: boolean;   // ボーナス表示フラグ
  logs?: any[];        // ゲームのログ情報を追加
}
