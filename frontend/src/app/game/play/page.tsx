"use client";
import { motion } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";
import { useGameState } from "@/hooks/useGameState";

// ゲームタイトルとボーナス通知を表示するコンポーネント
function GameTitle() {
  const { state } = useGameState();

  // ボーナス獲得時の表示
  if (state.showBonus) {
    return (
      <motion.h1
        className="text-[12px] font-pixel mb-1 text-center text-amber-400 relative z-10 drop-shadow-[0_0_5px_rgba(255,191,0,0.7)]"
        initial={{ scale: 0.9 }}
        animate={{
          scale: [0.9, 1.1, 1],
          y: [0, -3, 0]
        }}
        transition={{ duration: 0.5 }}
      >
        {"/* "} ボーナス獲得！ +{state.bonusMessage.match(/\d+/)?.[0] || ''} {" */"}
      </motion.h1>
    );
  }

  // 通常時はゲームタイトルを表示
  return (
    <h1 className="text-[12px] font-pixel mb-1 text-center text-terminal-green/80 relative z-10 drop-shadow-[0_0_5px_rgba(12,250,0,0.5)]">
      GIGA.P
    </h1>
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
        {/* ゲームタイトル/ボーナス通知 */}
        <GameTitle />

        <GameEngine />
      </GameStateProvider>
    </motion.div>
  );
}
