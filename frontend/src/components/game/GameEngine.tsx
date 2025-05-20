"use client";

import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import CompletedTerms from './CompletedTerms';
import GameCrashEffect from './GameCrashEffect';
import { motion } from 'framer-motion';
import axios from 'axios';
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
    const { state } = useGameState();
    const [showCrashEffect, setShowCrashEffect] = useState(false);
    
    // 残り時間に基づくスタイルを取得
    const timeStyle = getTimeBasedStyle(state.time);

    // コンポーネントのアンマウント時にゲームセッションを終了
    useEffect(() => {
        return () => {
            if (state.sessionId && !state.gameOver) {
                axios.post(`http://localhost:8000/api/game/${state.sessionId}/end`)
                    .catch(err => console.error('Failed to end game session:', err));
            }
        };
    }, [state.sessionId, state.gameOver]);

    // ゲーム終了時の処理
    useEffect(() => {
        if (state.gameOver) {
            // ゲーム結果をローカルストレージに保存
            localStorage.setItem('gameResults', JSON.stringify({
                score: state.score,
                completedTerms: state.completedTerms
            }));
            
            // 少し遅延させてからクラッシュエフェクトを表示
            const timer = setTimeout(() => {
                setShowCrashEffect(true);
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [state.gameOver, state.score, state.completedTerms]);

    // 初期化中、カウントダウン中、またはゲーム状態が無効な場合は表示しない
    if (
        state.gamePhase === 'init' || 
        state.gamePhase === 'countdown' || 
        (!state.sessionId && state.gamePhase === 'playing')
    ) {
        return null;
    }

    // クラッシュエフェクトの表示
    if (showCrashEffect) {
        return <GameCrashEffect score={state.score} />;
    }

    // ゲームオーバー時の表示（クラッシュエフェクト前の警告表示）
    if (state.gameOver) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
                <motion.div
                    className="bg-black/95 border-2 border-red-500 p-6 rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.4)] text-center max-w-md w-full relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 背景のスキャンライン */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
                    <div className="scanlines"></div>
                    
                    {/* 警告アイコン */}
                    <div className="flex justify-center mb-3">
                        <motion.div 
                            className="w-12 h-12 rounded-full bg-red-500/80 flex items-center justify-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <span className="text-black text-2xl font-bold">!</span>
                        </motion.div>
                    </div>

                    {/* 警告テキスト */}
                    <motion.h2 
                        className="text-xl font-pixel mb-3 text-red-500"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        システム異常検知
                    </motion.h2>

                    {/* エラーコード */}
                    <div className="font-mono text-xs text-red-300/70 mb-4">
                        ERROR CODE: 0x{Math.floor(Math.random() * 1000000).toString(16).toUpperCase().padStart(6, '0')}
                    </div>
                    
                    {/* セッション情報 */}
                    <div className="bg-black/50 border border-red-500/30 p-3 mb-4 font-mono text-sm text-left text-terminal-green/80">
                        <div className="mb-1">セッションID: {state.sessionId || '不明'}</div>
                        <div className="mb-1">ステータス: 終了（強制）</div>
                        <div>最終スコア: <span className="font-bold text-terminal-green">{state.score}</span></div>
                    </div>
                    
                    {/* 進行状況 */}
                    <div className="w-full bg-black/50 h-2 border border-red-500/30 overflow-hidden">
                        <motion.div 
                            className="h-full bg-red-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                        />
                    </div>
                    
                    {/* シャットダウンメッセージ */}
                    <motion.div 
                        className="mt-3 text-xs text-red-400/90 font-mono"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    >
                        緊急シャットダウン実行中...
                    </motion.div>
                </motion.div>
            </div>
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
