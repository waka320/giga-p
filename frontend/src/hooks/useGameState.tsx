"use client";

import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { GameState } from '@/types';
import axios from 'axios';
import apiClient from '@/lib/apiClient'; // apiClientをインポート

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
  serverTimeOffset: 0,
  logs: [] // 空の配列として初期化
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

      // apiClientを使用してプリロード
      const preloadedData = await apiClient.preloadGame();

      // 単語辞書も確実にロード
      const dictionary = apiClient.TermDictionary.getInstance();
      if (!dictionary.isTermLoaded()) {
        await dictionary.loadTerms();
      }

      requestInProgress.current = false;

      setState(prev => ({
        ...prev,
        preloadedData
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

      // サーバー時間と終了時間の情報のみ取得
      const serverTime = new Date(response.data.server_time).getTime();
      const endTime = new Date(response.data.end_time).getTime();
      const remainingTime = response.data.remaining_time;

      const clientTime = Date.now();
      const timeOffset = serverTime - clientTime;

      // ゲーム終了判定はサーバーから受け取る
      const isGameOver = response.data.status === "completed" || remainingTime <= 0;

      if (isGameOver && !state.gameOver) {
        handleGameOver();
      }

      // 時間関連の情報のみ更新し、フロントエンドで管理している
      // グリッド、スコア、コンボ、完了した単語などはそのまま維持
      setState(prev => ({
        ...prev,
        time: remainingTime,
        endTime: endTime,
        serverTimeOffset: timeOffset,
        gameOver: isGameOver
        // grid、score、comboCount、completedTermsは更新しない
      }));
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

      // サーバー時間関連の情報のみ取得
      const serverTime = new Date(response.data.server_time).getTime();
      const endTime = new Date(response.data.end_time).getTime();
      const remainingTime = response.data.remaining_time;

      const clientTime = Date.now();
      const timeOffset = serverTime - clientTime;

      const isGameOver = response.data.status === "completed" || remainingTime <= 0;

      if (isGameOver && !state.gameOver) {
        handleGameOver();
      }

      // 時間関連の情報のみ更新
      setState(prev => ({
        ...prev,
        time: remainingTime,
        endTime: endTime,
        serverTimeOffset: timeOffset,
        gameOver: isGameOver
        // その他の状態はフロントエンドで管理しているものを維持
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

      // 5秒ごとに変更（より長い間隔に）
      const interval = setInterval(() => {
        fetchGameStatus();
      }, 5000);

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
