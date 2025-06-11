import { useGameState } from './useGameState';
import apiClient from '../lib/apiClient';
import { GameLog, ITTerm } from '../types'; // ITTerm をインポート
import { useEffect } from 'react';

// コールバック型を定義
type GameOverCallback = (results: {
  score: number;
  completedTerms: ITTerm[]; // any[] から ITTerm[] に変更
  availableTerms: ITTerm[]; // any[] から ITTerm[] に変更
  isHighScore: boolean;
}) => void;

export function useGameControls(onGameOver?: GameOverCallback) {
  const { state, setState } = useGameState();

  const handleCellClick = (row: number, col: number) => {
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

    // フロントエンドでの検証
    const result = apiClient.validateSelection(state.grid, state.selectedCells);

    if (result.valid && result.term) {
      // 重複チェック
      const isDuplicate = state.completedTerms.some(
        ct => ct.term.toUpperCase() === result.term!.term.toUpperCase()
      );

      // 新しいグリッドを作成（選択されたセルを空にする）
      const newGrid = apiClient.createNewGrid(state.grid, state.selectedCells);

      // ボーナス計算
      const [bonusPoints, bonusMessage, shouldReset] = apiClient.checkFieldBonus(newGrid);

      // コンボ数計算 - 重複の場合でもコンボを加算、ただし全消しボーナス時はリセット
      const comboCount = shouldReset ? 0 : state.comboCount + 1;

      // ポイント計算
      const points = apiClient.calculatePoints(result.term.fullName, comboCount, isDuplicate);

      // グリッドをリセットする必要がある場合
      let finalGrid = newGrid;
      if (shouldReset) {
        // フロントエンドで新しいグリッドを生成
        const allTerms = apiClient.TermDictionary.getInstance().getTerms();
        finalGrid = apiClient.generateGameGrid(allTerms);
      }

      // ログエントリを作成（型を明示的に指定）
      const now = new Date().toISOString();
      const logEntry: GameLog = {
        action: isDuplicate ? "単語重複" : "単語発見",
        timestamp: now,
        details: {
          term: result.term.term,
          term_description: result.term.description,
          word_points: points,
          bonus_points: bonusPoints,
          bonus_message: bonusMessage,
          combo_count: comboCount,
          score_change: points + bonusPoints
        }
      };

      // 状態更新（ログを追加）
      setState({
        ...state,
        grid: finalGrid,
        score: state.score + points + bonusPoints,
        selectedCells: [],
        completedTerms: isDuplicate ? state.completedTerms : [...state.completedTerms, result.term],
        comboCount: comboCount,
        bonusMessage: bonusMessage,
        showBonus: !!bonusMessage,
        logs: [...(state.logs || []), logEntry] // ログを追加
      });

      // ボーナスメッセージのタイマー処理
      if (bonusMessage) {
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            showBonus: false
          }));
        }, 3000);
      }
    } else {
      // 不正解の場合
      const now = new Date().toISOString();
      const logEntry: GameLog = {
        action: "無効な選択",
        timestamp: now,
        details: {
          selectedWord: result.selectedWord
        }
      };

      // フロントエンドで新しいグリッドを生成
      const allTerms = apiClient.TermDictionary.getInstance().getTerms();
      const newGrid = apiClient.generateGameGrid(allTerms);

      setState({
        ...state,
        grid: newGrid,
        selectedCells: [],
        comboCount: 0,
        logs: [...(state.logs || []), logEntry] // ログを追加
      });
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

    // フロントエンドで新しいグリッドを生成
    const allTerms = apiClient.TermDictionary.getInstance().getTerms();
    const newGrid = apiClient.generateGameGrid(allTerms);

    // リセットのログエントリを作成
    const now = new Date().toISOString();
    const logEntry: GameLog = {
      action: "リセット",
      timestamp: now,
      details: {
        combo_count: 0
      }
    };

    setState({
      ...state,
      grid: newGrid,
      selectedCells: [],
      comboCount: 0,
      logs: [...(state.logs || []), logEntry] // リセットログを追加
    });

  };

  // ゲーム終了時の処理
  useEffect(() => {
    if (state.gameOver) {
      // API呼び出しでゲーム終了情報を取得
      const fetchGameResults = async () => {
        try {
          const response = await fetch(`/api/game/${state.sessionId}/complete`);
          const data = await response.json();
          
          const results = {
            score: data.score,
            completedTerms: data.completed_terms,
            availableTerms: data.available_terms,
            isHighScore: data.score >= 1000
          };
          
          // 結果をローカルストレージに保存
          localStorage.setItem('gameResults', JSON.stringify(results));
          
          // コールバックが提供されている場合は呼び出す
          if (onGameOver) {
            onGameOver(results);
          }
        } catch (error) {
          console.error('ゲーム結果の取得に失敗しました:', error);
        }
      };
      
      fetchGameResults();
    }
  }, [state.gameOver, onGameOver, state.sessionId]); // state.sessionId を依存配列に追加

  return {
    handleCellClick,
    validateSelection,
    resetGrid
  };
}
