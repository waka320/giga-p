import React, { useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { getSelectedWord } from '@/lib/gameLogic';

export default function GameGrid() {
  const { state } = useGameState();
  const { handleCellClick } = useGameControls();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // 選択された単語を取得
  const selectedWord = getSelectedWord(state.grid, state.selectedCells);
  
  // キーボードナビゲーション用の状態
  const [focusedCell, setFocusedCell] = React.useState<{row: number, col: number} | null>(null);

  // キーボードサポート
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return;
      
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
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, handleCellClick]);
  
  // フォーカスされたセルにスクロール
  useEffect(() => {
    if (focusedCell && gridRef.current) {
      const cell = gridRef.current.querySelector(`[data-cell="${focusedCell.row}-${focusedCell.col}"]`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedCell]);

  return (
    <div className="relative w-full max-w-xs mx-auto mb-6">
      {/* グリッドコンテナのスタイルを強化 */}
      <div 
        ref={gridRef}
        className="p-4 bg-matrix-dark border-2 border-terminal-green rounded-md shadow-[0_0_15px_rgba(12,250,0,0.4)] relative overflow-hidden scanlines z-30"
        aria-label="IT用語グリッド 5×5"
        role="grid"
      >
        {/* 拡張されたターミナル風ヘッダー - 単語表示を統合 */}
        <div className="mb-3 text-terminal-green font-mono">
          {/* 上部ステータスバー */}
          <div className="flex justify-between items-center mb-2 text-xs">
            <span>GRID:// 5x5</span>
            <span className="animate-blink">█</span>
            <span>{state.gameOver ? "TERMINATED" : "ONLINE"}</span>
          </div>
          
          {/* 単語入力表示部分 - Controls.tsxから移動 */}
          <div className="flex items-center border-t border-b border-terminal-green/30 py-2">
            <span className="text-terminal-green/70 text-sm mr-2">
              &gt; INPUT:
            </span>
            <span className="font-pixel text-xl text-terminal-green tracking-wide overflow-x-auto whitespace-nowrap max-w-full">
              {selectedWord || <span className="animate-blink">█</span>}
            </span>
          </div>
          
          {/* 選択セル数の表示 - Controls.tsxから移動 */}
          <div className="text-[10px] text-terminal-green/50 mt-1">
            {state.selectedCells.length > 0
              ? `[${state.selectedCells.length} cells selected]`
              : "No cells selected"}
          </div>
        </div>
        
        {/* グリッド本体 - 変更なし */}
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
        
        {/* 装飾的なコード行コメント */}
        <div className="mt-2 font-mono text-[10px] text-terminal-green opacity-50">
          <div>{"/* FINDING IT TERMS IN PROGRESS */"}</div>
          <div>{"/* SELECT CELLS TO FORM VALID IT TERMS */"}</div>
        </div>
      </div>
    </div>
  );
}