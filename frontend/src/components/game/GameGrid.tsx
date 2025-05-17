import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';

export default function GameGrid() {
  const { state } = useGameState();
  const { handleCellClick } = useGameControls();

  return (
    <div className="grid grid-cols-5 gap-1">
      {state.grid.map((row, rowIdx) => (
        <React.Fragment key={rowIdx}>
          {row.map((cell, colIdx) => (
            <div 
              key={`${rowIdx}-${colIdx}`} 
              className={`w-14 h-14 flex items-center justify-center text-xl font-bold rounded-md cursor-pointer transition-colors
                ${cell ? 'bg-white shadow-sm' : 'bg-gray-100'} 
                ${state.selectedCells.some(s => s.row === rowIdx && s.col === colIdx) 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-800 hover:bg-blue-100'}`}
              onClick={() => handleCellClick(rowIdx, colIdx)}
            >
              {cell}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}