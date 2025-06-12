import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { getSelectedWord } from '@/lib/gameLogic';

// タイマースタイルのプロパティを型定義
type TimeStyleProps = {
  borderClass: string;
  backgroundClass: string;
  animationClass: string;
};

export default function GameGrid({ timeStyle }: { timeStyle?: TimeStyleProps }) {
  const { state, setState } = useGameState();
  const { handleCellClick, validateSelection, resetGrid } = useGameControls();
  const gridRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // タイマースタイルが渡されていない場合のデフォルト値
  const defaultTimeStyle = {
    borderClass: "border-terminal-green",
    backgroundClass: "",
    animationClass: ""
  };

  // タイマースタイルを適用（プロップスまたはデフォルト）
  const appliedTimeStyle = timeStyle || defaultTimeStyle;

  // 選択された単語を取得
  const selectedWord = getSelectedWord(state.grid, state.selectedCells);

  // キーボードナビゲーション用の状態
  const [focusedCell, setFocusedCell] = React.useState<{ row: number, col: number } | null>(null);

  // 状態を追加
  const [lastTypedKey, setLastTypedKey] = useState<string | null>(null);
  const [invalidKey, setInvalidKey] = useState<string | null>(null);

  // アルファベットに一致するセルを見つける関数をuseCallbackでメモ化
  const findCellWithLetter = useCallback((letter: string): { row: number, col: number } | null => {
    // 既に選択済みのセルの位置をマップ化
    const selectedPositions = new Set(
      state.selectedCells.map(cell => `${cell.row}-${cell.col}`)
    );

    // まず未選択のセルで一致するものを探す
    for (let row = 0; row < state.grid.length; row++) {
      for (let col = 0; col < state.grid[row].length; col++) {
        const cellValue = state.grid[row][col];
        if (cellValue === letter && !selectedPositions.has(`${row}-${col}`)) {
          return { row, col };
        }
      }
    }

    // 未選択のセルで見つからなかった場合はどのセルでも一致するものを返す
    for (let row = 0; row < state.grid.length; row++) {
      for (let col = 0; col < state.grid[row].length; col++) {
        if (state.grid[row][col] === letter) {
          return { row, col };
        }
      }
    }

    return null;
  }, [state.grid, state.selectedCells]);

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
          case ' ': // スペースキーの場合
          case 'Enter': // Enterキーの場合も同様に処理
            // スペースキーまたはEnterキーの場合は単語確定処理を行う
            if (state.selectedCells.length >= 2 && !state.gameOver && state.sessionId) {
              e.preventDefault();
              validateSelection();
              return;
            } else {
              // 選択が不十分な場合はセル選択
              handleCellClick(row, col);
            }
            return;
        }

        if (newRow !== row || newCol !== col) {
          setFocusedCell({ row: newRow, col: newCol });
          e.preventDefault();
        }
      }

      // キーボードショートカット
      // Escapeキーでリセット
      if (e.key === 'Escape' && !state.gameOver && state.sessionId) {
        e.preventDefault();
        resetGrid();
        return;
      }

      // スペースキーおよびEnterキーで決定
      if ((e.key === ' ' || e.key === 'Enter') && !e.ctrlKey && !e.altKey &&
        state.selectedCells.length >= 2 && !state.gameOver && state.sessionId) {
        e.preventDefault();
        validateSelection();
        return;
      }

      // バックスペースキーの処理を追加
      if ((e.key === 'Backspace' || e.key === 'Delete') &&
        !state.gameOver && state.sessionId) {
        e.preventDefault();

        if (state.selectedCells.length > 0) {
          // 最後の選択を削除
          setState(prev => ({
            ...prev,
            selectedCells: prev.selectedCells.slice(0, -1)
          }));
        }
        return;
      }

      // アルファベットキー入力の処理を追加
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && !state.gameOver && state.sessionId) {
        const foundCell = findCellWithLetter(key);
        if (foundCell) {
          setLastTypedKey(key);
          setTimeout(() => setLastTypedKey(null), 500);
          e.preventDefault();
          handleCellClick(foundCell.row, foundCell.col);
          setFocusedCell({ row: foundCell.row, col: foundCell.col });
        } else {
          // グリッドに存在しない文字が入力された場合
          setInvalidKey(key);
          setTimeout(() => setInvalidKey(null), 800);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedCell, 
    handleCellClick, 
    state.selectedCells, 
    state.gameOver, 
    state.sessionId, 
    validateSelection, 
    resetGrid,
    findCellWithLetter, // 追加
    setState // 追加
  ]);

  // フォーカスされたセルにスクロール
  useEffect(() => {
    if (focusedCell && gridRef.current) {
      const cell = gridRef.current.querySelector(`[data-cell="${focusedCell.row}-${focusedCell.col}"]`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedCell]);

  const handleValidate = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-2">
      {/* グリッドコンテナ */}
      <div
        ref={gridRef}
        className={cn(
          "p-2 sm:p-4 bg-black rounded-md relative overflow-hidden scanlines z-30 transition-all duration-300 border-0",
          appliedTimeStyle.animationClass
        )}
        aria-label="IT用語グリッド 5×5"
        role="grid"
      >
        {/* ターミナル風ヘッダー - 単語表示 */}
        <div className="mb-1 sm:mb-3 text-terminal-green font-mono">
          <div className={cn(
            "flex items-center border-b pb-1 sm:pb-2",
            appliedTimeStyle.borderClass.replace('border-', 'border-b-')
          )}>
            <span className="text-terminal-green/90 text-xs sm:text-sm md:text-base lg:text-lg mr-1 sm:mr-2 font-bold">
              &gt; INPUT:
            </span>
            <span className="font-pixel text-base sm:text-xl md:text-2xl lg:text-3xl text-terminal-green tracking-wide overflow-x-auto whitespace-nowrap max-w-full">
              {selectedWord + "█" || <span className="animate-blink">█</span>}
            </span>
          </div>
        </div>

        {/* UIに無効キーのフィードバックを追加 */}
        {invalidKey && (
          <div className="absolute top-2 right-2 text-sm text-red-500 bg-black/80 px-2 py-1 rounded font-mono z-50">
            「{invalidKey}」はグリッドにありません
          </div>
        )}

        {/* グリッド本体 */}
        <div 
          className="grid grid-cols-5 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 game-grid" 
          role="rowgroup"
        >
          {state.grid.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {row.map((cell, colIdx) => (
                <TooltipProvider key={`${rowIdx}-${colIdx}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        onTouchEnd={(e) => {
                          // タッチイベント上での判定ずれ防止
                          e.preventDefault();
                          handleCellClick(rowIdx, colIdx);
                        }}
                        data-cell={`${rowIdx}-${colIdx}`}
                        className={cn(
                          // ベースクラス - サイズを大きく調整
                          "relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
                          "text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-pixel",
                          "transition-all duration-150 ease-in-out transform",
                          "focus:outline-none focus:ring-2 focus:ring-terminal-green focus:ring-opacity-80",
                          "active:scale-95 hover:scale-105",
                          cell ? 'bg-black' : 'bg-gray-900',
                          state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)
                            ? 'text-black bg-terminal-green border-2 border-white shadow-[0_0_10px_rgba(12,250,0,0.7)]'
                            : `text-terminal-green border ${appliedTimeStyle.borderClass.replace('border-', '')} hover:bg-gray-800`,
                          focusedCell?.row === rowIdx && focusedCell?.col === colIdx &&
                          'ring-2 ring-terminal-green ring-opacity-80',
                          // キー入力されたアルファベットと一致する場合のクラス
                          lastTypedKey === cell && 'key-feedback'
                        )}
                        // タッチターゲットを拡大するための内部パディング
                        style={{
                          padding: '0.25rem',
                          textShadow: cell ? '0 0 5px #0CFA00' : 'none'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`グリッド位置 ${rowIdx}行 ${colIdx}列 文字: ${cell || "空"}`}
                        role="gridcell"
                        aria-selected={state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)}
                        tabIndex={0}
                      >
                        {cell}
                      </motion.button>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* フッターエリア - 操作ボタンを移動 */}
        <div className={cn(
          "mt-1 sm:mt-3 border-t pt-1 sm:pt-3",
          appliedTimeStyle.borderClass.replace('border-', 'border-t-')
        )}>
          {/* ステータス表示 - モバイルでは非表示、sm(640px)以上で表示 */}
          <div className="hidden sm:flex justify-between items-center mb-2 text-[10px] sm:text-xs md:text-sm text-terminal-green/50 font-mono">
            <span>
              {state.gameOver ? "TERMINATED" : "ONLINE"}
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
              className={cn(
                "text-xs sm:text-sm md:text-base lg:text-lg font-pixel uppercase py-2 sm:py-3 md:py-5 px-1 sm:px-2 rounded-md relative z-50 border-2 w-1/2 flex items-center justify-center",
                state.selectedCells.length < 2 || state.gameOver || !state.sessionId
                  ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
                  : `${appliedTimeStyle.borderClass} text-terminal-green bg-black hover:bg-terminal-green hover:text-black active:bg-terminal-green/80`
              )}
              whileHover={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 1.02 } : {}}
              whileTap={state.selectedCells.length >= 2 && !state.gameOver && state.sessionId ? { scale: 0.98 } : {}}
              aria-label="選択した単語を確定する"
              data-button="submit"
            >
              <span>{">_"}決定</span>
              <span className="text-[8px] sm:text-[10px] md:text-xs opacity-70 hidden sm:inline ml-1">[Space/Enter]</span>
            </motion.button>

            {/* リセットボタン */}
            <motion.button
              ref={resetButtonRef}
              onClick={handleReset}
              disabled={state.gameOver || !state.sessionId}
              className={cn(
                "text-xs sm:text-sm md:text-base lg:text-lg font-pixel uppercase py-2 sm:py-3 md:py-5 px-1 sm:px-2 rounded-md relative z-50 border-2 w-1/2 flex items-center justify-center",
                state.gameOver || !state.sessionId
                  ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed opacity-70'
                  : `${appliedTimeStyle.borderClass} text-terminal-green bg-black hover:bg-terminal-green hover:text-black active:bg-terminal-green/80`
              )}
              whileHover={!state.gameOver && state.sessionId ? { scale: 1.02 } : {}}
              whileTap={!state.gameOver && state.sessionId ? { scale: 0.98 } : {}}
              aria-label="グリッドをリセットする"
              data-button="reset"
            >
              <span>{">_"}リセット</span>
              <span className="text-[8px] sm:text-[10px] md:text-xs opacity-70 hidden sm:inline ml-1">[Esc]</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
