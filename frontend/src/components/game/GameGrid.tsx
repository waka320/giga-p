import React, { useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { getSelectedWord } from '@/lib/gameLogic';

export default function GameGrid() {
  const { state } = useGameState();
  const { handleCellClick, validateSelection, resetGrid } = useGameControls();
  const gridRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // 選択された単語を取得
  const selectedWord = getSelectedWord(state.grid, state.selectedCells);

  // キーボードナビゲーション用の状態
  const [focusedCell, setFocusedCell] = React.useState<{ row: number, col: number } | null>(null);

  // キーボードサポート
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // グリッドナビゲーション
      if (focusedCell) {
        const { row, col } = focusedCell;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(4, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(4, col + 1);
            break;
          case 'Enter':
          case ' ':
            handleCellClick(row, col);
            return;
        }

        if (newRow !== row || newCol !== col) {
          setFocusedCell({ row: newRow, col: newCol });
          e.preventDefault();
        }
      }

      // キーボードショートカット
      if (e.key === 'Enter' && !e.ctrlKey && !e.altKey &&
        state.selectedCells.length >= 2 && !state.gameOver && state.sessionId) {
        e.preventDefault();
        validateSelection();
        return;
      }

      if (e.key === 'Escape' && !state.gameOver && state.sessionId) {
        e.preventDefault();
        resetGrid();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, handleCellClick, state.selectedCells, state.gameOver, state.sessionId, validateSelection, resetGrid]);

  // フォーカスされたセルにスクロール
  useEffect(() => {
    if (focusedCell && gridRef.current) {
      const cell = gridRef.current.querySelector(`[data-cell="${focusedCell.row}-${focusedCell.col}"]`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedCell]);

  const handleValidate = (e) => {
    e.stopPropagation();
    console.log("SUBMIT button clicked");

    if (submitButtonRef.current) {
      submitButtonRef.current.classList.add('animate-quick-pulse');
      setTimeout(() => {
        submitButtonRef.current?.classList.remove('animate-quick-pulse');
      }, 300);
    }

    if (state.selectedCells.length < 2 || state.gameOver || !state.sessionId) return;
    validateSelection();
  };

  const handleReset = (e) => {
    e.stopPropagation();
    console.log("RESET button clicked");

    if (resetButtonRef.current) {
      resetButtonRef.current.classList.add('animate-quick-pulse');
      setTimeout(() => {
        resetButtonRef.current?.classList.remove('animate-quick-pulse');
      }, 300);
    }

    if (state.gameOver || !state.sessionId) return;
    resetGrid();
  };

  return (
    <div className="relative w-full max-w-xs mx-auto mb-2">
      {/* グリッドコンテナ */}
      <div
        ref={gridRef}
        className="p-4 bg-matrix-dark border-2 border-terminal-green rounded-md shadow-[0_0_15px_rgba(12,250,0,0.4)] relative overflow-hidden scanlines z-30"
        aria-label="IT用語グリッド 5×5"
        role="grid"
      >
        {/* ターミナル風ヘッダー - 単語表示 */}
        <div className="mb-3 text-terminal-green font-mono">
          {/* 改良されたターミナルスタイルのヘッダー */}
          <div className="flex items-center border-b border-terminal-green/30 pb-2">
            <span className="text-terminal-green/90 text-sm mr-2 font-bold">
              &gt; INPUT:
            </span>
            <span className="font-pixel text-xl text-terminal-green tracking-wide overflow-x-auto whitespace-nowrap max-w-full">
              {selectedWord || <span className="animate-blink">█</span>}
            </span>
          </div>

        </div>

        {/* グリッド本体 */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2" role="rowgroup">
          {state.grid.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {row.map((cell, colIdx) => (
                <TooltipProvider key={`${rowIdx}-${colIdx}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        data-cell={`${rowIdx}-${colIdx}`}
                        onClick={() => {
                          handleCellClick(rowIdx, colIdx);
                          setFocusedCell({ row: rowIdx, col: colIdx });
                        }}
                        onFocus={() => setFocusedCell({ row: rowIdx, col: colIdx })}
                        className={cn(
                          "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-pixel rounded-md relative overflow-hidden cursor-pointer transition-all duration-150",
                          "focus:outline-none focus:ring-2 focus:ring-terminal-green focus:ring-opacity-80",
                          "active:scale-95 hover:scale-105",
                          cell ? 'bg-black' : 'bg-gray-900',
                          state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)
                            ? 'text-black bg-terminal-green border-2 border-white shadow-[0_0_10px_rgba(12,250,0,0.7)]'
                            : 'text-terminal-green border border-terminal-green hover:bg-gray-800',
                          focusedCell?.row === rowIdx && focusedCell?.col === colIdx &&
                          'ring-2 ring-terminal-green ring-opacity-80'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ textShadow: cell ? '0 0 5px #0CFA00' : 'none' }}
                        aria-label={`グリッド位置 ${rowIdx}行 ${colIdx}列 文字: ${cell || "空"}`}
                        role="gridcell"
                        aria-selected={state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)}
                        tabIndex={0}
                      >
                        {cell}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent className="font-mono bg-black text-terminal-green border border-terminal-green">
                      <p>Position: [{rowIdx},{colIdx}]</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* フッターエリア - 操作ボタンを移動 */}
        <div className="mt-3 border-t border-terminal-green/30 pt-3">
          {/* ステータス表示 - モバイルでは非表示、sm(640px)以上で表示 */}
          <div className="hidden sm:flex justify-between items-center mb-2 text-[10px] text-terminal-green/50 font-mono">
            <span>
              {state.gameOver ? "TERMINATED" : "ONLINE"}
              <span className="animate-blink ml-1">█</span>
            </span>
            <span>
              {state.selectedCells.length > 0
                ? `[${state.selectedCells.length} cells selected]`
                : "No cells selected"}
            </span>
          </div>

          {/* ボタンエリア - 横幅50%:50%で配置 */}
          <div className="flex flex-row gap-2 w-full">
            {/* 確定ボタン */}
            <motion.button
              ref={submitButtonRef}
              onClick={handleValidate}
              disabled={state.selectedCells.length < 2 || state.gameOver || !state.sessionId}
              className={`text-sm sm:text-xs font-pixel uppercase py-5 sm:py-3 px-2 rounded-md relative z-50 border-2 w-1/2
                flex items-center justify-center
                ${state.selectedCells.length < 2 || state.gameOver || !state.sessionId
                  ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
                  : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black active:bg-terminal-green/80'}`}
              whileHover={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 1.02 } : {}}
              whileTap={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 0.98 } : {}}
              aria-label="選択した単語を確定する"
              data-button="submit"
            >
              <span>決定</span>
              <span className="text-[8px] opacity-70 hidden sm:inline ml-1">[Enter]</span>
            </motion.button>

            {/* リセットボタン */}
            <motion.button
              ref={resetButtonRef}
              onClick={handleReset}
              disabled={state.gameOver || !state.sessionId}
              className={`text-sm sm:text-xs font-pixel uppercase py-5 sm:py-3 px-2 rounded-md relative z-50 border-2 w-1/2
                flex items-center justify-center
                ${state.gameOver || !state.sessionId
                  ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
                  : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black active:bg-terminal-green/80'}`}
              whileHover={!state.gameOver && state.sessionId ? { scale: 1.02 } : {}}
              whileTap={!state.gameOver && state.sessionId ? { scale: 0.98 } : {}}
              aria-label="グリッドをリセットする"
              data-button="reset"
            >
              <span>リセット</span>
              <span className="text-[8px] opacity-70 hidden sm:inline ml-1">[Esc]</span>
            </motion.button>
          </div>
        </div>
      </div>



    </div>
  );
}
