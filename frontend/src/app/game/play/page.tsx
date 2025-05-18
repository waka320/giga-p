"use client";
import { motion } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";

export default function GamePlayPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-matrix-dark bg-noise relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* オプションの背景エフェクト - pointer-eventsを追加 */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
      
      {/* スキャンラインエフェクト */}
      <div className="absolute inset-0 scanlines pointer-events-none"></div>
      
      <h1 className="text-3xl font-pixel mb-6 text-center text-terminal-green relative z-10 drop-shadow-[0_0_5px_rgba(12,250,0,0.7)]">
        IT用語パズル
      </h1>
      
      <GameStateProvider>
        <GameEngine />
      </GameStateProvider>
    </motion.div>
  );
}
