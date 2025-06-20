"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, Info, ArrowRight, ChevronLeft, ChevronRight, Cpu, Zap, Trophy, Terminal, GithubIcon, RefreshCcw, BookOpen, MessageSquarePlus, MessageCircle, ArrowLeft } from "lucide-react";
import { ITTerm } from "@/types";
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";
import { useScoreSubmission } from '@/hooks/useScoreSubmission';
import Link from 'next/link';

export default function GameResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState({
        score: 0,
        completedTerms: [] as ITTerm[],
        availableTerms: [] as ITTerm[],
        missedTerms: [] as ITTerm[],
        isHighScore: false
    });

    const [loadingError, setLoadingError] = useState(false);  // エラー状態を追加

    // 各タブごとにページネーション状態を管理
    const [completedPage, setCompletedPage] = useState(1);
    const [missedPage, setMissedPage] = useState(1);
    const itemsPerPage = 8; // 1ページあたりの表示数（モバイル表示を考慮）

    // 展開状態を管理するための状態
    const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});

    // アニメーション表示用の状態
    const [showIntroAnimation, setShowIntroAnimation] = useState(true);

    // スコア保存用の状態
    const [playerName, setPlayerName] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(true);
    const { submitScore, isSubmitting, error, success } = useScoreSubmission();

    // タブ用の状態
    const [activeTab, setActiveTab] = useState<'discovered' | 'missed'>('discovered');

    // 用語の展開状態をトグルする関数
    const toggleTerm = (termId: string) => {
        // 他の展開されている用語を閉じる（1つだけ開く）
        setExpandedTerms(prev => {
            const newState = { ...prev };
            // すべて閉じる
            Object.keys(newState).forEach(key => {
                newState[key] = false;
            });
            // クリックされた用語だけ反転
            newState[termId] = !prev[termId];
            return newState;
        });
    };

    // Google検索URLを生成する関数
    const getGoogleSearchUrl = (term: string, fullName: string) => {
        const query = encodeURIComponent(`${term} ${fullName} IT用語`);
        return `https://www.google.com/search?q=${query}`;
    };

    // スコアに応じたランク・評価を返す
    const getRankInfo = useMemo(() => {
        const score = results.score;
        if (score >= 3000) return {
            title: "EXCEPTIONAL",
            message: "ハッカーレベルの用語理解力。真のマスター。",
            className: "text-purple-400 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]",
            icon: <Zap className="mr-2 h-5 w-5" />,
            bgClass: "bg-gradient-to-br from-zinc-900 via-purple-950/30 to-zinc-900",
            themeColor: "purple"
        };
        if (score >= 2000) return {
            title: "ELITE",
            message: "高度なIT知識を応用した見事なプレイ。",
            className: "text-blue-400 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]",
            icon: <Cpu className="mr-2 h-5 w-5" />,
            bgClass: "bg-gradient-to-br from-zinc-900 via-blue-950/30 to-zinc-900",
            themeColor: "blue"
        };
        if (score >= 1000) return {
            title: "COMPLETE",
            message: "基本を押さえた効率的なパフォーマンス。",
            className: "text-terminal-green border-terminal-green shadow-[0_0_15px_rgba(12,250,0,0.4)]",
            icon: <Trophy className="mr-2 h-5 w-5" />,
            bgClass: "bg-gradient-to-br from-zinc-900 via-green-950/20 to-zinc-900",
            themeColor: "green"
        };
        if (score >= 500) return {
            title: "PARTIAL",
            message: "基礎的なIT用語の理解を確認。",
            className: "text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
            icon: <Terminal className="mr-2 h-5 w-5" />,
            bgClass: "bg-gradient-to-br from-zinc-900 via-yellow-950/20 to-zinc-900",
            themeColor: "yellow"
        };

        // デフォルト
        return {
            title: "INIT",
            message: "ITの探求を始めたばかり。成長の余地あり。",
            className: "text-gray-400 border-gray-500 shadow-[0_0_10px_rgba(156,163,175,0.3)]",
            icon: <Terminal className="mr-2 h-5 w-5" />,
            bgClass: "bg-gradient-to-br from-zinc-900 to-zinc-900",
            themeColor: "gray"
        };
    }, [results.score]);

    // 現在のタブに応じたページを返す関数
    const currentPage = activeTab === 'discovered' ? completedPage : missedPage;

    // タブ切り替え時にページネーションをリセットしない（以前の位置を覚えておく）
    const setCurrentPage = (page: number) => {
        if (activeTab === 'discovered') {
            setCompletedPage(page);
        } else {
            setMissedPage(page);
        }
    };

    // 発見した用語のページネーション用の表示データを計算
    const paginatedCompletedTerms = useMemo(() => {
        const startIndex = (completedPage - 1) * itemsPerPage;
        return results.completedTerms.slice(startIndex, startIndex + itemsPerPage);
    }, [results.completedTerms, completedPage, itemsPerPage]);

    // 未発見の用語のページネーション用の表示データを計算
    const paginatedMissedTerms = useMemo(() => {
        const startIndex = (missedPage - 1) * itemsPerPage;
        return results.missedTerms?.slice(startIndex, startIndex + itemsPerPage) || [];
    }, [results.missedTerms, missedPage, itemsPerPage]);

    // 総ページ数を計算
    const totalPages = useMemo(() => {
        if (activeTab === 'discovered') {
            return Math.ceil(results.completedTerms.length / itemsPerPage);
        } else {
            return Math.ceil((results.missedTerms?.length || 0) / itemsPerPage);
        }
    }, [results.completedTerms.length, results.missedTerms, itemsPerPage, activeTab]);

    // ページ移動関数
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        // ローカルストレージからゲーム結果を取得
        try {
            const savedResults = localStorage.getItem('gameResults');
            if (savedResults) {
                const parsedResults = JSON.parse(savedResults);

                // 未発見用語が保存されていない場合は計算する
                let missedTerms = parsedResults.missedTerms || [];
                if (!parsedResults.missedTerms && parsedResults.availableTerms) {
                    const completedTermIds = (parsedResults.completedTerms || [])
                        .map((term: ITTerm) => term.term.toUpperCase());
                    missedTerms = (parsedResults.availableTerms || [])
                        .filter((term: ITTerm) => !completedTermIds.includes(term.term.toUpperCase()));
                }

                setResults({
                    score: parsedResults.score || 0,
                    completedTerms: parsedResults.completedTerms || [],
                    availableTerms: parsedResults.availableTerms || [],
                    missedTerms: missedTerms,
                    isHighScore: parsedResults.isHighScore || parsedResults.score >= 1000
                });
            } else {
                console.warn('ゲーム結果データが見つかりません');
                setLoadingError(true);
            }
        } catch (error) {
            console.error('ゲーム結果の読み込みに失敗しました:', error);
            setLoadingError(true);
        }

        // イントロアニメーションのタイマー
        const timer = setTimeout(() => {
            setShowIntroAnimation(false);
        }, 1200);

        // スクロール可能にする
        document.body.classList.remove('no-scrolling');
        document.body.classList.remove('no-scrolling');
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto'; // html要素にも適用
        document.documentElement.style.height = 'auto';

        return () => clearTimeout(timer);
    }, []);

    const playAgain = () => {
        router.push("/game/play");
    };

    const backToTitle = () => {
        router.push("/game/start");
    };

    const handleSubmitScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim() === '') return;

        const result = await submitScore(playerName, results.score, results.completedTerms);
        if (result) {
            // 成功したら3秒後にフォームを非表示
            setTimeout(() => {
                setShowSubmitForm(false);
            }, 3000);
        }
    };

    // データ読み込みエラー時の表示を追加
    if (loadingError) {
        return (
            <div className="bg-zinc-900 min-h-screen w-full flex items-center justify-center p-4">
                <div className="bg-black/80 border-2 border-red-500/60 p-6 rounded-lg max-w-md w-full text-center">
                    <div className="text-red-400 mb-4">
                        <RefreshCcw className="mx-auto h-12 w-12 mb-2" />
                        <h2 className="text-xl font-pixel">データ読み込みエラー</h2>
                    </div>
                    <p className="text-gray-300 mb-6">
                        ゲーム結果データの読み込みに失敗しました。ゲームを先にプレイする必要があります。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/game/play"
                            className="px-4 py-2 bg-black border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/10 transition-colors"
                        >
                            ゲームをプレイ
                        </Link>
                        <Link
                            href="/game/start"
                            className="px-4 py-2 bg-black border border-gray-500 text-gray-400 rounded hover:bg-gray-900 transition-colors"
                        >
                            タイトルに戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative overflow-x-hidden overflow-y-auto game-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                overscrollBehavior: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                height: '100%',
                minHeight: '100vh'
            }}
        >
            {/* イントロアニメーション - position: fixed を明示的に使用 */}
            <AnimatePresence>
                {showIntroAnimation && (
                    <motion.div
                        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="text-terminal-green font-pixel text-2xl"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            ANALYZING PERFORMANCE
                        </motion.div>
                        <div className="mt-4 flex space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-terminal-green rounded-full"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        delay: i * 0.15,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* サイバー背景 */}
            <CyberPsychedelicBackground
                variant={getRankInfo.themeColor === "purple" ? "cyber" : "matrix"}
                intensity={0.3}
                brightness={0.55}
            />

            {/* スキャンライン効果 */}
            <div className="scanlines absolute inset-0 pointer-events-none z-10"></div>

            {/* 既存のコンテンツ */}
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col items-center justify-center z-20 relative">
                {/* ヘッダー：ランクとスコア */}
                <motion.div
                    className={`w-full bg-black/80 border-2 ${getRankInfo.className.replace('text-', 'border-')} rounded-md p-4 mb-4 relative backdrop-blur-sm`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {/* タイトルとランク */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
                        <div className="flex items-center">
                            {getRankInfo.icon}
                            <h1 className={`text-xl sm:text-2xl font-pixel ${getRankInfo.className}`}>
                                {getRankInfo.title}
                            </h1>
                        </div>

                        <h2 className={`text-xl sm:text-2xl font-pixel ${getRankInfo.className}`}>
                            SCORE: {results.score}
                        </h2>
                    </div>

                    {/* メッセージと分析 */}
                    <div className="mb-4">
                        <p className="text-sm sm:text-base text-center text-gray-300 font-mono">
                            {getRankInfo.message}
                        </p>
                    </div>

                    {/* 統計情報 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
                        <div className="bg-black/50 border border-gray-700 rounded p-2 text-center">
                            <div className="text-gray-400 mb-1">発見用語数</div>
                            <div className={`font-pixel ${getRankInfo.className}`}>{results.completedTerms.length}</div>
                        </div>
                        <div className="bg-black/50 border border-gray-700 rounded p-2 text-center">
                            <div className="text-gray-400 mb-1">平均点/用語</div>
                            <div className={`font-pixel ${getRankInfo.className}`}>
                                {results.completedTerms.length ? Math.round(results.score / results.completedTerms.length) : 0}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-gray-700 rounded p-2 text-center">
                            <div className="text-gray-400 mb-1">最長用語</div>
                            <div className={`font-pixel ${getRankInfo.className} text-xs truncate`}>
                                {results.completedTerms.length ?
                                    results.completedTerms.reduce((max, term) =>
                                        term.fullName.length > max.fullName.length ? term : max
                                        , results.completedTerms[0]).term : '-'}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-gray-700 rounded p-2 text-center">
                            <div className="text-gray-400 mb-1">最高得点用語</div>
                            <div className={`font-pixel ${getRankInfo.className} text-xs truncate`}>
                                {results.completedTerms.length ?
                                    results.completedTerms.reduce((max, term) =>
                                        term.fullName.length > max.fullName.length ? term : max
                                        , results.completedTerms[0]).term : '-'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* スコア保存セクション - 1000点以上の場合のみ表示 */}
                {results.isHighScore && showSubmitForm && (
                    <motion.div
                        className="w-full bg-black/80 border-2 border-terminal-green rounded-md p-4 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="text-terminal-green font-pixel text-center mb-2">
                            ハイスコア登録
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 text-center">
                            1000点以上のスコアはランキングに登録できます
                        </p>

                        <form onSubmit={handleSubmitScore}>
                            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="プレイヤー名を入力"
                                    className="bg-black border border-terminal-green/50 text-terminal-green p-2 rounded w-full sm:flex-1"
                                    maxLength={15}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || playerName.trim() === ''}
                                    className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-4 py-2 rounded disabled:opacity-50 w-full sm:w-auto"
                                >
                                    {isSubmitting ? '送信中...' : '登録する'}
                                </button>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            {success && (
                                <div className="text-terminal-green text-sm text-center">
                                    スコアを登録しました！ <Link href="/leaderboard" className="underline hover:text-terminal-green/80">ランキングを見る</Link>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}

                {/* 用語一覧セクション */}
                <motion.div
                    className="w-full bg-black/80 border-2 border-terminal-green/70 rounded-md p-4 mb-6 relative"
                    style={{
                        overflowY: 'visible',
                        height: 'auto'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {/* 用語リストヘッダー */}
                    <div className="flex justify-between items-center mb-3 sticky top-0 bg-black/90 py-2 -mt-2 -mx-2 px-2 z-10 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActiveTab('discovered')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'discovered'
                                    ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/50'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                発見した用語 ({results.completedTerms.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('missed')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'missed'
                                    ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/50'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                発見できなかった用語 ({results.missedTerms?.length || 0})
                            </button>
                        </div>

                        {/* ページネーション - activeTabに関わらず表示（totalPagesが1より大きい場合） */}
                        {totalPages > 1 && (
                            <div className="flex items-center text-xs font-mono">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1 bg-black/80 border border-terminal-green/40 text-terminal-green/70 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="mx-2 text-terminal-green/80">
                                    {currentPage}/{totalPages}
                                </span>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-1 bg-black/80 border border-terminal-green/40 text-terminal-green/70 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* IT用語辞典へのリンク - 変更なし */}
                    <div className="mb-3 flex justify-end">
                        <Link
                            href="/dictionary"
                            className="flex items-center text-xs md:text-sm text-terminal-green hover:text-terminal-green/80 transition-colors"
                        >
                            <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            IT用語辞典を見る
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                        </Link>
                    </div>

                    {/* タブコンテンツ - ここを条件分岐で整理 */}
                    {activeTab === 'discovered' ? (
                        /* 発見した用語タブのコンテンツ */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {paginatedCompletedTerms.map((term, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`
                                        relative overflow-hidden rounded border-l-2 border-t border-r border-b
                                        ${expandedTerms[term.term]
                                            ? `${getRankInfo.className.replace('text-', 'border-l-')}`
                                            : 'border-l-terminal-green/50 border-t-terminal-green/30 border-r-terminal-green/30 border-b-terminal-green/30'}
                                        transition-all duration-300 ease-in-out
                                        hover:border-l-terminal-green/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]
                                    `}
                                >
                                    {/* カード内容 */}
                                    <div
                                        onClick={() => toggleTerm(term.term)}
                                        className="p-3 bg-matrix-dark/70 cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center mb-1">
                                                    <h4 className="font-pixel text-sm sm:text-base text-terminal-green truncate">
                                                        {term.term}
                                                    </h4>
                                                </div>
                                                <span className="text-terminal-green/60 text-xs font-mono block mb-1">
                                                    {term.fullName}
                                                </span>
                                                {!expandedTerms[term.term] && (
                                                    <p className="text-terminal-green/80 text-xs line-clamp-2">
                                                        {term.description}
                                                    </p>
                                                )}
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedTerms[term.term] ? 90 : 0 }}
                                                className="text-terminal-green/70 ml-2 flex-shrink-0"
                                            >
                                                <ArrowRight size={16} />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedTerms[term.term] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="mt-2 pt-2 border-t border-terminal-green/20"
                                                >
                                                    <p className="text-terminal-green/90 text-xs mb-3">
                                                        {term.description}
                                                    </p>

                                                    <div className="flex gap-2">
                                                        <a
                                                            href={getGoogleSearchUrl(term.term, term.fullName)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-xs px-2 py-1 rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Search size={12} className="mr-1" />
                                                            Google検索
                                                            <ExternalLink size={10} className="ml-1" />
                                                        </a>

                                                        <a
                                                            href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(term.fullName)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-xs px-2 py-1 rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Info size={12} className="mr-1" />
                                                            Wikipedia
                                                            <ExternalLink size={10} className="ml-1" />
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* 未発見の用語タブのコンテンツ */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {paginatedMissedTerms.map((term, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`
                                        relative overflow-hidden rounded border-l-2 border-t border-r border-b
                                        ${expandedTerms[term.term]
                                            ? `${getRankInfo.className.replace('text-', 'border-l-')}`
                                            : 'border-l-terminal-green/50 border-t-terminal-green/30 border-r-terminal-green/30 border-b-terminal-green/30'}
                                        transition-all duration-300 ease-in-out
                                        hover:border-l-terminal-green/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]
                                    `}
                                >
                                    <div
                                        onClick={() => toggleTerm(term.term)}
                                        className="p-3 bg-matrix-dark/70 cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center mb-1">
                                                    <h4 className="font-pixel text-sm sm:text-base text-terminal-green truncate">
                                                        {term.term}
                                                    </h4>
                                                </div>
                                                <span className="text-terminal-green/60 text-xs font-mono block mb-1">
                                                    {term.fullName}
                                                </span>
                                                {!expandedTerms[term.term] && (
                                                    <p className="text-terminal-green/80 text-xs line-clamp-2">
                                                        {term.description}
                                                    </p>
                                                )}
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedTerms[term.term] ? 90 : 0 }}
                                                className="text-terminal-green/70 ml-2 flex-shrink-0"
                                            >
                                                <ArrowRight size={16} />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedTerms[term.term] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="mt-2 pt-2 border-t border-terminal-green/20"
                                                >
                                                    <p className="text-terminal-green/90 text-xs mb-3">
                                                        {term.description}
                                                    </p>

                                                    <div className="flex gap-2">
                                                        <a
                                                            href={getGoogleSearchUrl(term.term, term.fullName)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-xs px-2 py-1 rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Search size={12} className="mr-1" />
                                                            Google検索
                                                            <ExternalLink size={10} className="ml-1" />
                                                        </a>

                                                        <a
                                                            href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(term.fullName)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-xs px-2 py-1 rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Info size={12} className="mr-1" />
                                                            Wikipedia
                                                            <ExternalLink size={10} className="ml-1" />
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>


                {/* 操作ボタン */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center w-full mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <motion.button
                        className={`px-6 py-3 bg-black/80 border-2 ${getRankInfo.className.replace('text-', 'border-')} ${getRankInfo.className} font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.3)] hover:bg-terminal-green/10 transition-colors text-sm flex items-center justify-center`}
                        onClick={playAgain}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        &gt;_ RETRY
                    </motion.button>

                    <motion.button
                        className="px-6 py-3 bg-black/80 border-2 border-terminal-green/50 text-terminal-green/70 font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.2)] hover:bg-terminal-green/10 transition-colors text-sm flex items-center justify-center"
                        onClick={backToTitle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        &gt;_ BACK TO TITLE
                    </motion.button>
                </motion.div>

                {/* 用語リクエストセクション - 追加 */}
                <motion.div
                    className="w-full mt-4 mb-4 p-3 md:p-4 border border-terminal-green/30 bg-black/50 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h3 className="text-sm md:text-base text-terminal-green mb-2 flex items-center">
                        <MessageSquarePlus className="h-4 w-4 mr-2" />
                        用語リクエスト
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm mb-3">
                        追加して欲しいIT用語や略語がありましたら、お問い合わせフォームからご連絡ください。
                    </p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdxX_lu5OO8qZ7CSwpMYx2JhT_hhy6u4-NR8YFwv0uZRgaAHw/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-3 py-1.5 rounded-sm text-xs md:text-sm transition-colors"
                    >
                        <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        用語をリクエストする
                        <ExternalLink className="h-2.5 w-2.5 ml-1" />
                    </a>
                </motion.div>

                {/* フッター */}
                <div className="w-full mt-4 pt-2 border-t border-terminal-green/20 text-gray-400 text-2xs font-mono">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="text-terminal-green/40">
                            © 2025 アクロアタック.
                        </div>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/waka320/giga-p"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-terminal-green/50 hover:text-terminal-green/70 transition-colors flex items-center"
                            >
                                <GithubIcon className="h-2.5 w-2.5 mr-0.5" />
                                リポジトリ
                            </a>
                            <a
                                href="https://wakaport.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-terminal-green/50 hover:text-terminal-green/70 transition-colors"
                            >
                                開発者
                            </a>
                            <Link
                                href="/terms"
                                className="text-terminal-green/50 hover:text-terminal-green/70 transition-colors"
                            >
                                利用規約
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ターミナル風効果装飾 */}
                <motion.div
                    className={`text-xs font-mono ${getRankInfo.className.replace('text-', 'text-').replace('border-', 'text-')}/50`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                >
                    # session_complete [terms: {results.completedTerms.length}] [exit_code: 0]
                </motion.div>
            </div>
        </motion.div>
    );
}
