"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import CompletedTerms from './CompletedTerms';
import GameCrashEffect from './GameCrashEffect';
import ComboEffect from './ComboEffect';
import { motion } from 'framer-motion';
import axios from 'axios';
import { cn } from '@/lib/utils';
import Link from 'next/link'; // Link コンポーネントをインポート
import { useRouter } from 'next/navigation'; // 追加

// バックエンドAPIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const endGame = async (sessionId?: string) => {
    if (!sessionId) {
        console.log('No session ID provided, skipping API call');
        return;
    }
    
    try {
        await axios.post(`${API_URL}/game/${sessionId}/end`);
        console.log('Game ended successfully');
    } catch (error) {
        console.error('Failed to end game session:', error);
        // エラーを上位に伝播させて、呼び出し元でもキャッチできるようにする
        throw error;
    }
};

// 残り時間に応じたスタイルを取得する関数
export const getTimeBasedStyle = (time: number) => {
    if (time <= 10) return {
        borderClass: "border-red-500",
        backgroundClass: "bg-red-950/10",
        animationClass: "grid-danger-animation"
    };
    if (time <= 30) return {
        borderClass: "border-yellow-500",
        backgroundClass: "bg-yellow-950/10",
        animationClass: "grid-warning-animation"
    };
    return {
        borderClass: "border-terminal-green",
        backgroundClass: "",
        animationClass: "grid-normal-animation"
    };
};

export default function GameEngine() {
    const router = useRouter(); // 追加
    const { state } = useGameState();
    const [showCrashEffect, setShowCrashEffect] = useState(false);
    const gameOverProcessed = useRef(false);
    const [showComboEffect, setShowComboEffect] = useState(false);
    const [lastCompletedTerm, setLastCompletedTerm] = useState("");
    const prevComboCountRef = useRef(state.comboCount);

    // 残り時間に基づくスタイルを取得
    const timeStyle = getTimeBasedStyle(state.time);

    // コンボカウント変化時の効果
    useEffect(() => {
        // コンボが増加した場合のみ発動（初期ロード時には発動しない）
        if (state.comboCount > prevComboCountRef.current && state.comboCount >= 3) {
            // 3コンボ以上の場合のみ大きな演出を表示
            // 最後に完成した用語を取得（もしあれば）
            let latestTerm = "";
            if (state.completedTerms.length > 0) {
                // name プロパティは存在しないので term プロパティを使用
                latestTerm = state.completedTerms[state.completedTerms.length - 1].term;
            }
            
            setLastCompletedTerm(latestTerm);
            setShowComboEffect(true);
            
            // エフェクトを一定時間後に非表示
            setTimeout(() => {
                setShowComboEffect(false);
            }, 1200); // 少し短くする
        }
        
        // 参照を更新
        prevComboCountRef.current = state.comboCount;
    }, [state.comboCount, state.completedTerms]);

    // コンポーネントのアンマウント時にゲームセッションを終了
    useEffect(() => {
        return () => {
            if (state.sessionId && !state.gameOver) {
                axios.post(`${API_URL}/game/${state.sessionId}/end`)
                    .catch(err => console.error('Failed to end game session:', err));
            }
        };
    }, [state.sessionId, state.gameOver]);

    // ゲーム終了時の処理
    const handleGameOver = useCallback(async () => {
        if (gameOverProcessed.current) return;
        gameOverProcessed.current = true;
        
        console.log('Game over triggered, session ID:', state.sessionId);

        // 終了APIを呼び出し
        try {
            await endGame(state.sessionId);
            console.log('Game session ended successfully');
        } catch (error) {
            console.error('ゲーム終了処理でエラーが発生しました:', error);
            // エラーが発生しても処理を継続
        }

        // ローカルストレージに結果保存 - APIの成功/失敗に関わらず保存
        try {
            // スコアが1000点以上かどうかのフラグも保存
            localStorage.setItem('gameResults', JSON.stringify({
                score: state.score,
                completedTerms: state.completedTerms,
                isHighScore: state.score >= 1000,
                timestamp: new Date().toISOString() // デバッグ用にタイムスタンプを追加
            }));
            console.log('Game results saved to localStorage');
        } catch (storageError) {
            console.error('ゲーム結果の保存に失敗しました:', storageError);
        }

        // クラッシュエフェクト表示（ストレージエラーがあっても表示）
        setShowCrashEffect(true);
    }, [state.sessionId, state.score, state.completedTerms]);

    useEffect(() => {
        if (state.gameOver) {
            handleGameOver();
        }
    }, [state.gameOver, handleGameOver]);

    // 結果画面への遷移を処理するコールバック関数
    const handleCrashAnimationComplete = useCallback(() => {
        // 念のため少し遅延させて状態遷移の競合を防ぐ
        setTimeout(() => {
            try {
                router.push('/game/results');
            } catch (err) {
                console.error('結果画面への遷移に失敗しました:', err);
                // 遷移に失敗した場合のフォールバック
                window.location.href = '/game/results';
            }
        }, 100);
    }, [router]);

    // 初期化中、カウントダウン中、またはゲーム状態が無効な場合はローディング表示
    if (
        state.gamePhase === 'init' ||
        state.gamePhase === 'countdown' ||
        (!state.sessionId && state.gamePhase === 'playing')
    ) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-64 p-4">
                <motion.div
                    className="text-terminal-green font-pixel text-lg mb-3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    LOADING, GET_READY...
                </motion.div>
                <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-terminal-green rounded-full"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </div>
                <Link 
                    href={{ 
                        pathname: typeof window !== 'undefined' 
                            ? window.location.pathname 
                            : '/game/play',
                        query: { refresh: Date.now() } 
                    }} 
                    replace
                    className="mt-6 px-4 py-2 bg-black border border-terminal-green text-terminal-green text-sm rounded hover:bg-terminal-green/20 transition-colors inline-block"
                >
                    再読み込み
                </Link>
            </div>
        );
    }

    // クラッシュエフェクトの表示
    if (showCrashEffect) {
        return <GameCrashEffect 
            score={state.score} 
            onAnimationComplete={handleCrashAnimationComplete}
        />;
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
                    
                    {/* 結果ページへのリンク */}
                    <div className="mt-6 relative z-50">
                        <button
                            onClick={() => {
                                try {
                                    // 最初にJavaScriptで直接遷移を試みる
                                    router.push('/game/results');
                                } catch (err) {
                                    console.error('結果画面への遷移に失敗しました:', err);
                                    // フォールバックとして直接URLを変更
                                    window.location.href = '/game/results';
                                }
                            }}
                            className="px-6 py-3 bg-black/70 border-2 border-red-500/60 text-red-400/90 text-sm font-mono rounded hover:bg-red-950/30 hover:text-red-300 active:bg-red-950/50 focus:outline-none focus:ring-2 focus:ring-red-500/70 transition-all inline-flex items-center gap-1 cursor-pointer relative z-50 pointer-events-auto"
                        >
                            <span>結果を確認</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {/* コンボエフェクト（ゲーム状態に関わらず表示） */}
            <ComboEffect 
                comboCount={state.comboCount} 
                term={lastCompletedTerm}
                isVisible={showComboEffect} 
            />
            
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
        </>
    );
}
