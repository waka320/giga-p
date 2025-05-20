import { useGameState } from '@/hooks/useGameState';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GameInfo() {
  const { state } = useGameState();
  const [prevScore, setPrevScore] = useState(state.score);
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);

  // スコアアニメーション
  useEffect(() => {
    if (prevScore !== state.score) {
      setIsScoreAnimating(true);
      setPrevScore(state.score);

      setTimeout(() => {
        setIsScoreAnimating(false);
      }, 1000);
    }
  }, [state.score, prevScore]);

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
      <div className="flex flex-row lg:flex-col justify-between items-center lg:items-start p-2 lg:p-3 text-terminal-green text-xs font-mono">
        <div className="flex items-center space-x-2 lg:mb-3">
          <span className="opacity-70 lg:hidden">$</span>
          <span className="opacity-70 hidden lg:inline-block mr-1">$ </span>
          <AnimatePresence>
            <motion.span
              key={state.score}
              initial={{ scale: 1 }}
              animate={{ scale: isScoreAnimating ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="font-pixel"
              aria-live="polite"
            >
              <span className="opacity-60">SCORE:</span> <span className="text-sm">{state.score}</span>
            </motion.span>
          </AnimatePresence>
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
