import { useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function GameSynchronizer() {
  const { state, syncWithServer } = useGameState();
  const syncFailCountRef = useRef(0);
  const lastSyncTimeRef = useRef<number | null>(null);

  // フォーカス時とタブ切り替え時のみ同期
  useEffect(() => {
    if (state.gamePhase !== 'playing' || !state.sessionId || state.gameOver) {
      return;
    }

    // フォーカス変更時に同期する
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab focused - syncing with server');
        syncWithServer()
          .then(() => {
            syncFailCountRef.current = 0;
            lastSyncTimeRef.current = Date.now();
          })
          .catch(() => {
            syncFailCountRef.current++;
            console.warn(`同期失敗カウント: ${syncFailCountRef.current}`);
          });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 1分ごとに一度同期を試みる（バックグラウンドの状態確認用）
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible' &&
        (!lastSyncTimeRef.current || Date.now() - lastSyncTimeRef.current > 30000)) {
        syncWithServer()
          .catch(() => syncFailCountRef.current++);
      }
    }, 60000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [state.gamePhase, state.sessionId, state.gameOver, syncWithServer]);

  return null;
}
