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
            className="max-w-4xl mx-auto p-8 flex flex-col items-center min-h-screen bg-cyber-black bg-grid-pattern bg-[size:20px_20px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-3xl font-pixel mb-6 text-center text-terminal-green drop-shadow-[0_0_5px_rgba(12,250,0,0.7)]">
                MISSION COMPLETE
            </h1>

            <div className="w-full bg-black border-2 border-terminal-green rounded-lg shadow-[0_0_15px_rgba(12,250,0,0.3)] p-6 mb-8 scanlines">
                <h2 className="text-2xl font-pixel text-center mb-4 text-terminal-green">
                    FINAL SCORE: {results.score}
                </h2>

                <div className="mt-6">
                    <h3 className="text-xl font-mono text-terminal-green/90 mb-3">
                        &gt; 発見された用語:
                    </h3>
                    {results.completedTerms.length > 0 ? (
                        <div className="space-y-3">
                            {results.completedTerms.map((term, index) => (
                                <div key={index} className="p-3 bg-matrix-dark/50 border border-terminal-green/30 rounded-md">
                                    <strong className="font-mono text-terminal-green">{term.term}</strong>: 
                                    <span className="text-terminal-green/80"> {term.fullName} - {term.description}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-terminal-green/50 text-center font-mono">完成した用語はありません</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <motion.button
                    className="px-6 py-3 bg-black border-2 border-terminal-green text-terminal-green font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.3)] hover:bg-terminal-green hover:text-black transition-colors"
                    onClick={playAgain}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    &gt;_ RETRY
                </motion.button>

                <motion.button
                    className="px-6 py-3 bg-black border-2 border-terminal-green/70 text-terminal-green/70 font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.2)] hover:bg-terminal-green/70 hover:text-black transition-colors"
                    onClick={backToTitle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    &gt;_ BACK TO TITLE
                </motion.button>
            </div>
        </motion.div>
    );
}
