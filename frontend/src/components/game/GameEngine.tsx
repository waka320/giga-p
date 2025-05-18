"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import Controls from './Controls';
import CompletedTerms from './CompletedTerms';
import BonusMessage from './BonusMessage';
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
    }, [state.gameOver, router, state.score, state.completedTerms]);

    // ゲームオーバー時の表示
    if (state.gameOver) {
        return (
            <motion.div
                className="bg-black border-2 border-terminal-green p-6 rounded-lg shadow-[0_0_15px_rgba(12,250,0,0.4)] text-center max-w-md mx-auto scanlines"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
            >
                <h2 className="text-2xl font-pixel mb-4 text-terminal-green">GAME OVER</h2>
                <p className="text-xl mb-6 font-mono text-terminal-green/90">
                    FINAL SCORE: <span className="font-bold">{state.score}</span>
                </p>
                <p className="text-terminal-green/70 text-sm mb-6 font-mono">
                    &gt; Redirecting to results page...
                </p>
                <div className="animate-blink text-terminal-green">█</div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <GameInfo />
            <GameGrid />
            <Controls />
            <CompletedTerms />
            <BonusMessage />
        </div>
    );
}
