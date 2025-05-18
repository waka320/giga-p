import { useGameState } from '@/hooks/useGameState';
import { useGameControls } from '@/hooks/useGameControls';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSelectedWord } from '@/lib/gameLogic';
import { useEffect } from 'react';

export default function Controls() {
  const { state } = useGameState();
  const { validateSelection, resetGrid } = useGameControls();

  const selectedWord = getSelectedWord(state.grid, state.selectedCells);

  // デバッグ用：状態変更を確認
  useEffect(() => {
    console.log("Controls: selectedCells updated", state.selectedCells);
  }, [state.selectedCells]);

  // セッションIDをチェック
  useEffect(() => {
    console.log("Current session ID:", state.sessionId);
  }, [state.sessionId]);

  // デバッグ用のラッパー関数
  const handleValidate = (e) => {
    e.stopPropagation(); // イベント伝播を停止
    console.log("SUBMIT button clicked");
    console.log("Session ID:", state.sessionId);
    console.log("Selected cells:", state.selectedCells);
    console.log("Game over state:", state.gameOver);

    // 早期リターンの条件をチェック
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
    console.log("Session ID:", state.sessionId);
    console.log("Game over state:", state.gameOver);

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
    <div className="flex flex-col items-center mt-6 mb-8 w-full max-w-md relative z-20">
      <Card className="bg-black border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.3)] w-full mb-4 scanlines">
        <CardContent className="p-4">
          <div className="flex items-center">
            <span className="text-terminal-green/70 font-mono text-sm mr-2">
              &gt; INPUT:
            </span>
            <span className="font-pixel text-xl text-terminal-green tracking-wide">
              {selectedWord || <span className="animate-blink">█</span>}
            </span>
          </div>

          <div className="mt-1 text-[10px] font-mono text-terminal-green/50">
            {state.selectedCells.length > 0
              ? `[${state.selectedCells.length} cells selected]`
              : "No cells selected"}
          </div>

          {/* デバッグ情報を追加 */}
          <div className="mt-1 text-[8px] font-mono text-yellow-500/70">
            選択状態: {JSON.stringify(state.selectedCells)}
          </div>

          {/* セッションIDのデバッグ表示を追加 */}
          <div className="mt-1 text-[8px] font-mono text-blue-500/70">
            Session ID: {state.sessionId || "未設定"}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4 justify-center relative z-50">  {/* z-indexを追加 */}
        <Button
          variant="outline"
          onClick={handleValidate}
          disabled={state.selectedCells.length < 2 || state.gameOver}
          className={`border-2 font-pixel uppercase text-sm tracking-wider py-6 px-8 relative z-50
            ${state.selectedCells.length < 2 || state.gameOver
              ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed'
              : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black animate-pulse8bit'}`}
        >
          {">_ SUBMIT"}
        </Button>

        <Button
          variant="outline"
          onClick={handleReset}
          disabled={state.gameOver}
          className={`border-2 font-pixel uppercase text-sm tracking-wider py-6 px-8 relative z-50
            ${state.gameOver
              ? 'border-gray-600 text-gray-600 bg-gray-900/50 cursor-not-allowed'
              : 'border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black'}`}
        >
          {">_ RESET"}
        </Button>
      </div>
    </div>
  );
}
