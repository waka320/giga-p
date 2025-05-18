"use client";
import { motion } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";

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
      
      {/* ゲームタイトル - 優先度が低いのでサイズを小さく */}
      <h1 className="text-[12px] font-pixel mb-1 text-center text-terminal-green/80 relative z-10 drop-shadow-[0_0_5px_rgba(12,250,0,0.5)]">
        GIGA.P
      </h1>
      
      <GameStateProvider>
        <GameEngine />
      </GameStateProvider>
      
      {/* キーボードショートカットヘルプ - 画面下部に小さく表示 */}
      <div className="fixed bottom-2 left-0 right-0 text-center text-terminal-green/50 text-xs font-mono">
        [Enter] Submit • [Esc] Reset • [矢印キー] グリッド移動
      </div>
    </motion.div>
  );
}
