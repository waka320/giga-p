"use client";

import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { GameState } from '@/types';
import axios from 'axios';

// バックエンドAPIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
  const lastFetchTime = useRef<number>(0);
  const requestInProgress = useRef<boolean>(false);

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
      if (state.preloadedData || 
          (state.sessionId && state.grid.length > 0 && state.terms.length > 0)) {
        return;
      }

      if (requestInProgress.current) return;
      
      requestInProgress.current = true;

      const response = await axios.post(`${API_URL}/game/start`, {
        start_timer: false
      });

      requestInProgress.current = false;

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
      requestInProgress.current = false;
      throw error;
    }
  };

  // サーバーとの時間同期を行う関数
  const syncWithServer = async () => {
    if (!state.sessionId || state.gameOver) return;

    try {
      const response = await axios.get(`${API_URL}/game/${state.sessionId}/status`);

      const serverTime = new Date(response.data.server_time).getTime();
      const endTime = new Date(response.data.end_time).getTime();
      const remainingTime = response.data.remaining_time;

      const clientTime = Date.now();
      const timeOffset = serverTime - clientTime;

      const isGameOver = response.data.status === "completed" || remainingTime <= 0;
      
      if (isGameOver && !state.gameOver) {
        handleGameOver();
      }

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
      timerRef.current = null;
    }

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
            timerRef.current = null;
          }
          handleGameOver();
          return { ...prev, time: 0, gameOver: true, gamePhase: 'gameover' };
        }
        return { ...prev, time: prev.time - 0.1 };
      });
    }, 100);
  };

  // ゲームオーバー処理を統一
  const handleGameOver = useCallback(async () => {
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
        await axios.post(`${API_URL}/game/${state.sessionId}/end`);

        localStorage.setItem('gameResults', JSON.stringify({
          score: state.score,
          completedTerms: state.completedTerms
        }));
      } catch (error) {
        console.error('Failed to end game session:', error);
      }
    }
  }, [state.sessionId, state.score, state.completedTerms]);

  // ゲームデータをアクティブ化する関数
  const activateGame = async () => {
    let sessionId = state.sessionId;
    let timerAlreadyStarted = false;

    if (state.gamePhase === 'playing' && state.endTime) {
      timerAlreadyStarted = true;
    }

    if (!state.preloadedData) {
      if (state.sessionId) {
        setState(prev => ({
          ...prev,
          gamePhase: 'playing'
        }));
        
        sessionId = state.sessionId;
      } else {
        await initializeGame();
        return;
      }
    } else {
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

    if (sessionId && !timerAlreadyStarted) {
      try {
        await axios.post(`${API_URL}/game/${sessionId}/start_timer`);
        startPrecisionTimer();
      } catch (error) {
        console.error('Failed to start game timer:', error);
      }
    } else if (sessionId && timerAlreadyStarted) {
      startPrecisionTimer();
    }
  };

  // 従来のゲーム初期化関数
  const initializeGame = async () => {
    try {
      if (state.preloadedData) {
        activateGame();
        return;
      }

      if (state.sessionId && state.grid.length > 0 && state.terms.length > 0) {
        setState(prev => ({
          ...prev,
          gamePhase: 'playing'
        }));
        return;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (requestInProgress.current) return;
      
      requestInProgress.current = true;

      const response = await axios.post(`${API_URL}/game/start`, {
        start_timer: false
      });
      
      requestInProgress.current = false;
      
      setState(prev => ({
        ...prev,
        sessionId: response.data.session_id,
        grid: response.data.grid,
        terms: response.data.terms,
        gamePhase: 'playing'
      }));

      try {
        await axios.post(`${API_URL}/game/${response.data.session_id}/start_timer`);
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
      requestInProgress.current = false;
    }
  };

  // ゲームステータス取得関数
  const fetchGameStatus = useCallback(async () => {
    if (!state.sessionId || state.gameOver) return;
    
    try {
      const now = Date.now();
      if (now - lastFetchTime.current < 2000) return;
      
      lastFetchTime.current = now;
      
      const response = await axios.get(`${API_URL}/game/${state.sessionId}/status`);
      
      const serverTime = new Date(response.data.server_time).getTime();
      const endTime = new Date(response.data.end_time).getTime();
      const remainingTime = response.data.remaining_time;

      const clientTime = Date.now();
      const timeOffset = serverTime - clientTime;

      const isGameOver = response.data.status === "completed" || remainingTime <= 0;
      
      if (isGameOver && !state.gameOver) {
        handleGameOver();
      }

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
    } catch (error) {
      console.error('Failed to fetch game status:', error);
    }
  }, [state.sessionId, state.gameOver, handleGameOver]);

  useEffect(() => {
    if (state.sessionId && !state.gameOver && state.gamePhase === 'playing') {
      if (syncTimerRef.current) {
        return;
      }
      
      console.log('Starting polling for game status');
      
      const interval = setInterval(() => {
        fetchGameStatus();
      }, 3000);
      
      syncTimerRef.current = interval;

      return () => {
        console.log('Cleaning up polling interval');
        clearInterval(interval);
        syncTimerRef.current = null;
      };
    } else if (syncTimerRef.current) {
      console.log('Stopping polling - game not active');
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
  }, [state.sessionId, state.gameOver, state.gamePhase, fetchGameStatus]);

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
