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
  timerStarted: false, 
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
      // サーバーからの時間を取得
      const response = await axios.get(`${API_URL}/game/${state.sessionId}/status`);
      const remainingTime = response.data.remaining_time;
      
      // サーバー時間を参照するが、フロントエンドのタイマーを優先する
      // 極端な差分がある場合のみ調整する（例：5秒以上の差がある場合）
      setState(prev => {
        // フロントエンドのタイマーと5秒以上の差がある場合のみ考慮
        if (Math.abs(prev.time - remainingTime) > 1) {
          // サーバー側の時間が10秒未満なら優先する（ゲーム終了に近い場合）
          if (remainingTime < 10) {
            return {
              ...prev,
              time: remainingTime,
              gameOver: remainingTime <= 0
            };
          }
        }
        // 通常はフロントエンドのタイマーを使用
        return prev;
      });
    } catch (error) {
      console.error('タイマー同期失敗:', error);
      // エラーがあっても問題なし（フロントエンドのタイマーが動いているため）
    }
  };

  // より強固なタイマー実装
  const startPrecisionTimer = () => {
    // 既にタイマーが動作している場合はクリア
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 開始時間をクライアント側で記録
    const startTime = Date.now();
    // 終了時間も計算（2分後）
    const endTime = startTime + 120000; // 120秒 = 2分

    // ゲーム状態を更新
    setState(prev => ({
      ...prev,
      endTime: endTime,
      gamePhase: 'playing',
      time: 120, // 初期値として120秒（2分）を設定
      timerStarted: true // タイマーが開始されたことを示すフラグを設定
    }));

    // より頻繁に更新（100ms間隔）してタイマーの精度を向上
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, endTime - now);
      const remainingSecs = Math.ceil(remainingMs / 1000);

      setState(prev => {
        // 時間切れなら、ゲームオーバーに
        if (remainingSecs <= 0 && !prev.gameOver) {
          if (syncTimerRef.current) {
            clearInterval(syncTimerRef.current);
            syncTimerRef.current = null;
          }

          handleGameOver();
          return { ...prev, time: 0, gameOver: true, timerStarted: false };
        }
        return { ...prev, time: remainingSecs };
      });
    }, 100); // 100msごとに更新
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

  // ゲームアクティベーション処理の修正
  const activateGame = async () => {
    try {
      // プリロード済みデータを使用するケース
      if (state.preloadedData) {
        const sessionId = state.preloadedData.sessionId;
        
        setState(prev => ({
          ...prev,
          sessionId: sessionId,
          grid: state.preloadedData?.grid || [],
          terms: state.preloadedData?.terms || [],
          gamePhase: 'playing'
        }));
        
        // タイマーを確実に開始
        startPrecisionTimer();
        
        // バックエンドのタイマーも開始を試みる（失敗しても続行）
        try {
          if (sessionId) {
            await axios.post(`${API_URL}/game/${sessionId}/start_timer`);
            console.log('Backend timer started successfully');
          }
        } catch (apiError) {
          // エラー変数名を変更して未使用警告を回避
          console.error('Failed to start backend timer, continuing with frontend timer:', apiError);
        }
      } else {
        // 通常のゲーム初期化フロー
        initializeGame();
      }
    } catch (initError) {
      console.error('Failed to activate game:', initError);
      // エラーが発生してもゲームを開始
      initializeGame();
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

      // タイマー開始をAPIの成功に関係なく行う
      try {
        await axios.post(`${API_URL}/game/${response.data.session_id}/start_timer`);
      } catch (timerError) {
        console.error('Failed to start game timer on server, using client timer:', timerError);
      } finally {
        startPrecisionTimer(); // エラーが出ても確実にフロントエンドでタイマー開始
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
