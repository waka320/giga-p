"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isPlayRoute = pathname === "/game/play";
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    
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
            
            {/* ヘッダー: 小さい画面 + ゲームプレイ時は非表示 */}
            <header className={`bg-black/70 border-b border-terminal-green/30 relative z-10 transition-all duration-300
                ${hideHeader ? 'h-0 overflow-hidden border-b-0' : isPlayRoute ? 'py-1 px-4' : 'py-3 px-6'}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/game/start">
                        <h1 className={`font-pixel text-terminal-green tracking-wide drop-shadow-[0_0_5px_rgba(12,250,0,0.5)]
                            ${isPlayRoute ? 'text-sm' : 'text-2xl'}`}>
                            GIGA.PE
                        </h1>
                    </Link>
                    
                    {/* ゲームプレイページでは非表示 */}
                    {!isPlayRoute && (
                        <div className="hidden sm:block text-sm font-mono text-terminal-green/80">
                            <span className="mr-2">&gt;</span>
                            <span className="animate-blink">_</span>
                            <span> IT用語パズルゲーム</span>
                        </div>
                    )}
                    
                    {/* ゲームプレイページには最小限の情報を表示 */}
                    {isPlayRoute && !isSmallScreen && (
                        <div className="text-xs font-mono text-terminal-green/60">
                            <span className="hidden sm:inline mr-1">&gt; PLAYING</span>
                            <span className="animate-blink">_</span>
                        </div>
                    )}
                </div>
            </header>
            
            <main className={`flex-grow relative z-10 ${hideHeader ? 'pt-0' : isPlayRoute ? 'pt-1' : 'pt-2'}`}>
                {children}
            </main>
            
            {/* フッター: 小さい画面 + ゲームプレイ時は非表示 */}
            <footer className={`bg-black/70 border-t border-terminal-green/30 text-center text-terminal-green/50 text-xs font-mono relative z-10
                ${hideHeader ? 'h-0 overflow-hidden border-t-0' : isPlayRoute ? 'py-1' : 'py-2'}`}>
                {isPlayRoute ? (
                    <p className="text-[10px]">GIGA.PE</p>
                ) : (
                    <p>© 2025 GIGA.PE <span className="hidden sm:inline">- システムバージョン 1.0.0</span></p>
                )}
            </footer>
        </div>
    );
}
