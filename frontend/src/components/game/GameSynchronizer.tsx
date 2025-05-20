import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function GameSynchronizer() {
  const { state, syncWithServer } = useGameState();
  
  // ゲームプレイ中のみ、定期的に同期
  useEffect(() => {
    if (state.gamePhase !== 'playing' || !state.sessionId || state.gameOver) {
      return;
    }
    
    // 初回同期
    syncWithServer();
    
    // フォーカス/ブラー時に同期
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.gamePhase, state.sessionId, state.gameOver, syncWithServer]);
  
  // 表示するものはない
  return null;
}