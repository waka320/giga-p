import { useGameState } from './useGameState';
import axios from 'axios';
import { calculatePoints, createNewGrid } from '@/lib/gameLogic';

export function useGameControls() {
  const { state, setState } = useGameState();

  const handleCellClick = (row: number, col: number) => {
    if (state.gameOver) return;
    
    // すでに選択されているセルかチェック
    const alreadySelected = state.selectedCells.some(
      cell => cell.row === row && cell.col === col
    );
    
    if (alreadySelected) {
      // 選択解除（最後のセルの場合のみ）
      if (state.selectedCells.length > 0 && 
          state.selectedCells[state.selectedCells.length - 1].row === row && 
          state.selectedCells[state.selectedCells.length - 1].col === col) {
        setState({
          ...state,
          selectedCells: state.selectedCells.slice(0, -1)
        });
      }
      return;
    }
    
    // 隣接チェック（最初のセルは除く）
    if (state.selectedCells.length > 0) {
      const lastCell = state.selectedCells[state.selectedCells.length - 1];
      const isAdjacent = 
        Math.abs(lastCell.row - row) <= 1 && 
        Math.abs(lastCell.col - col) <= 1;
      
      if (!isAdjacent) return;
    }
    
    // セルを選択状態に追加
    setState({
      ...state,
      selectedCells: [...state.selectedCells, { row, col }]
    });
  };

  const validateSelection = async () => {
    if (state.selectedCells.length < 2 || state.gameOver) return;
    
    // 選択されたアルファベットを結合して単語を形成
    const selectedWord = state.selectedCells.map(
      cell => state.grid[cell.row][cell.col]
    ).join('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/validate', { term: selectedWord });
      
      if (response.data.valid) {
        const term = response.data.term;
        const points = calculatePoints(selectedWord.length, state.comboCount);
        
        // 新しいグリッドを作成
        const newGrid = createNewGrid(state.grid, state.selectedCells);
        
        setState({
          ...state,
          grid: newGrid,
          score: state.score + points,
          selectedCells: [],
          completedTerms: [...state.completedTerms, term],
          comboCount: state.comboCount + 1
        });
      } else {
        // 不正解の場合、選択をリセット
        setState({
          ...state,
          selectedCells: [],
          comboCount: 0
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return {
    handleCellClick,
    validateSelection
  };
}
