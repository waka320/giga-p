"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import Controls from './Controls';
import CompletedTerms from './CompletedTerms';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function GameEngine() {
    const { state, startGame } = useGameState();
    const router = useRouter();

    useEffect(() => {
        startGame();
        
        // コンポーネントのアンマウント時にゲームセッションを終了
        return () => {
            if (state.sessionId && !state.gameOver) {
                axios.post(`http://localhost:8000/api/game/${state.sessionId}/end`, {
                    score: state.score
                }).catch(err => console.error('Failed to end game session:', err));
            }
        };
    }, []);

    // ゲーム終了時の処理を追加
    useEffect(() => {
        if (state.gameOver) {
            // ゲーム結果をローカルストレージに保存
            localStorage.setItem('gameResults', JSON.stringify({
                score: state.score,
                completedTerms: state.completedTerms
            }));
            
            // 1秒後に結果画面へ遷移
            const timer = setTimeout(() => {
                router.push('/game/results');
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [state.gameOver, router]);

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
