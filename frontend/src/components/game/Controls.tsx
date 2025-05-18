import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { getSelectedWord } from '@/lib/gameLogic';

export default function Controls() {
  const { state } = useGameState();
  const { validateSelection, resetGrid } = useGameControls();
  
  const selectedWord = getSelectedWord(state.grid, state.selectedCells);

  return (
    <div className="flex flex-col items-center mt-6 mb-8">
      <div className="bg-white p-3 rounded-md shadow-sm text-lg text-center w-full max-w-md mb-4">
        <span className="text-gray-500">選択中: </span>
        <span className="font-bold text-blue-800">{selectedWord}</span>
      </div>
      
      <div className="flex space-x-4 justify-center">
        <button 
          onClick={validateSelection}
          disabled={state.selectedCells.length < 2}
          className={`px-6 py-3 rounded-md shadow-md font-bold transition-colors ${
            state.selectedCells.length < 2 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          決定
        </button>
        
        <button 
          onClick={resetGrid}
          className="px-6 py-3 rounded-md shadow-md font-bold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          リセット
        </button>
      </div>
      
      {state.showBonus && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg shadow-lg z-50
                      text-xl font-bold text-yellow-800 animate-bounce">
          {state.bonusMessage}
        </div>
      )}
    </div>
  );
}