import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";

// 起動シーケンス用のテキストライン（短縮版）
const bootSequence = [
    { text: "C:\\>SYSTEM BOOT", delay: 300 },
    { text: "C:\\>INITIALIZING KERNEL...", delay: 700 },
    { text: "C:\\>LOADING ACRO_ATTACK.exe...", delay: 1200 },
    { text: "C:\\>GENERATING GRID...", delay: 1600, showGrid: true },
    { text: "C:\\>COUNTDOWN INITIATED", delay: 2000, countdown: true },
];

// タイピングアニメーション用コンポーネント
const TypedLine = ({
    text,
    delay = 0,
    isLast = false,
    highlight = false,
    showGrid = false,
    isPreloading = false,
    onComplete
}: {
    text: string;
    delay?: number;
    isLast?: boolean;
    highlight?: boolean;
    showGrid?: boolean;
    isPreloading?: boolean;
    onComplete?: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [textComplete, setTextComplete] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // 指定された遅延後にタイピングアニメーションを開始
        timeout = setTimeout(() => {
            let currentIndex = 0;
            const typingSpeed = 25; // 文字表示速度

            const typeChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.substring(0, currentIndex + 1));
                    currentIndex++;
                    timeout = setTimeout(typeChar, Math.random() * 30 + typingSpeed);
                } else {
                    setTextComplete(true);
                    if (onComplete) {
                        onComplete();
                    }
                }
            };

            typeChar();
        }, delay);

        // カーソル点滅処理
        const cursorInterval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 530);

        return () => {
            clearInterval(cursorInterval);
            clearTimeout(timeout);
        };
    }, [text, delay, isLast, onComplete]);

    return (
        <div className={cn(
            "font-mono text-terminal-green flex items-center",
            highlight && "text-amber-400 drop-shadow-[0_0_3px_rgba(255,191,0,0.7)]"
        )}>
            <div className="flex-grow">
                {displayedText}
                <span className={cn("ml-0.5", !cursorVisible && "opacity-0")}>
                    _
                </span>
            </div>

            {/* プリロード状態インジケーター */}
            {isPreloading && (
                <div className="flex items-center ml-2">
                    <span className="text-xs text-amber-400/80 mr-1">PRELOADING</span>
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 bg-amber-400/80 rounded-full"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// カウントダウン表示コンポーネント
const Countdown = ({ onComplete }: { onComplete: () => void }) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count <= 0) {
            onComplete();
            return;
        }

        const timer = setTimeout(() => {
            setCount(count - 1);
        }, 800);

        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            {count > 0 ? (
                <motion.div
                    key={`count-${count}`}
                    className="text-4xl font-bold text-terminal-green"
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {count}
                </motion.div>
            ) : (
                <motion.div
                    key="start"
                    className="text-2xl font-bold text-amber-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    START!
                </motion.div>
            )}
        </div>
    );
};

// グリッド初期化アニメーション
const GridInitialization = ({ isPreloaded = false }) => {
    return (
        <div className="mt-4 mb-2 border border-terminal-green/30 p-3 bg-black/30">
            <div className="text-xs text-terminal-green/70 mb-2 flex justify-between">
                <span>Generating game field...</span>
                {isPreloaded && (
                    <span className="text-amber-400">
                        ✓ PRELOADED
                    </span>
                )}
            </div>
            <div className="grid grid-cols-5 gap-1 w-40 mx-auto">
                {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "w-6 h-6 flex items-center justify-center text-[10px]",
                            isPreloaded
                                ? "bg-terminal-green/30 text-terminal-green"
                                : "bg-terminal-green/20 text-terminal-green/60"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            backgroundColor: isPreloaded
                                ? ["rgba(12,250,0,0.3)", "rgba(12,250,0,0.4)", "rgba(12,250,0,0.3)"]
                                : ["rgba(12,250,0,0.1)", "rgba(12,250,0,0.3)", "rgba(12,250,0,0.1)"]
                        }}
                        transition={{
                            delay: i * 0.02,
                            duration: 0.3,
                            backgroundColor: { repeat: 2, duration: 0.5, delay: i * 0.02 + 0.3 }
                        }}
                    >
                        {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function GameStartCountdown() {
    const { state, activateGame, preloadGame, initializeGame } = useGameState();
    const [currentStep, setCurrentStep] = useState(-1);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isPreloading, setIsPreloading] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // プリロード処理を開始
    useEffect(() => {
        const startPreloading = async () => {
            if (state.gamePhase !== 'countdown' || isPreloaded || isPreloading) return;

            // すでにsessionIdがある場合はそれを使用
            if (state.sessionId && state.grid.length > 0) {
                console.log('Session already exists, marking as preloaded');
                setIsPreloaded(true);
                return;
            }

            setIsPreloading(true);
            try {
                await preloadGame();
                setIsPreloaded(true);
                console.log('Game data preloaded successfully');
            } catch (error) {
                console.error('Preloading failed, will continue with direct initialization:', error);
            } finally {
                setIsPreloading(false);
            }
        };

        if (state.gamePhase === 'countdown') {
            startPreloading();
        }
    }, [state.gamePhase, preloadGame, isPreloaded, isPreloading, state.sessionId, state.grid]);

    // アニメーション完了後にゲーム初期化を実行
    useEffect(() => {
        if (isComplete) {
            // フェードアウト効果を追加
            setFadeOut(true);

            // フェードアウト後にゲーム初期化
            const timer = setTimeout(async () => {
                try {
                    console.log('Animation complete, activating game');
                    console.log('Current state:', {
                        hasPreloadedData: !!state.preloadedData,
                        hasSessionId: !!state.sessionId,
                        isPreloaded
                    });

                    // ここでactivateGameを非同期で呼び出す（修正後のactivateGame関数）
                    await activateGame();
                } catch (err) {
                    console.error('Error activating game:', err);
                    // エラー時には初期化を直接実行
                    initializeGame();
                }
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isComplete, activateGame, initializeGame, state.preloadedData, state.sessionId, isPreloaded]);

    // 次のステップへ進む関数
    const goToNextStep = () => {
        if (currentStep < bootSequence.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);

            // グリッド表示フラグの設定
            if (bootSequence[nextStep].showGrid) {
                setShowGrid(true);
            }

            // カウントダウン開始フラグの設定
            if (bootSequence[nextStep].countdown) {
                // プリロードが完了していない場合、完了まで待機
                if (!isPreloaded && !state.preloadedData) {
                    setShowCountdown(false);

                    // プリロード完了を待ってからカウントダウン開始
                    const checkPreload = () => {
                        if (isPreloaded || state.preloadedData) {
                            setShowCountdown(true);
                            return;
                        }

                        // プリロードが完了するまで再帰的に確認
                        setTimeout(checkPreload, 300);
                    };

                    checkPreload();
                } else {
                    setShowCountdown(true);
                }
            }

            // 自動スクロール
            if (containerRef.current) {
                setTimeout(() => {
                    containerRef.current?.scrollTo({
                        top: containerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    };

    // カウントダウン終了時の処理
    const handleCountdownComplete = () => {
        setIsComplete(true);
    };

    // カウントダウンフェーズでのみ表示
    if (state.gamePhase !== 'countdown') return null;

    // 初回レンダリング時に最初のステップを開始
    if (currentStep === -1) {
        setTimeout(() => setCurrentStep(0), 300);
    }

    // プリロード状態チェック
    const isDataPreloaded = isPreloaded || !!state.preloadedData;

    return (
        <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-2xl bg-black border border-terminal-green/50 p-4 rounded-sm shadow-[0_0_15px_rgba(12,250,0,0.2)] scanlines relative overflow-hidden">
                {/* Windowsコマンドプロンプト風のタイトルバー */}
                <div className="bg-terminal-green text-black font-mono text-xs px-2 py-1 flex justify-between mb-2">
                    <span>ACRO_ATTACK - Command Prompt</span>
                    <div className="flex space-x-2">
                        <span>_</span>
                        <span>□</span>
                        <span>×</span>
                    </div>
                </div>

                {/* ターミナルコンテンツ */}
                <div
                    ref={containerRef}
                    className="h-56 overflow-y-auto terminal-scroll-hide bg-black p-2 font-mono text-sm"
                >
                    <div className="text-terminal-green/70 mb-2">Microsoft Windows [Version 10.0.19045.4170]</div>
                    <div className="text-terminal-green/70 mb-3">(c) ACRO Corporation. All rights reserved.</div>

                    <AnimatePresence mode="wait">
                        {currentStep >= 0 && bootSequence.slice(0, currentStep + 1).map((line, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-2"
                            >
                                <TypedLine
                                    text={line.text}
                                    delay={index === currentStep ? 50 : 0}
                                    isLast={index === bootSequence.length - 1}
                                    showGrid={line.showGrid}
                                    isPreloading={index === 2 && isPreloading}
                                    onComplete={index === currentStep ? goToNextStep : undefined}
                                />

                                {/* グリッドのデモ表示 */}
                                {line.showGrid && showGrid && <GridInitialization isPreloaded={isDataPreloaded} />}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* カウントダウン表示 */}
                    <AnimatePresence>
                        {showCountdown && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Countdown onComplete={handleCountdownComplete} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ステータスバー */}
                <div className="border-t border-terminal-green/30 pt-1 mt-1">
                    <div className="flex justify-between items-center text-[10px] text-terminal-green/50 font-mono">
                        <span className="flex items-center gap-2">
                            Ver 1.0.4
                            {isDataPreloaded && (
                                <span className="bg-terminal-green/20 text-terminal-green px-1 rounded text-[8px]">
                                    DATA READY
                                </span>
                            )}
                        </span>
                        <span>PROGRESS: {Math.min(100, Math.round((currentStep + 1) / bootSequence.length * 100))}%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
