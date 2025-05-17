import { useState, useEffect, createContext, useContext } from 'react';
import { GameState } from '@/types';
import axios from 'axios';

// 初期状態
const initialState: GameState = {
  grid: [],
  terms: [],
  score: 0,
  selectedCells: [],
  time: 60,
  gameOver: false,
  completedTerms: [],
  comboCount: 0
};

// コンテキスト作成
const GameStateContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  startGame: () => Promise<void>;
}>({
  state: initialState,
  setState: () => { },
  startGame: async () => { },
});

// プロバイダーコンポーネント
export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const timerRef: { current: NodeJS.Timeout | null } = { current: null };

  const startGame = async () => {
    try {
      // 既存のタイマーをクリア
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const response = await axios.get('http://localhost:8000/api/game');
      setState({
        ...initialState,
        grid: response.data.grid,
        terms: response.data.terms,
      });

      // タイマーの開始
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.time <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return { ...prev, time: 0, gameOver: true };
          }
          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start game:', error);
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
    <GameStateContext.Provider value={{ state, setState, startGame }}>
      {children}
    </GameStateContext.Provider>
  );
}

// フックとして使用
export function useGameState() {
  return useContext(GameStateContext);
}
