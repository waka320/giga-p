"use client";

import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { GameState } from '@/types';
import axios from 'axios';

// 初期状態
const initialState: GameState = {
  sessionId: undefined,
  grid: [],
  terms: [],
  score: 0,
  selectedCells: [],
  time: 120, // 120秒からスタート
  gameOver: false,
  completedTerms: [],
  comboCount: 0,
  gamePhase: 'init',
  preloadedData: null,
  endTime: null,
  serverTimeOffset: 0
};

// コンテキスト作成
const GameStateContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  startGame: () => void;
  preloadGame: () => Promise<void>;
  activateGame: () => Promise<void>;
  initializeGame: () => Promise<void>;
  syncWithServer: () => Promise<void>;
}>({
  state: initialState,
  setState: () => { },
  startGame: () => { },
  preloadGame: async () => { },
  activateGame: async () => { },
  initializeGame: async () => { },
  syncWithServer: async () => { }
});

// プロバイダーコンポーネント
export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // カウントダウン開始関数
  const startGame = () => {
    setState(prev => ({
      ...prev,
      gamePhase: 'countdown'
    }));

    preloadGame().catch(err => {
      console.error('Failed to preload game data:', err);
    });
  };

  // ゲームデータをプリロードする関数
  const preloadGame = async () => {
    try {
      if (state.sessionId && state.grid.length > 0 && state.terms.length > 0) {
        setState(prev => ({
          ...prev,
          preloadedData: {
            sessionId: prev.sessionId,
            grid: prev.grid,
            terms: prev.terms
          }
        }));
        return;
      }

      if (state.preloadedData) {
        return;
      }

      // タイマーを開始しないオプションを明示的に指定
      const response = await axios.post('http://localhost:8000/api/game/start', {
        start_timer: false
      });

      setState(prev => ({
        ...prev,
        preloadedData: {
          sessionId: response.data.session_id,
          grid: response.data.grid,
          terms: response.data.terms
        }
      }));
    } catch (error) {
      console.error('Failed to preload game data:', error);
      setState(prev => ({
        ...prev,
        preloadedData: null
      }));
      throw error;
    }
  };

  // サーバーとの時間同期を行う関数
  const syncWithServer = async () => {
    if (!state.sessionId || state.gameOver) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/game/${state.sessionId}/status`);

      const serverTime = new Date(response.data.server_time).getTime();
      const endTime = new Date(response.data.end_time).getTime();
      const remainingTime = response.data.remaining_time;

      const clientTime = Date.now();
      const timeOffset = serverTime - clientTime;

      // ゲームオーバー条件を先にチェック
      const isGameOver = response.data.status === "completed" || remainingTime <= 0;
      
      // ゲームオーバーになった場合のみ処理
      if (isGameOver && !state.gameOver) {
        handleGameOver();
      }

      // 既存の値と比較して、変更がある場合のみ更新する
      if (
        state.time !== remainingTime ||
        state.endTime !== endTime ||
        state.serverTimeOffset !== timeOffset ||
        state.score !== response.data.score ||
        JSON.stringify(state.grid) !== JSON.stringify(response.data.grid) ||
        JSON.stringify(state.completedTerms) !== JSON.stringify(response.data.completed_terms) ||
        state.comboCount !== response.data.combo_count ||
        state.gameOver !== isGameOver
      ) {
        setState(prev => ({
          ...prev,
          time: remainingTime,
          endTime: endTime,
          serverTimeOffset: timeOffset,
          score: response.data.score,
          grid: response.data.grid,
          completedTerms: response.data.completed_terms,
          comboCount: response.data.combo_count,
          gameOver: isGameOver
        }));
      }
    } catch (error) {
      console.error('Failed to sync with server:', error);
    }
  };

  // より精度の高いタイマー実装
  const startPrecisionTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }

    syncTimerRef.current = setInterval(syncWithServer, 10000);

    syncWithServer();

    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.endTime) {
          const adjustedNow = Date.now() + prev.serverTimeOffset;
          const remainingMs = prev.endTime - adjustedNow;
          const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

          if (remainingSec <= 0 && !prev.gameOver) {
            handleGameOver();
            return { ...prev, time: 0, gameOver: true, gamePhase: 'gameover' };
          }

          return { ...prev, time: remainingSec };
        }

        if (prev.time <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleGameOver();
          return { ...prev, time: 0, gameOver: true, gamePhase: 'gameover' };
        }
        return { ...prev, time: prev.time - 0.1 };
      });
    }, 100);
  };

  // ゲームオーバー処理を統一
  const handleGameOver = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    if (state.sessionId) {
      try {
        await axios.post(`http://localhost:8000/api/game/${state.sessionId}/end`);

        localStorage.setItem('gameResults', JSON.stringify({
          score: state.score,
          completedTerms: state.completedTerms
        }));
      } catch (error) {
        console.error('Failed to end game session:', error);
      }
    }
  };

  // ゲームデータをアクティブ化する関数
  const activateGame = async () => {
    let sessionId = state.sessionId;

    if (!state.preloadedData) {
      if (state.sessionId) {
        setState(prev => ({
          ...prev,
          gamePhase: 'playing'
        }));
        
        // セッションIDを取得
        sessionId = state.sessionId;
      } else {
        // データがない場合は初期化
        await initializeGame();
        return;
      }
    } else {
      // プリロードデータから状態を更新
      sessionId = state.preloadedData.sessionId;
      
      setState(prev => ({
        ...prev,
        sessionId: prev.preloadedData?.sessionId,
        grid: prev.preloadedData?.grid || [],
        terms: prev.preloadedData?.terms || [],
        gamePhase: 'playing',
        preloadedData: null
      }));
    }

    if (sessionId) {
      try {
        // カウントダウン完了後にタイマーを明示的に開始
        await axios.post(`http://localhost:8000/api/game/${sessionId}/start_timer`);
        
        // 精度の高いタイマー開始
        startPrecisionTimer();
      } catch (error) {
        console.error('Failed to start game timer:', error);
      }
    }
  };

  // 従来のゲーム初期化関数
  const initializeGame = async () => {
    try {
      if (state.preloadedData) {
        activateGame();
        return;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // タイマーを開始しないオプションを明示的に指定
      const response = await axios.post('http://localhost:8000/api/game/start', {
        start_timer: false
      });
      
      setState(prev => ({
        ...prev,
        sessionId: response.data.session_id,
        grid: response.data.grid,
        terms: response.data.terms,
        gamePhase: 'playing'
      }));

      try {
        // 状態更新後にタイマーを明示的に開始
        await axios.post(`http://localhost:8000/api/game/${response.data.session_id}/start_timer`);
        startPrecisionTimer();
      } catch (error) {
        console.error('Failed to start game timer:', error);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setState(prev => ({
        ...prev,
        gamePhase: 'init'
      }));
    }
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, []);

  return (
    <GameStateContext.Provider value={{
      state,
      setState,
      startGame,
      preloadGame,
      activateGame,
      initializeGame,
      syncWithServer
    }}>
      {children}
    </GameStateContext.Provider>
  );
}

// フックとして使用
export function useGameState() {
  return useContext(GameStateContext);
}
