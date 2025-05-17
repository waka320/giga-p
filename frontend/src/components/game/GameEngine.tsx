import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import Controls from './Controls';
import CompletedTerms from './CompletedTerms';
import { motion } from 'framer-motion';

export default function GameEngine() {
    const { state, startGame } = useGameState();

    useEffect(() => {
        startGame();
    }, []);

    if (state.gameOver) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">ゲーム終了!</h2>
                <p className="text-xl mb-6 text-gray-700">最終スコア: <span className="font-bold text-blue-600">{state.score}</span></p>
                <button
                    onClick={startGame}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                >
                    もう一度プレイ
                </button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <GameInfo />
            <GameGrid />
            <Controls />
            <CompletedTerms />
        </div>
    );
}
