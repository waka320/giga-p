export interface ITTerm {
  term: string;
  fullName: string;
  description: string;
  difficulty: number;
}

export interface GameState {
  grid: string[][];
  terms: ITTerm[];
  score: number;
  selectedCells: {row: number, col: number}[];
  time: number;
  gameOver: boolean;
  completedTerms: ITTerm[];
  comboCount: number;
}
