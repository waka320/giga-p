export const calculatePoints = (wordLength: number, comboCount: number): number => {
  // 新しい計算式: (元の文字数) × (10 + コンボ数)
  return wordLength * (10 + comboCount);
};

export const createNewGrid = (grid: string[][], selectedCells: { row: number; col: number }[]): string[][] => {
  return grid.map((row, rowIdx) => 
    row.map((cell, colIdx) => {
      if (selectedCells.some(s => s.row === rowIdx && s.col === colIdx)) {
        return '';  // 選択したセルをクリア
      }
      return cell;
    })
  );
};

export const getSelectedWord = (grid: string[][], selectedCells: { row: number; col: number }[]): string => {
  return selectedCells.map(cell => grid[cell.row][cell.col]).join('');
};

export const isAdjacent = (cell1: { row: number; col: number }, cell2: { row: number; col: number }): boolean => {
  return Math.abs(cell1.row - cell2.row) <= 1 && Math.abs(cell1.col - cell2.col) <= 1;
};
