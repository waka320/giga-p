"use client";
import { motion } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";

export default function GamePlayPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">IT用語パズル</h1>
      
      <GameStateProvider>
        <GameEngine />
      </GameStateProvider>
    </motion.div>
  );
}
