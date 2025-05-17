"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ITTerm } from "@/types";

export default function GameResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState({
        score: 0,
        completedTerms: [] as ITTerm[]
    });

    useEffect(() => {
        // ローカルストレージからゲーム結果を取得
        const savedResults = localStorage.getItem('gameResults');
        if (savedResults) {
            setResults(JSON.parse(savedResults));
        }
    }, []);

    const playAgain = () => {
        router.push("/game/play");
    };

    const backToTitle = () => {
        router.push("/game/start");
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto p-8 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-3xl font-bold mb-6 text-center">ゲーム結果</h1>

            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-center mb-4">最終スコア: {results.score}</h2>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">完成させた用語:</h3>
                    {results.completedTerms.length > 0 ? (
                        <div className="space-y-3">
                            {results.completedTerms.map((term, index) => (
                                <div key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <strong className="font-mono">{term.term}</strong>: {term.fullName} - {term.description}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center">完成した用語はありません</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <motion.button
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition-colors"
                    onClick={playAgain}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    もう一度プレイ
                </motion.button>

                <motion.button
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow transition-colors"
                    onClick={backToTitle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    タイトルに戻る
                </motion.button>
            </div>
        </motion.div>
    );
}
