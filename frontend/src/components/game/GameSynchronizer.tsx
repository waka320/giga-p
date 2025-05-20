import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function GameSynchronizer() {
  const { state, syncWithServer } = useGameState();
  
  // フォーカス時のみ同期し、通常のポーリングと重複させない
  useEffect(() => {
    if (state.gamePhase !== 'playing' || !state.sessionId || state.gameOver) {
      return;
    }
    
    // フォーカス変更時のみ同期する
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab focused - syncing with server');
        syncWithServer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.gamePhase, state.sessionId, state.gameOver, syncWithServer]);
  
  return null;
}