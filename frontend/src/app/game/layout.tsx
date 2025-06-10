"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isPlayRoute = pathname === "/game/play";
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // 画面サイズの検出
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerHeight <= 700);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // ゲームプレイ中 + 小さい画面ではヘッダーを非表示
    const hideHeader = isPlayRoute && isSmallScreen;

    return (
        <div className="flex flex-col min-h-screen bg-matrix-dark bg-noise relative overflow-hidden">
            {/* グリッドパターン背景 */}
            <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

            {/* スキャンラインエフェクト */}
            <div className="absolute inset-0 scanlines pointer-events-none"></div>

            {/* モバイルメニュー */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 z-50 flex flex-col p-6"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-terminal-green font-pixel text-xl">メニュー</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-terminal-green p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            <Link
                                href="/"
                                className="text-terminal-green font-mono flex items-center gap-2 text-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Home size={18} />
                                ホームに戻る
                            </Link>
                            <Link
                                href="/game/start"
                                className="text-terminal-green font-mono flex items-center gap-2 text-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <ArrowLeft size={18} />
                                タイトルに戻る
                            </Link>
                            <Link
                                href="/dictionary"
                                className="text-terminal-green font-mono flex items-center gap-2 text-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                IT用語辞典
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="text-terminal-green font-mono flex items-center gap-2 text-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ランキング
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ヘッダー: 小さい画面 + ゲームプレイ時は非表示 */}
            <header className={`bg-black/70 border-b border-terminal-green/30 relative z-10 transition-all duration-300
                ${hideHeader ? 'h-0 overflow-hidden border-b-0' : isPlayRoute ? 'py-1 px-4' : 'py-3 px-6'}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/game/start">
                            <h1 className={`font-pixel text-terminal-green tracking-wide drop-shadow-[0_0_5px_rgba(12,250,0,0.5)]
                                ${isPlayRoute ? 'text-sm' : 'text-2xl'}`}>
                                {"> "} アクロアタック.
                            </h1>
                        </Link>

                        {/* ホームリンク - 常に表示 */}
                        <Link
                            href="/"
                            className="text-terminal-green/60 hover:text-terminal-green transition-colors hidden sm:flex items-center text-xs gap-1"
                        >
                            <Home size={12} className="mr-0.5" />
                            ホーム
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* ゲームプレイページでは非表示 */}
                        {!isPlayRoute && (
                            <div className="hidden sm:block text-sm font-mono text-terminal-green/80">
                                <span className="mr-2">&gt;</span>
                                <span className="animate-blink">_</span>
                                <span> Acro_Attack.</span>
                            </div>
                        )}

                        {/* ゲームプレイページには最小限の情報を表示 */}
                        {isPlayRoute && !isSmallScreen && (
                            <div className="text-xs font-mono text-terminal-green/60">
                                <span className="hidden sm:inline mr-1">&gt; PLAYING</span>
                                <span className="animate-blink">_</span>
                            </div>
                        )}

                        {/* メニューボタン */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="text-terminal-green/70 hover:text-terminal-green p-1.5 transition-colors"
                            aria-label="メニューを開く"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className={`flex-grow relative z-10 ${hideHeader ? 'pt-0' : isPlayRoute ? 'pt-1' : 'pt-2'}`}>
                {children}
            </main>

            {/* フッター: 小さい画面 + ゲームプレイ時は非表示 */}
            <footer className={`bg-black/70 border-t border-terminal-green/30 text-center text-terminal-green/50 text-xs font-mono relative z-10
                ${hideHeader ? 'h-0 overflow-hidden border-t-0' : isPlayRoute ? 'py-1' : 'py-2'}`}>
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div>
                        {isPlayRoute ? (
                            <p className="text-[10px]">ACRO_ATTACK.</p>
                        ) : (
                            <p>© 2025 ACRO_ATTACK. <span className="hidden sm:inline">- ver 1.0.0</span></p>
                        )}
                    </div>

                    {/* フッターナビゲーション */}
                    {!isPlayRoute && (
                        <div className="flex gap-3 items-center text-[10px]">
                            <Link href="/" className="hover:text-terminal-green/80 transition-colors">
                                ホーム
                            </Link>
                            <Link href="/dictionary" className="hover:text-terminal-green/80 transition-colors">
                                辞典
                            </Link>
                            <Link href="/leaderboard" className="hover:text-terminal-green/80 transition-colors">
                                ランキング
                            </Link>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}
