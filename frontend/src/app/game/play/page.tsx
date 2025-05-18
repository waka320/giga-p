"use client";
import { motion } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";
import { useGameState } from "@/hooks/useGameState";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


// ボーナスメッセージの安全な抽出
function extractBonusPoints(message: string | undefined): string {
  if (!message) return '';
  const match = message.match(/\d+/);
  return match ? match[0] : '';
}

// ゲームタイトルとボーナス通知を表示するコンポーネント
function GameTitle() {
  const { state } = useGameState();
  const bonusPoints = extractBonusPoints(state.bonusMessage);

  return (
    <div className="h-6 relative flex items-center justify-center">
      {/* ボーナス表示用 */}
      <motion.h1
        className={cn(
          "absolute inset-0 text-[12px] font-pixel text-center text-amber-400 relative z-10 drop-shadow-[0_0_5px_rgba(255,191,0,0.7)] flex items-center justify-center",
          !state.showBonus && "opacity-0"
        )}
        initial={false}
        animate={state.showBonus ? {
          opacity: 1,
          scale: [0.9, 1.1, 1],
          y: [0, -3, 0]
        } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {"/* "} ボーナス獲得！ +{bonusPoints} {" */"}
      </motion.h1>

      {/* 通常タイトル表示用 */}
      <motion.h1
        className={cn(
          "absolute inset-0 text-[12px] font-pixel text-center text-terminal-green/80 relative z-10 drop-shadow-[0_0_5px_rgba(12,250,0,0.5)] flex items-center justify-center",
          state.showBonus && "opacity-0"
        )}
        initial={false}
        animate={!state.showBonus ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        ACRO_ATTACK.
      </motion.h1>
    </div>
  );
}

// 残り時間に応じて背景を変化させるコンポーネント
function TimeSensitiveBackground() {
  const { state } = useGameState();
  const [redBgOpacity, setRedBgOpacity] = useState(0);
  const [yellowBgOpacity, setYellowBgOpacity] = useState(0);

  useEffect(() => {
    if (state.time <= 10) {
      setRedBgOpacity(1);
      setYellowBgOpacity(0);
    } else if (state.time <= 30) {
      setRedBgOpacity(0);
      setYellowBgOpacity(1);
    } else {
      setRedBgOpacity(0);
      setYellowBgOpacity(0);
    }
  }, [state.time]);

  return (
    <>
      {/* 危険時の赤背景 */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none bg-red-950/10 animate-pulse-slow"
        initial={{ opacity: 0 }}
        animate={{ opacity: redBgOpacity }}
        transition={{ duration: 0.5 }}
      />

      {/* 警告時の黄色背景 */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none bg-yellow-950/10 animate-pulse-slow"
        initial={{ opacity: 0 }}
        animate={{ opacity: yellowBgOpacity }}
        transition={{ duration: 0.5 }}
      />
    </>
  );
}

export default function GamePlayPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen p-4 pb-16 bg-matrix-dark bg-noise relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景エフェクト - pointer-eventsをnoneに */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

      {/* スキャンラインエフェクト */}
      <div className="absolute inset-0 scanlines pointer-events-none"></div>

      <GameStateProvider>
        {/* 時間依存の背景エフェクト */}
        <TimeSensitiveBackground />

        {/* ゲームタイトル/ボーナス通知 */}
        <GameTitle />

        <GameEngine />
      </GameStateProvider>
    </motion.div>
  );
}
