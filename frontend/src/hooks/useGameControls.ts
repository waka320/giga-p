import { useGameState } from './useGameState';
import axios from 'axios';

export function useGameControls() {
  const { state, setState } = useGameState();

  const handleCellClick = (row: number, col: number, isShiftKeyPressed = false) => {
    // ゲームオーバーまたはセッションIDがない場合は何もしない
    if (state.gameOver || !state.sessionId) return;

    // 現在のセル位置
    const currentCell = { row, col };

    // すでに選択されているか確認
    const existingIndex = state.selectedCells.findIndex(
      cell => cell.row === row && cell.col === col
    );

    // 新しい選択リスト
    let newSelectedCells;

    if (existingIndex >= 0) {

      // 通常クリックではそのセルのみ解除し、他の選択は維持する
      newSelectedCells = [
        ...state.selectedCells.slice(0, existingIndex),
        ...state.selectedCells.slice(existingIndex + 1)
      ];

    } else {
      // 新しいセルの選択を追加
      newSelectedCells = [...state.selectedCells, currentCell];
    }

    // 状態を更新
    setState(prev => ({
      ...prev,
      selectedCells: newSelectedCells
    }));
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

      // ゲームセッションの最新ログ情報を取得
      const logsEndpoint = `http://localhost:8000/api/game/${state.sessionId}/status`;
      const logsResponse = await axios.get(logsEndpoint);
      const gameLogs = logsResponse.data.logs || [];

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
          showBonus: !!response.data.bonus_message,
          logs: gameLogs // ログ情報を状態に保存
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
          comboCount: 0,
          logs: gameLogs // ログ情報を状態に保存
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      // エラーの詳細な情報を表示
      if (axios.isAxiosError(error)) {
        // サーバーからのレスポンスがある場合
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          // リクエストは送信されたがレスポンスがない場合
          console.error('No response received:', error.request);
        } else {
          // リクエスト設定時のエラー
          console.error('Request error:', error.message);
        }
      } else {
        // Axiosエラーでない場合
        console.error('Unexpected error:', error);
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
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request error:', error.message);
        }
      } else {
        // Axiosエラーでない場合
        console.error('Unexpected error:', error);
      }
    }
  };

  return {
    handleCellClick,
    validateSelection,
    resetGrid
  };
}
