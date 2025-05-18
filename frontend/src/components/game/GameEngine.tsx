"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import CompletedTerms from './CompletedTerms';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// 残り時間に応じたスタイルを取得する関数
export const getTimeBasedStyle = (time: number) => {
    if (time <= 10) return {
        borderClass: "border-red-500",
        backgroundClass: "bg-red-950/10",
        animationClass: "animate-pulse"
    };
    if (time <= 30) return {
        borderClass: "border-yellow-500",
        backgroundClass: "bg-yellow-950/10", 
        animationClass: "animate-pulse"
    };
    return {
        borderClass: "border-terminal-green",
        backgroundClass: "",
        animationClass: ""
    };
};

export default function GameEngine() {
    const { state, startGame } = useGameState();
    const router = useRouter();
    
    // 残り時間に基づくスタイルを取得
    const timeStyle = getTimeBasedStyle(state.time);

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
        <div className={cn(
            "w-full max-w-7xl mx-auto px-4",
            timeStyle.backgroundClass
        )}>
            {/* モバイルのみ上部にGameInfoを表示 */}
            <div className="block lg:hidden">
                <GameInfo />
            </div>
            
            {/* モバイルでは縦並び、lg(1024px)以上で横並びに */}
            <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start lg:justify-center">
                {/* グリッド部分 - モバイルでは全幅、PCでは固定幅 */}
                <div className="w-full lg:w-auto">
                    <GameGrid timeStyle={timeStyle} />
                </div>
                
                {/* ログ部分 - モバイルでは下に、PCでは右側に */}
                <div className="w-full lg:w-80 mt-4 lg:mt-0 flex flex-col">
                    {/* PC版ではGameInfoをCompletedTermsの上に表示 */}
                    <div className="hidden lg:block mb-3">
                        <GameInfo />
                    </div>
                    <CompletedTerms />
                </div>
            </div>
        </div>
    );
}
