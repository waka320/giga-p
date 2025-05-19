import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";

export default function GameStartCountdown() {
  const { state, setState, initializeGame } = useGameState();
  const [count, setCount] = useState(3);
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    // カウントダウン開始
    if (state.gamePhase !== 'countdown') return;

    const countdownTimer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setShowStart(true);
          
          // "START!"表示後にゲーム開始
          setTimeout(() => {
            initializeGame();
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [state.gamePhase, initializeGame]);

  if (state.gamePhase !== 'countdown') return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={`count-${count}`}
            className="text-8xl font-pixel text-terminal-green"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {count}
          </motion.div>
        ) : showStart ? (
          <motion.div
            key="start"
            className="text-6xl font-pixel text-amber-400"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            START!
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}