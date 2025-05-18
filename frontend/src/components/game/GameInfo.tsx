import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GameInfo() {
  const { state } = useGameState();

  // 残り時間に応じてクラスを変更
  const getTimeClass = () => {
    if (state.time <= 10) return "text-red-500 animate-pulse";
    if (state.time <= 30) return "text-yellow-500";
    return "text-terminal-green";
  }

  return (
    <Card className="bg-black border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.3)] w-full max-w-md mb-6 scanlines overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          {/* タイトルバー風 */}
          <div className="w-full font-mono text-xs mb-2 text-terminal-green">
            <span className="mr-2">./game_status</span>
            <span className="opacity-50">v1.0.0</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {/* スコア表示 */}
          <div className="text-center p-2 border border-terminal-green/30 rounded-sm">
            <div className="text-xs text-terminal-green/70 font-mono uppercase">SCORE</div>
            <div className="text-xl font-pixel text-terminal-green">{state.score}</div>
          </div>
          
          {/* タイマー表示 */}
          <div className="text-center p-2 border border-terminal-green/30 rounded-sm">
            <div className="text-xs text-terminal-green/70 font-mono uppercase">TIME</div>
            <div className={`text-xl font-pixel ${getTimeClass()}`}>{state.time}</div>
          </div>
          
          {/* コンボ表示 */}
          <div className="text-center p-2 border border-terminal-green/30 rounded-sm">
            <div className="text-xs text-terminal-green/70 font-mono uppercase">COMBO</div>
            <div className="flex justify-center items-center">
              <Badge variant="outline" className="font-pixel text-xl bg-transparent border-terminal-green text-terminal-green">
                ×{Math.min(3, 1 + state.comboCount * 0.25).toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-[8px] font-mono text-terminal-green/50 text-right">
          session_id: {state.sessionId ? state.sessionId.substring(0, 8) : "null"}
        </div>
      </CardContent>
    </Card>
  );
}