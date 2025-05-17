import { useGameState } from '@/hooks/useGameState';

export default function GameInfo() {
  const { state } = useGameState();

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-6 w-full max-w-md">
      <div className="text-center">
        <div className="text-sm text-gray-500">スコア</div>
        <div className="text-2xl font-bold text-blue-600">{state.score}</div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-gray-500">残り時間</div>
        <div className="text-2xl font-bold text-red-500">{state.time}秒</div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-gray-500">コンボ</div>
        <div className="text-2xl font-bold text-green-500">×{Math.min(3, 1 + state.comboCount * 0.25).toFixed(2)}</div>
      </div>
    </div>
  );
}