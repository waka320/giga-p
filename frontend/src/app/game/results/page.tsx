"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, Info, Award, ArrowRight, ChevronLeft, ChevronRight, Cpu, Zap, Trophy, Terminal, GithubIcon } from "lucide-react";
import { ITTerm } from "@/types";
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";
import { useScoreSubmission } from '@/hooks/useScoreSubmission';
import Link from 'next/link';

export default function GameResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState({
        score: 0,
        completedTerms: [] as ITTerm[]
    });

    // ページネーション用の状態
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 1ページあたりの表示数（モバイル表示を考慮）

    // 展開状態を管理するための状態
    const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});

    // 演出効果用の状態
    const [showIntroAnimation, setShowIntroAnimation] = useState(true);

    // スコア保存用の状態
    const [playerName, setPlayerName] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(true);
    const { submitScore, isSubmitting, error, success } = useScoreSubmission();

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

    // ページネーション用の表示データを計算
    const paginatedTerms = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return results.completedTerms.slice(startIndex, startIndex + itemsPerPage);
    }, [results.completedTerms, currentPage, itemsPerPage]);

    // 総ページ数を計算
    const totalPages = useMemo(() => {
        return Math.ceil(results.completedTerms.length / itemsPerPage);
    }, [results.completedTerms.length, itemsPerPage]);

    // ページ移動関数
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        // ローカルストレージからゲーム結果を取得
        const savedResults = localStorage.getItem('gameResults');
        if (savedResults) {
            setResults(JSON.parse(savedResults));
        }

        // イントロアニメーションのタイマー
        const timer = setTimeout(() => {
            setShowIntroAnimation(false);
        }, 1200);

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

    return (
        <div className="bg-zinc-900 min-h-screen w-full touch-action-auto">
            <motion.div
                className="flex flex-col items-center w-full py-4 bg-zinc-900 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* サイバー背景 */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <CyberPsychedelicBackground
                        variant={getRankInfo.themeColor === "purple" ? "cyber" : "matrix"}
                        intensity={0.3}
                        brightness={0.55}
                    />
                    <div className="scanlines absolute inset-0"></div>
                </div>

                {/* コンテンツ - z-index を使って背景の上に表示 */}
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
                    {results.score >= 1000 && showSubmitForm && (
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
                            <h3 className="text-base sm:text-lg font-mono text-terminal-green/90 flex items-center">
                                <Award className="mr-2 h-4 w-4" />
                                &gt; 発見された用語: <span className="ml-2 text-sm opacity-70">({results.completedTerms.length}個)</span>
                            </h3>

                            {/* ページネーション */}
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

                        {/* 用語リスト */}
                        {results.completedTerms.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {paginatedTerms.map((term, index) => (
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
                                        {/* カード */}
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
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-terminal-green/50 text-center font-mono text-sm p-4 border border-dashed border-terminal-green/20 rounded"
                            >
                                発見した用語はありません
                            </motion.p>
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
                            className={`px-6 py-3 bg-black/80 border-2 ${getRankInfo.className.replace('text-', 'border-')} ${getRankInfo.className} font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.3)] hover:bg-terminal-green/10 transition-colors text-sm`}
                            onClick={playAgain}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            &gt;_ RETRY
                        </motion.button>

                        <motion.button
                            className="px-6 py-3 bg-black/80 border-2 border-terminal-green/50 text-terminal-green/70 font-pixel rounded shadow-[0_0_10px_rgba(12,250,0,0.2)] hover:bg-terminal-green/10 transition-colors text-sm"
                            onClick={backToTitle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            &gt;_ BACK TO TITLE
                        </motion.button>
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
        </div>
    );
}
