import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GameGrid() {
  const { state } = useGameState();
  const { handleCellClick } = useGameControls();

  return (
    <div className="relative">
      {/* グリッドコンテナにピクセル風境界線と背景を追加 */}
      <div className="p-4 bg-matrix-dark border-2 border-terminal-green rounded-md shadow-[0_0_10px_rgba(12,250,0,0.3)] relative overflow-hidden scanlines">
        {/* ターミナル風のヘッダー */}
        <div className="flex justify-between items-center mb-2 text-terminal-green font-mono text-xs">
          <span>GRID:// 5x5</span>
          <span className="animate-blink">█</span>
          <span>{state.gameOver ? "TERMINATED" : "ONLINE"}</span>
        </div>
        
        {/* グリッド本体 */}
        <div className="grid grid-cols-5 gap-1">
          {state.grid.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {row.map((cell, colIdx) => (
                <TooltipProvider key={`${rowIdx}-${colIdx}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        className={cn(
                          "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-lg font-pixel rounded-[2px] relative overflow-hidden cursor-pointer transition-colors",
                          cell ? 'bg-black' : 'bg-gray-900', 
                          state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)
                            ? 'text-black bg-terminal-green border border-white' 
                            : 'text-terminal-green border border-terminal-green hover:bg-gray-800'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ textShadow: cell ? '0 0 5px #0CFA00' : 'none' }}
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