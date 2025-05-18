export const getSelectedWord = (grid: string[][], selectedCells: { row: number; col: number }[]): string => {
  return selectedCells.map(cell => grid[cell.row][cell.col]).join('');
};

