import { useGameState } from './useGameState';
import axios from 'axios';


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
    
    // セルを選択状態に追加
    setState({
      ...state,
      selectedCells: [...state.selectedCells, { row, col }]
    });
  };

  const validateSelection = async () => {
    if (state.selectedCells.length < 2 || state.gameOver || !state.sessionId) return;
    
    try {
      const response = await axios.post(`http://localhost:8000/api/game/${state.sessionId}/validate`, {
        selection: state.selectedCells
      });
      
      if (response.data.valid) {
        const term = response.data.term;
        // バックエンドから計算されたスコアを使用
        const newScore = response.data.new_score;
        const bonusMessage = response.data.bonus_message || '';
        
        // ゲーム状態の更新
        setState({
          ...state,
          grid: response.data.grid,
          score: newScore, // バックエンドから受け取ったスコアを直接使用
          selectedCells: [],
          completedTerms: [...state.completedTerms, term],
          comboCount: response.data.combo_count || state.comboCount,
          bonusMessage: bonusMessage,
          showBonus: !!bonusMessage
        });
        
        // ボーナスメッセージを表示後に非表示にするタイマー
        if (bonusMessage) {
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              showBonus: false
            }));
          }, 3000);
        }
      } else {
        // 不正解の場合、フィールドリセットとコンボリセット
        setState({
          ...state,
          grid: response.data.grid,
          selectedCells: [],
          comboCount: 0
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const resetGrid = async () => {
    if (!state.sessionId || state.gameOver) return;
    
    try {
      const response = await axios.post(`http://localhost:8000/api/game/${state.sessionId}/reset`);
      
      setState({
        ...state,
        grid: response.data.grid,
        selectedCells: [],
        comboCount: 0,
        score: response.data.score || state.score // バックエンドのスコアを反映
      });
    } catch (error) {
      console.error('Failed to reset grid:', error);
    }
  };

  return {
    handleCellClick,
    validateSelection,
    resetGrid
  };
}
