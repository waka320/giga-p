import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Controls() {
  const { state } = useGameState();
  const { validateSelection, resetGrid } = useGameControls();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enterキーでバリデーション
      if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && 
          state.selectedCells.length >= 2 && !state.gameOver && state.sessionId) {
        e.preventDefault();
        validateSelection();
        return;
      }
      
      // Escキーでリセット
      if (e.key === 'Escape' && !state.gameOver && state.sessionId) {
        e.preventDefault();
        resetGrid();
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedCells, state.gameOver, state.sessionId, validateSelection, resetGrid]);

  // デバッグ用：状態変更を確認
  useEffect(() => {
    console.log("Controls: selectedCells updated", state.selectedCells);
  }, [state.selectedCells]);

  // セッションIDをチェック
  useEffect(() => {
    console.log("Current session ID:", state.sessionId);
  }, [state.sessionId]);

  const handleValidate = (e) => {
    e.stopPropagation(); // イベント伝播を停止
    console.log("SUBMIT button clicked");
    
    // クリックの視覚的フィードバック
    if (submitButtonRef.current) {
      submitButtonRef.current.classList.add('animate-quick-pulse');
      setTimeout(() => {
        submitButtonRef.current?.classList.remove('animate-quick-pulse');
      }, 300);
    }
    
    if (state.selectedCells.length < 2) {
      console.warn("Cannot validate: Not enough cells selected");
      return;
    }

    if (state.gameOver) {
      console.warn("Cannot validate: Game is over");
      return;
    }

    if (!state.sessionId) {
      console.warn("Cannot validate: No session ID");
      return;
    }

    validateSelection();
  };

  const handleReset = (e) => {
    e.stopPropagation(); // イベント伝播を停止
    console.log("RESET button clicked");
    
    // クリックの視覚的フィードバック
    if (resetButtonRef.current) {
      resetButtonRef.current.classList.add('animate-quick-pulse');
      setTimeout(() => {
        resetButtonRef.current?.classList.remove('animate-quick-pulse');
      }, 300);
    }
    
    if (!state.sessionId) {
      console.warn("Cannot reset: No session ID");
      return;
    }

    if (state.gameOver) {
      console.warn("Cannot reset: Game is over");
      return;
    }

    resetGrid();
  };

  return (
    <div className="flex flex-col items-center mt-2 mb-6 w-full max-w-xs mx-auto relative z-40">
      {/* カード部分は削除し、ボタン部分のみ残す */}
      <div className="flex space-x-4 justify-center relative z-50">
        <motion.button
          ref={submitButtonRef}
          onClick={handleValidate}
          disabled={state.selectedCells.length < 2 || state.gameOver || !state.sessionId}
          className={`border-2 font-pixel uppercase text-base tracking-wider py-5 px-8 relative z-50 rounded-md
            ${state.selectedCells.length < 2 || state.gameOver || !state.sessionId
              ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
              : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black animate-pulse8bit'}`}
          whileHover={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 1.05 } : {}}
          whileTap={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 0.95 } : {}}
          aria-label="選択した単語を確定する"
          data-button="submit"
        >
          {">_ SUBMIT"}
          <span className="block text-[9px] mt-1 opacity-70">[Enter]</span>
        </motion.button>

        <motion.button
          ref={resetButtonRef}
          onClick={handleReset}
          disabled={state.gameOver || !state.sessionId}
          className={`border-2 font-pixel uppercase text-base tracking-wider py-5 px-8 relative z-50 rounded-md
            ${state.gameOver || !state.sessionId
              ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
              : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black'}`}
          whileHover={!state.gameOver && state.sessionId ? { scale: 1.05 } : {}}
          whileTap={!state.gameOver && state.sessionId ? { scale: 0.95 } : {}}
          aria-label="グリッドをリセットする"
          data-button="reset"
        >
          {">_ RESET"}
          <span className="block text-[9px] mt-1 opacity-70">[Esc]</span>
        </motion.button>
      </div>
    </div>
  );
}
