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
    
    // 隣接チェックを削除 - どのセルでも選択可能
    
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
        // 不正解の場合、現在の用語でグリッドを更新
        getNewGrid();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 不正解の場合、現在の用語でグリッドを更新
  const getNewGrid = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/refresh-grid', {
        terms: state.terms
      });
      setState({
        ...state,
        grid: response.data.grid,
        selectedCells: [],
        comboCount: 0
      });
    } catch (error) {
      console.error('Failed to refresh grid:', error);
      setState({
        ...state,
        selectedCells: [],
        comboCount: 0
      });
    }
  };

  return {
    handleCellClick,
    validateSelection
  };
}
