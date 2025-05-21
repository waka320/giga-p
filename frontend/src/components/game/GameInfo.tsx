import { useGameState } from '@/hooks/useGameState';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GameInfo() {
  const { state } = useGameState();
  const [prevScore, setPrevScore] = useState(state.score);
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const [scoreDiff, setScoreDiff] = useState(0);
  const timeRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  // スコアアニメーション強化版（控えめに修正）
  useEffect(() => {
    if (prevScore !== state.score) {
      const difference = state.score - prevScore;
      setScoreDiff(difference);
      setIsScoreAnimating(true);
      setPrevScore(state.score);

      // スコア増加時にスケール効果を追加（コンボ数によって強度調整）
      if (scoreRef.current) {
        // 高コンボ時のみ大きめのアニメーション
        if (state.comboCount >= 4) {
          scoreRef.current.classList.add('score-pulse');
          
          setTimeout(() => {
            scoreRef.current?.classList.remove('score-pulse');
          }, 600);
        } else {
          // 低コンボ時は控えめなアニメーション
          scoreRef.current.classList.add('score-pulse-subtle');
          
          setTimeout(() => {
            scoreRef.current?.classList.remove('score-pulse-subtle');
          }, 500);
        }
      }

      setTimeout(() => {
        setIsScoreAnimating(false);
        setScoreDiff(0);
      }, 900); // 少し短めに
    }
  }, [state.score, prevScore, state.comboCount]);

  // 残り時間に応じてクラスを変更
  const getTimeClass = () => {
    if (state.time <= 10) return "text-red-500 animate-pulse";
    if (state.time <= 30) return "text-yellow-500";
    return "text-terminal-green";
  }

  // コンボ数に応じてクラスを変更
  const getComboClass = () => {
    if (state.comboCount >= 5) return "text-purple-400";
    if (state.comboCount >= 4) return "text-pink-500";
    if (state.comboCount >= 3) return "text-red-500";
    if (state.comboCount >= 2) return "text-yellow-500";
    return "text-terminal-green";
  }

  // 残り時間が少ないときのビジュアルサポート
  useEffect(() => {
    const timeRefElement = timeRef.current;

    // 残り時間が10秒以下で警告表示
    if (state.time <= 10 && timeRefElement) {
      timeRefElement.classList.add('scale-bounce');
      // Safariでのアニメーション問題を修正するためのハック
      timeRefElement.style.transform = 'scale(1)';
    } else if (timeRefElement) {
      timeRefElement.classList.remove('scale-bounce');
    }

    return () => {
      if (timeRefElement) {
        timeRefElement.classList.remove('scale-bounce');
      }
    };
  }, [state.time]);

  // コンボ倍率計算
  const comboMultiplier = Math.min(3, 1 + state.comboCount * 0.25).toFixed(2);

  return (
    <div className="bg-black border border-terminal-green/50 shadow-[0_0_5px_rgba(12,250,0,0.2)] 
                    w-full max-w-xs mx-auto md:max-w-2xl lg:max-w-2.5xl mb-3 rounded-md overflow-hidden scanlines">
      {/* モバイルでは横並び、PCでは縦並びに変更 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 p-3">
        {/* スコア表示 */}
        <div className="relative flex flex-col justify-center items-center">
          <div className="text-xs font-mono text-terminal-green/60">SCORE</div>
          <div 
            ref={scoreRef}
            className={cn(
              "font-pixel text-terminal-green text-lg lg:text-2xl",
              state.comboCount >= 3 && "text-yellow-400",
              state.comboCount >= 4 && "text-pink-500",
              state.comboCount >= 5 && "text-purple-400",
            )}
          >
            {state.score}
          </div>
          
          {/* スコア増加表示 */}
          {isScoreAnimating && scoreDiff > 0 && (
            <motion.div
              className={cn(
                "absolute -top-4 right-0 font-mono text-xs",
                state.comboCount >= 3 ? "text-yellow-400" : "text-terminal-green",
                state.comboCount >= 4 && "text-pink-500",
                state.comboCount >= 5 && "text-purple-400"
              )}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -20,
                scale: [0.8, 1.2, 1]
              }}
              transition={{ duration: 1 }}
            >
              +{scoreDiff}
            </motion.div>
          )}
        </div>

        {/* 時間表示部分 */}
        <div ref={timeRef} className={cn("flex items-center", getTimeClass())}>
          <span className="text-xs opacity-70 mr-1">TIME:</span>
          <span className="font-pixel text-lg">
            {Math.floor(state.time / 60).toString().padStart(2, '0')}:
            {Math.floor(state.time % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center font-mono">
          <span className="opacity-70 hidden lg:inline-block mr-1">$ </span>
          <span className="opacity-60 mr-1">COMBO:</span>
          <span
            className={cn(
              "font-pixel text-sm flex items-baseline",
              state.comboCount > 0 && getComboClass(),
              state.comboCount > 0 && "animate-pulse"
            )}
          >
            {state.comboCount}
            <span className="text-xs ml-1 opacity-80">×{comboMultiplier}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
