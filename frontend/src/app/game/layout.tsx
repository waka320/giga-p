"use client";
import Link from "next/link";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-matrix-dark bg-noise relative overflow-hidden">
            {/* グリッドパターン背景 */}
            <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
            
            {/* スキャンラインエフェクト - pointerEventsをnoneに設定して操作を妨げないようにする */}
            <div className="absolute inset-0 scanlines pointer-events-none"></div>
            
            <header className="bg-black/70 border-b border-terminal-green/30 py-3 px-6 relative z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/game/start">
                        <h1 className="text-2xl font-pixel text-terminal-green tracking-wide drop-shadow-[0_0_5px_rgba(12,250,0,0.5)]">
                            GIGA.PE
                        </h1>
                    </Link>
                    <div className="hidden sm:block text-sm font-mono text-terminal-green/80">
                        <span className="mr-2">&gt;</span>
                        <span className="animate-blink">_</span>
                        <span> IT用語パズルゲーム</span>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow relative z-10">
                {children}
            </main>
            
            <footer className="bg-black/70 border-t border-terminal-green/30 py-2 text-center text-terminal-green/50 text-xs font-mono relative z-10">
                <p>© 2025 GIGA.PE <span className="hidden sm:inline">- システムバージョン 1.0.0</span></p>
            </footer>
        </div>
    );
}
