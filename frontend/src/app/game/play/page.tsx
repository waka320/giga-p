"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GameStateProvider } from "@/hooks/useGameState";
import GameEngine from "@/components/game/GameEngine";
import GameStartCountdown from "@/components/game/GameStartCountdown";
import { useGameState } from "@/hooks/useGameState";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import GameSynchronizer from "@/components/game/GameSynchronizer";
import BackgroundController from "@/components/game/BackgroundController";
import { Home, Settings, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// ゲーム初期化画面コンポーネント
function GameInitScreen() {
  const { state, startGame } = useGameState();

  // useEffect内でゲーム開始を自動的に呼び出し
  useEffect(() => {
    if (state.gamePhase === 'init') {
      const timer = setTimeout(() => {
        startGame(); // プリロードも開始する新しいstartGame関数を呼び出し
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.gamePhase, startGame]);

  if (state.gamePhase !== 'init') return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-terminal-green font-pixel text-2xl"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        INITIALIZING SYSTEM
      </motion.div>
      <div className="mt-4 flex space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-terminal-green rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ゲーム中のナビゲーションUI
function GameNavigation() {
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useGameState();
  const router = useRouter();

  // ゲームフェーズが進行中の場合のみ表示
  if (state.gamePhase !== 'playing') return null;

  return (
    <>
      {/* 設定ボタン - 常に右上に表示 */}
      <div className="fixed top-2 right-2 z-30">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-6 h-6 bg-black/40 hover:bg-black/60 border border-terminal-green/40 rounded-full flex items-center justify-center text-terminal-green/80 hover:text-terminal-green transition-all"
          aria-label={showSettings ? "設定パネルを閉じる" : "設定を開く"}
        >
          {showSettings ? <X size={12} /> : <Settings size={12} />}
        </button>
      </div>

      {/* 設定パネル - トグルで表示/非表示 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed top-10 right-2 z-30 bg-black/80 border border-terminal-green/40 rounded p-2 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2 text-xs">
              <Link
                href="/game/start"
                className="flex items-center gap-1.5 py-1 px-2 text-terminal-green/70 hover:bg-terminal-green/20 hover:text-terminal-green rounded transition-colors"
                onClick={(e) => {
                  if (state.score > 0) {
                    if (!confirm("ゲームを中断してタイトルに戻りますか？\n現在のスコアは失われます。")) {
                      e.preventDefault();
                    }
                  }
                }}
              >
                <Home size={12} />
                タイトルに戻る
              </Link>
              <hr className="border-terminal-green/20 my-1" />
              <button
                className="flex items-center gap-1.5 py-1 px-2 text-terminal-green/70 hover:bg-terminal-green/20 hover:text-terminal-green rounded transition-colors text-left"
                onClick={() => {
                  if (confirm("ゲームをリロードしますか？\n現在のスコアは失われます。")) {
                    router.refresh();
                  }
                }}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8v0z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                リロード
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GamePlayPage() {
  useEffect(() => {
    // スクロール禁止クラスを追加
    document.body.classList.add('no-scrolling');

    return () => {
      // クリーンアップ時にクラスを削除
      document.body.classList.remove('no-scrolling');
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen p-4 pb-16 bg-zinc-900 relative overflow-hidden game-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 scanlines pointer-events-none"></div>

      <GameStateProvider>
        <BackgroundController />
        <GameSynchronizer />
        <GameNavigation /> {/* 追加したナビゲーションコンポーネント */}
        <GameStartCountdown />
        <TimeSensitiveBackground />
        <GameTitle />
        <GameInitScreen />
        <GameEngine />
      </GameStateProvider>
    </motion.div>
  );
}
