"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { GameState } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 初期状態の更新
const initialState: GameState = {
  sessionId: undefined,
  grid: [],
  terms: [],
  score: 0,
  selectedCells: [],
  time: 120,
  gameOver: false,
  completedTerms: [],
  comboCount: 0,
  gamePhase: 'init' // 初期フェーズ
};

// コンテキスト作成と関数の追加
const GameStateContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  startGame: () => void;
  initializeGame: () => Promise<void>;
}>({
  state: initialState,
  setState: () => { },
  startGame: () => { },
  initializeGame: async () => { },
});

// プロバイダーコンポーネント
export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const timerRef: { current: NodeJS.Timeout | null } = { current: null };
  const router = useRouter();

  // カウントダウン開始関数
  const startGame = () => {
    // カウントダウンフェーズに切り替え
    setState(prev => ({
      ...prev,
      gamePhase: 'countdown'
    }));
  };

  // ゲーム初期化関数（APIコール）
  const initializeGame = async () => {
    try {
      // 既存のタイマーをクリア
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // APIコールでゲームセッション作成
      const response = await axios.post('http://localhost:8000/api/game/start');
      setState(prev => ({
        ...prev,
        sessionId: response.data.session_id,
        grid: response.data.grid,
        terms: response.data.terms,
        gamePhase: 'playing' // プレイ中フェーズに変更
      }));

      // タイマーの開始
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.time <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }

            // ゲーム終了時にセッション終了API呼び出し
            if (prev.sessionId) {
              axios.post(`http://localhost:8000/api/game/${prev.sessionId}/end`)
                .catch(err => console.error('Failed to end game session:', err));
            }

            return { 
              ...prev, 
              time: 0, 
              gameOver: true,
              gamePhase: 'gameover'  // ゲームオーバーフェーズに変更
            };
          }
          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      // エラー時は初期状態に戻す
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
    };
  }, []);

  return (
    <GameStateContext.Provider value={{ state, setState, startGame, initializeGame }}>
      {children}
    </GameStateContext.Provider>
  );
}

// フックとして使用
export function useGameState() {
  return useContext(GameStateContext);
}
