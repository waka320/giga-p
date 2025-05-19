import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const glitchMessages = [
  "FATAL_ERROR::PROCESS_TERMINATED",
  "MEMORY_CORRUPTION_DETECTED",
  "SYSTEM_FAILURE::0x0000FF36",
  "UNEXPECTED_SESSION_TERMINATION",
  "CRITICAL_PROCESS_DIED",
  "KERNEL_DATA_INPAGE_ERROR"
];

interface GameCrashEffectProps {
  score: number;
  onAnimationComplete?: () => void;
}

export default function GameCrashEffect({ score, onAnimationComplete }: GameCrashEffectProps) {
  const [stage, setStage] = useState(0);
  const [glitchMsg, setGlitchMsg] = useState('');
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // ランダムなエラーメッセージを選択
    setGlitchMsg(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);

    // 段階的にエフェクトを増やすタイマー
    const timeline = [
      { stage: 1, delay: 300 },   // 小さなグリッチスタート
      { stage: 2, delay: 800 },   // 中程度のグリッチ
      { stage: 3, delay: 1300 },  // 激しいグリッチ
      { stage: 4, delay: 1800 },  // ブルースクリーン風表示
      { stage: 5, delay: 3500 }   // リザルト画面へ遷移
    ];

    // 各ステージの処理
    timeline.forEach(({ stage: nextStage, delay }) => {
      setTimeout(() => {
        setStage(nextStage);
        if (nextStage === 1) setGlitchIntensity(0.2);
        if (nextStage === 2) setGlitchIntensity(0.6);
        if (nextStage === 3) setGlitchIntensity(1);
        
        // 最終ステージでリザルト画面へ遷移
        if (nextStage === 5) {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          router.push('/game/results');
        }
      }, delay);
    });

    // クリーンアップ関数
    return () => {
      timeline.forEach(({ delay }) => clearTimeout(delay));
    };
  }, [router, onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* グリッチエフェクトの背景レイヤー */}
      <motion.div
        className="absolute inset-0 bg-black opacity-0"
        animate={{ opacity: glitchIntensity * 0.7 }}
        transition={{ duration: 0.3 }}
      />

      {/* 画面の揺れとグリッチエフェクト */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ 
          x: stage >= 2 ? [0, -5, 7, -3, 0, 5, -2, 0] : 0,
          y: stage >= 2 ? [0, 3, -5, 2, -1, 0, 3, 0] : 0
        }}
        transition={{ 
          repeat: stage >= 2 ? Infinity : 0, 
          duration: 0.5, 
          repeatType: "loop" 
        }}
      >
        {/* グリッチラインエフェクト */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute left-0 right-0 h-[2px] bg-cyan-500/30",
              stage >= 2 && "bg-cyan-500/60",
              stage >= 3 && "bg-cyan-400/90"
            )}
            style={{ 
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * -50}%`,
              right: `${Math.random() * -50}%`,
              height: `${1 + Math.random() * 3}px`
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: stage >= 1 ? [0, 0.8, 0] : 0,
              scaleX: stage >= 1 ? [0, 1, 0] : 0,
              x: stage >= 1 ? [0, Math.random() * 100 - 50, 0] : 0
            }}
            transition={{ 
              repeat: stage >= 1 ? Infinity : 0, 
              duration: 0.2 + Math.random() * 0.5,
              delay: Math.random() * 0.2,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      {/* メインコンテンツエリア */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* 初期段階：小さなグリッチ */}
        {stage >= 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage < 4 ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-terminal-green font-mono"
              animate={{ 
                x: [0, -1, 2, -3, 0, 1, 0],
                opacity: [1, 0.8, 1, 0.9, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.2 }}
            >
              処理中...
            </motion.div>
          </motion.div>
        )}

        {/* ステージ2以降：エラーメッセージの表示 */}
        {stage >= 2 && (
          <motion.div
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: stage < 4 ? [0, 1, 0.7, 1, 0.9] : 0, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-red-500 font-mono text-sm">
              ERROR: {glitchMsg}
            </div>
          </motion.div>
        )}

        {/* ステージ3：セッション情報のグリッチ表示 */}
        {stage >= 3 && (
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage < 4 ? [0, 0.7, 1, 0.8] : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-mono text-xs text-terminal-green/80 space-y-1">
              <motion.div 
                animate={{ x: [0, 2, -1, 0] }}
                transition={{ repeat: Infinity, duration: 0.2 }}
              >
                Session_ID: {Math.random().toString(36).substring(2, 15)}
              </motion.div>
              <motion.div
                animate={{ x: [0, -2, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.3, delay: 0.1 }}
              >
                Time: 0x00000000
              </motion.div>
              <motion.div
                animate={{ x: [0, 1, -2, 0] }}
                transition={{ repeat: Infinity, duration: 0.25, delay: 0.05 }}
              >
                Score: {score.toString(16).toUpperCase().padStart(8, '0')}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ステージ4：ブルースクリーン風画面 */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center p-8 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full max-w-2xl font-mono text-white">
                <h2 className="text-2xl mb-4">:(</h2>
                <h1 className="text-xl mb-6">
                  ACRO_ATTACK.exe has been terminated
                </h1>
                <p className="mb-4">
                  ゲームセッションが予期せず終了しました。
                </p>
                <div className="mb-6 text-sm">
                  <p>エラーコード: 0xACR0_ATTACK_COMPLETE</p>
                  <p>セッション終了理由: TIME_LIMIT_REACHED</p>
                  <p className="mt-2">最終スコア: {score}</p>
                </div>
                <div className="p-4 bg-blue-800/50 mt-4">
                  <p className="mb-2">情報を収集しています...</p>
                  <div className="w-full bg-blue-700/50 h-2 mt-2">
                    <motion.div
                      className="h-2 bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                  <p className="mt-3 text-sm">リザルト画面に移動しています...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}