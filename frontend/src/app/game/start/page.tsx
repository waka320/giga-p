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
            className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-4xl font-bold mb-4 text-center text-blue-800">IT用語パズルゲーム GIGA.PE</h1>
            <p className="text-xl mb-8 text-center text-gray-700">
                IT用語を見つけて、タイムアタック形式でスコアを競おう！
            </p>

            <motion.button
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg mb-10 hover:bg-blue-700 transition-colors"
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                ゲームスタート
            </motion.button>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">遊び方</h2>
                <p className="mb-2 text-gray-700">• 5×5のグリッドからIT用語を見つけよう</p>
                <p className="mb-2 text-gray-700">• 制限時間は60秒</p>
                <p className="mb-2 text-gray-700">• 単語が長いほど高得点</p>
                <p className="mb-2 text-gray-700">• 連続正解でコンボボーナス獲得！</p>
            </div>
        </motion.div>
    );
}
