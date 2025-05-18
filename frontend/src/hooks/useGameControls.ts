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
    if (state.selectedCells.length < 2 || state.gameOver || !state.sessionId) {
      console.log("Early return in validateSelection:", {
        selectedCells: state.selectedCells.length,
        gameOver: state.gameOver,
        sessionId: state.sessionId
      });
      return;
    }
    
    const endpoint = `http://localhost:8000/api/game/${state.sessionId}/validate`;
    console.log("Sending API request to:", endpoint);
    console.log("Request payload:", { selection: state.selectedCells });
    
    try {
      const response = await axios.post(endpoint, {
        selection: state.selectedCells
      });
      
      console.log("API Response:", response.data);
      
      if (response.data.valid) {
        // バックエンドからのすべての計算された値を使用
        setState({
          ...state,
          grid: response.data.grid,
          score: response.data.new_score,
          selectedCells: [],
          completedTerms: [...state.completedTerms, response.data.term],
          comboCount: response.data.combo_count || state.comboCount,
          bonusMessage: response.data.bonus_message || '',
          showBonus: !!response.data.bonus_message
        });
        
        // ボーナスメッセージのタイマー処理
        if (response.data.bonus_message) {
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              showBonus: false
            }));
          }, 3000);
        }
      } else {
        // 不正解の場合も、バックエンドから送られた値を使用
        setState({
          ...state,
          grid: response.data.grid,
          selectedCells: [],
          comboCount: 0
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      // エラーの詳細な情報を表示
      if (error.response) {
        // サーバーからのレスポンスがある場合
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合
        console.error('No response received:', error.request);
      } else {
        // リクエスト設定時のエラー
        console.error('Request error:', error.message);
      }
    }
  };

  const resetGrid = async () => {
    if (!state.sessionId || state.gameOver) {
      console.log("Early return in resetGrid:", {
        gameOver: state.gameOver,
        sessionId: state.sessionId
      });
      return;
    }
    
    const endpoint = `http://localhost:8000/api/game/${state.sessionId}/reset`;
    console.log("Sending API request to:", endpoint);
    
    try {
      const response = await axios.post(endpoint);
      
      console.log("Reset API Response:", response.data);
      
      setState({
        ...state,
        grid: response.data.grid,
        selectedCells: [],
        comboCount: 0,
        score: response.data.score || state.score // バックエンドのスコアを反映
      });
    } catch (error) {
      console.error('Failed to reset grid:', error);
      // エラーの詳細な情報を表示
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request error:', error.message);
      }
    }
  };

  return {
    handleCellClick,
    validateSelection,
    resetGrid
  };
}
