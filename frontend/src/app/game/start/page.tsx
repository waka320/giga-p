"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function GameStartPage() {
    const router = useRouter();

    const startGame = () => {
        router.push("/game/play");
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen p-6 bg-cyber-black bg-grid-pattern bg-[size:20px_20px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-4xl font-pixel mb-4 text-center text-terminal-green drop-shadow-[0_0_5px_rgba(12,250,0,0.7)]">
                IT用語パズルゲーム アクロバスター.
            </h1>
            <p className="text-xl mb-8 text-center text-terminal-green/80 font-mono">
                IT用語を見つけて、タイムアタック形式でスコアを競おう！
            </p>

            <motion.button
                className="px-8 py-3 bg-black border-2 border-terminal-green text-terminal-green font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.3)] hover:bg-terminal-green hover:text-black transition-colors animate-pulse8bit"
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                &gt;_ GAME START
            </motion.button>

            <div className="mt-10 w-full max-w-md bg-black/80 border-2 border-terminal-green rounded p-6 font-mono text-terminal-green/90 scanlines shadow-[0_0_15px_rgba(12,250,0,0.2)]">
                <h2 className="text-xl font-pixel mb-4">&gt; 遊び方.exe</h2>
                <p className="mb-2">$ 5×5のグリッドからIT用語を見つけよう</p>
                <p className="mb-2">$ 制限時間は60秒</p>
                <p className="mb-2">$ 単語が長いほど高得点</p>
                <p className="mb-2">$ 連続正解でコンボボーナス獲得！</p>
            </div>
        </motion.div>
    );
}
