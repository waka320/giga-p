"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Terminal, Code, Database, Server, Trophy, Book, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function GameStartPage() {
    const router = useRouter();
    const [showTitle, setShowTitle] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // ゲーム開始処理
    const startGame = () => {
        router.push("/game/play");
    };

    // ページロード時のアニメーション順序制御
    useEffect(() => {
        const titleTimer = setTimeout(() => setShowTitle(true), 500);
        const contentTimer = setTimeout(() => setShowContent(true), 1200);

        return () => {
            clearTimeout(titleTimer);
            clearTimeout(contentTimer);
        };
    }, []);

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-900 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* レトロシューティングゲーム風背景エフェクト */}
            <RetroShootingBackground />

            {/* スキャンライン効果 */}
            <div className="scanlines absolute inset-0 pointer-events-none z-10"></div>

            {/* コンテンツ */}
            <div className="relative z-20 max-w-2xl w-full">
                {/* タイトル */}
                <AnimatePresence>
                    {showTitle && (
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <motion.h1
                                className="text-3xl sm:text-5xl font-pixel mb-3 text-center text-terminal-green drop-shadow-[0_0_10px_rgba(12,250,0,0.7)]"
                                animate={{
                                    textShadow: [
                                        "0 0 7px rgba(12,250,0,0.6)",
                                        "0 0 10px rgba(12,250,0,0.8)",
                                        "0 0 7px rgba(12,250,0,0.6)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                アクロアタック.
                            </motion.h1>
                            <motion.p
                                className="text-lg sm:text-xl text-center text-terminal-green/80 font-mono"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Acro_Attack
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* ゲームスタートボタン */}
                            <motion.button
                                className="group relative px-10 py-4 bg-black/70 border-2 border-terminal-green text-terminal-green font-pixel rounded-md shadow-[0_0_15px_rgba(12,250,0,0.3)] hover:bg-terminal-green/20 transition-colors mb-8 overflow-hidden"
                                onClick={startGame}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    <Play className="mr-2 h-5 w-5" />
                                    &gt;_ GAME START
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-terminal-green/10 z-0"
                                    initial={{ width: "0%" }}
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.button>

                            {/* リーダーボードリンクとIT用語辞典リンク */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <Link
                                    href="/leaderboard"
                                    className="bg-black/40 hover:bg-black/60 border border-terminal-green/30 p-3 rounded-md transition-all flex items-center gap-2 text-terminal-green"
                                >
                                    <Trophy className="h-5 w-5" />
                                    <span>リーダーボードを見る</span>
                                </Link>

                                <Link
                                    href="/dictionary"
                                    className="bg-black/40 hover:bg-black/60 border border-terminal-green/30 p-3 rounded-md transition-all flex items-center gap-2 text-terminal-green"
                                >
                                    <Book className="h-5 w-5" />
                                    <span>IT用語辞典を見る</span>
                                </Link>

                                <Link
                                    href="/help"
                                    className="bg-black/40 hover:bg-black/60 border border-terminal-green/30 p-3 rounded-md transition-all flex items-center gap-2 text-terminal-green"
                                >
                                    <HelpCircle className="h-5 w-5" />
                                    <span>困った時は</span>
                                </Link>
                            </div>

                            {/* 遊び方パネル */}
                            <motion.div
                                className="w-full bg-black/80 border-2 border-terminal-green rounded-lg p-5 font-mono text-terminal-green/90 scanlines shadow-[0_0_15px_rgba(12,250,0,0.2)] relative"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-xl font-pixel mb-4 flex items-center">
                                    <Terminal className="mr-2 h-4 w-4" />
                                    &gt; game_instruction.exe
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <InstructionItem
                                        icon={<Code size={16} />}
                                        text="5×5のアルファベットからIT用語の略語を見つけよう"
                                    />
                                    <InstructionItem
                                        icon={<Clock size={16} />}
                                        text="制限時間は120秒"
                                    />
                                    <InstructionItem
                                        icon={<Database size={16} />}
                                        text="単語が長いほど高得点"
                                    />
                                    <InstructionItem
                                        icon={<Server size={16} />}
                                        text="連続正解でコンボボーナス獲得！"
                                    />
                                </div>

                                {/* ドット走査線 */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-terminal-green/50"
                                    animate={{ top: ["100%", "0%"] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                            </motion.div>

                            {/* フッター情報 */}
                            <motion.div
                                className="mt-6 text-xs text-terminal-green/60 font-mono text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <p>© 2025 ACRO_ATTACK v1.1 SYSTEM ONLINE</p>
                                <p>{`{ STATUS:READY }`} {`[ SERVER:ACTIVE ]`}</p>

                                <div className="mt-3 flex flex-wrap justify-center gap-4">
                                    <a
                                        href="https://github.com/waka320/giga-p"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-terminal-green/70 hover:text-terminal-green/90 transition-colors flex items-center"
                                    >
                                        <Terminal className="h-3 w-3 mr-1" />
                                        GitHub
                                    </a>
                                    <a
                                        href="https://wakaport.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-terminal-green/70 hover:text-terminal-green/90 transition-colors flex items-center"
                                    >
                                        <Code className="h-3 w-3 mr-1" />
                                        @waka320
                                    </a>
                                    <Link
                                        href="/terms"
                                        className="text-terminal-green/70 hover:text-terminal-green/90 transition-colors flex items-center"
                                    >
                                        <Shield className="h-3 w-3 mr-1" />
                                        利用規約
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// 遊び方項目コンポーネント
function InstructionItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <motion.div
            className="flex items-start"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: Math.random() * 0.5 }}
        >
            <div className="mr-2 mt-0.5 text-terminal-green/80">{icon}</div>
            <div className="terminal-command relative overflow-hidden">
                <span className="typing-effect">$ {text}</span>
            </div>
        </motion.div>
    );
}

// 時計アイコンコンポーネント
function Clock({ size = 24 }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// レトロシューティングゲーム風背景
function RetroShootingBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // ウィンドウリサイズ対応
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // 型定義
        interface Star {
            x: number;
            y: number;
            size: number;
        }

        interface StarLayer {
            stars: Star[];
            count: number;
            speed: number;
            size: number;
            color: string;
        }

        interface GridLine {
            x: number;
            y: number;
        }

        interface GridLines {
            horizontal: GridLine[];
            vertical: GridLine[];
            speed: number;
            spacing: number;
            color: string;
        }

        interface CyberObject {
            x: number;
            y: number;
            type: number;
            rotation: number;
            rotationSpeed: number;
            size: number;
            speed: number;
        }

        // 星々のレイヤーの設定
        const layers: StarLayer[] = [
            { stars: [], count: 100, speed: 0.2, size: 1, color: '#0a1f0a' },  // 背景の星 (暗いグリーン)
            { stars: [], count: 70, speed: 0.5, size: 1.5, color: '#0CFA00' }, // 中間レイヤーの星 (明るいグリーン)
            { stars: [], count: 40, speed: 1, size: 2, color: '#84ff84' },     // 前景の星 (さらに明るいグリーン)
            { stars: [], count: 15, speed: 1.5, size: 3, color: '#ffffff' }    // 最前面の星 (白)
        ];

        // 六角形グリッドの設定
        const gridLines: GridLines = {
            horizontal: [],
            vertical: [],
            speed: 0.3,
            spacing: 80,
            color: 'rgba(12, 250, 0, 0.15)'
        };

        // 水平グリッドラインの生成
        for (let y = -gridLines.spacing; y <= canvas.height + gridLines.spacing; y += gridLines.spacing) {
            gridLines.horizontal.push({ y, x: 0 });
        }

        // 垂直グリッドラインの生成
        for (let x = -gridLines.spacing; x <= canvas.width + gridLines.spacing; x += gridLines.spacing) {
            gridLines.vertical.push({ x, y: 0 });
        }

        // レイヤーごとに星を生成
        layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                layer.stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * layer.size + 0.5,
                });
            }
        });

        // サイバーオブジェクトの設定
        const cyberObjects: CyberObject[] = [];
        for (let i = 0; i < 12; i++) {
            cyberObjects.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                type: Math.floor(Math.random() * 3),
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 0.5 + 0.2
            });
        }

        // アニメーションループ
        function animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 背景を暗い色で塗りつぶし
            ctx.fillStyle = '#041204';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // グリッドの描画と移動
            ctx.strokeStyle = gridLines.color;
            ctx.lineWidth = 1;

            // 水平グリッドライン
            gridLines.horizontal.forEach(line => {
                line.y += gridLines.speed;
                if (line.y > canvas.height + gridLines.spacing) {
                    line.y = -gridLines.spacing;
                }

                ctx.beginPath();
                ctx.moveTo(0, line.y);
                ctx.lineTo(canvas.width, line.y);
                ctx.stroke();
            });

            // 垂直グリッドライン
            gridLines.vertical.forEach(line => {
                line.x += gridLines.speed;
                if (line.x > canvas.width + gridLines.spacing) {
                    line.x = -gridLines.spacing;
                }

                ctx.beginPath();
                ctx.moveTo(line.x, 0);
                ctx.lineTo(line.x, canvas.height);
                ctx.stroke();
            });

            // 星の描画と移動（レイヤーごと）
            layers.forEach(layer => {
                ctx.fillStyle = layer.color;

                layer.stars.forEach(star => {
                    star.y += layer.speed;

                    // 画面外に出たら上に戻す
                    if (star.y > canvas.height) {
                        star.y = 0;
                        star.x = Math.random() * canvas.width;
                    }

                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            // サイバーオブジェクトの描画
            cyberObjects.forEach(obj => {
                obj.y += obj.speed;
                obj.rotation += obj.rotationSpeed;

                if (obj.y > canvas.height + obj.size) {
                    obj.y = -obj.size;
                    obj.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation);

                // オブジェクトの種類に応じて描画
                switch (obj.type) {
                    case 0: // 六角形
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(12, 250, 0, 0.3)';
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 6; i++) {
                            const angle = i * Math.PI / 3;
                            const x = Math.cos(angle) * obj.size;
                            const y = Math.sin(angle) * obj.size;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 1: // メッシュグリッド
                        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
                        ctx.lineWidth = 0.5;
                        const gridSize = obj.size / 3;

                        for (let x = -obj.size; x <= obj.size; x += gridSize) {
                            ctx.beginPath();
                            ctx.moveTo(x, -obj.size);
                            ctx.lineTo(x, obj.size);
                            ctx.stroke();
                        }

                        for (let y = -obj.size; y <= obj.size; y += gridSize) {
                            ctx.beginPath();
                            ctx.moveTo(-obj.size, y);
                            ctx.lineTo(obj.size, y);
                            ctx.stroke();
                        }
                        break;
                    case 2: // サイバーシンボル
                        ctx.strokeStyle = 'rgba(255, 0, 255, 0.25)';
                        ctx.lineWidth = 1;

                        // 円と内部の十字線
                        ctx.beginPath();
                        ctx.arc(0, 0, obj.size / 2, 0, Math.PI * 2);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(-obj.size / 2, 0);
                        ctx.lineTo(obj.size / 2, 0);
                        ctx.moveTo(0, -obj.size / 2);
                        ctx.lineTo(0, obj.size / 2);
                        ctx.stroke();
                        break;
                }

                ctx.restore();
            });

            requestAnimationFrame(() => animate(ctx, canvas));
        }

        animate(ctx, canvas);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
