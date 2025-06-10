"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  Terminal,
  Code,
  Database,
  Server,
  Trophy,
  Book,
  Shield,
  HelpCircle,
  Zap,
  Clock,
  ArrowRight,
  X as XIcon,
  RefreshCcw,
  GitBranch,
} from "lucide-react";
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  // ナビゲーション処理
  const navigateToGame = () => {
    router.push("/game/start");
  };

  // ページロード時のアニメーション
  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(contentTimer);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* サイバー背景 */}
      <CyberPsychedelicBackground />

      {/* スキャンライン効果 */}
      <div className="scanlines absolute inset-0 pointer-events-none z-10"></div>

      {/* ヘッダー */}
      <header className="w-full max-w-6xl mx-auto pt-6 px-4 relative z-20">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-3xl md:text-5xl font-pixel text-terminal-green drop-shadow-[0_0_10px_rgba(12,250,0,0.7)]"
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

          <nav className="hidden md:flex gap-6">
            <NavLink href="/game/start" icon={<Play className="h-4 w-4 mr-1.5" />} text="ゲーム開始" />
            <NavLink href="/dictionary" icon={<Book className="h-4 w-4 mr-1.5" />} text="IT用語辞典" />
            <NavLink href="/leaderboard" icon={<Trophy className="h-4 w-4 mr-1.5" />} text="ランキング" />
            <NavLink href="/help" icon={<HelpCircle className="h-4 w-4 mr-1.5" />} text="ヘルプ" />
          </nav>
        </motion.div>
      </header>

      <AnimatePresence>
        {showContent && (
          <main className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-20 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* メインプロモーション */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-6 h-full">
                  <div className="flex flex-col h-full">
                    {/* ゲーム説明 */}
                    <div className="mb-6">
                      <h2 className="font-pixel text-2xl md:text-3xl text-terminal-green mb-4 flex items-center">
                        <Code className="mr-2 h-6 w-6" />
                        VR、SNS、AI...どれだけ知ってる？
                      </h2>
                      <p className="text-gray-300 mb-4">
                        「アクロアタック.」はIT用語の頭文字（アクロニム）を探して高得点を目指す、
                        脳トレ×知識×戦略のパズルゲームです。制限時間2分の中で、どれだけ多くの用語を見つけられるか挑戦しよう！
                      </p>
                      {/* プレイボタン */}
                    <div className="mt-auto flex flex-col items-center">
                      <motion.button
                        onClick={navigateToGame}
                        className="group relative px-8 py-4 bg-black/70 border-2 border-terminal-green text-terminal-green font-pixel rounded-md shadow-[0_0_15px_rgba(12,250,0,0.3)] hover:bg-terminal-green/20 transition-colors w-full md:max-w-md mx-auto overflow-hidden"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="relative z-10 flex items-center justify-center text-xl">
                          <Play className="mr-3 h-6 w-6" />
                          &gt;_ ゲームをプレイする
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-terminal-green/10 z-0"
                          initial={{ width: "0%" }}
                          animate={{ width: ["0%", "100%", "0%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.button>

                      {/* モバイル用ナビゲーション */}
                      <div className="flex flex-wrap justify-center gap-3 mt-6 md:hidden w-full">
                        <NavButton href="/dictionary" icon={<Book />} text="IT用語辞典" />
                        <NavButton href="/leaderboard" icon={<Trophy />} text="ランキング" />
                        <NavButton href="/help" icon={<HelpCircle />} text="ヘルプ" />
                      </div>
                    </div>

                      {/* ゲーム特徴 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FeatureCard
                          icon={<Clock />}
                          title="制限時間2分"
                          description="短い時間で素早く用語を探す緊張感！"
                        />
                        <FeatureCard
                          icon={<Zap />}
                          title="コンボシステム"
                          description="連続正解でスコア倍率アップ！"
                        />
                        <FeatureCard
                          icon={<Database />}
                          title="1,200語以上"
                          description="豊富なIT用語辞書で遊びながら学習！"
                        />
                        <FeatureCard
                          icon={<Terminal />}
                          title="サイバーな世界観"
                          description="レトロで未来的なビジュアル！"
                        />
                      </div>
                    </div>

                    {/* ゲームスクリーンショット */}
                    <motion.div
                      className="mt-8 mb-6 relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div
                        className="relative mx-auto overflow-hidden rounded-md border-2 border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.2)]"
                        style={{
                          maxWidth: "min(100%, 926px)",
                          // アスペクト比を維持するためのパディング (746/926 = 0.805 または約80.5%)
                          paddingTop: "80.5%"
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10 z-10"></div>
                        <Image
                          src="/game_screen.png"
                          alt="アクロアタックのゲーム画面 - 5×5グリッドでIT用語を探すゲームプレイの様子"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 926px"
                          priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 py-1.5 px-3 bg-black/70 text-xs text-terminal-green font-mono flex items-center justify-between z-20">
                          <span>&gt; ACRO_ATTACK.exe --gameplay_session</span>
                          <span className="opacity-70">[スクリーンキャプチャ]</span>
                        </div>
                        <div className="scanlines absolute inset-0 pointer-events-none z-30 opacity-30"></div>
                      </div>
                      <p className="text-center text-xs text-terminal-green/60 mt-2 font-mono">
                        ※ 実際のゲームプレイ画面 - US（アメリカ）のIT用語を見つけているところ
                      </p>
                    </motion.div>

                    
                  </div>
                </div>
              </motion.div>

              {/* サイドバー：基本ルール */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-6">
                  <h2 className="font-pixel text-xl text-terminal-green mb-4 flex items-center">
                    <Terminal className="mr-2 h-5 w-5" />
                    &gt; how_to_play.exe
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-terminal-green/10 p-3 rounded border border-terminal-green/30">
                      <h3 className="text-terminal-green font-semibold mb-2 text-sm">① 用語を探して選択！</h3>
                      <p className="text-gray-300 text-sm">
                        5×5のグリッドに並んだアルファベットから、「HTML」や「AI」などの
                        IT用語を見つけ出そう。隣接していなくても選択OK！
                      </p>
                    </div>

                    <div className="bg-terminal-green/10 p-3 rounded border border-terminal-green/30">
                      <h3 className="text-terminal-green font-semibold mb-2 text-sm">② 用語を決定！</h3>
                      <p className="text-gray-300 text-sm">
                        選択したら、決定ボタン（Space/Enterキー）を押そう。
                        正解するとスコアとコンボが増えるよ！
                      </p>
                    </div>

                    <div className="bg-terminal-green/10 p-3 rounded border border-terminal-green/30">
                      <h3 className="text-terminal-green font-semibold mb-2 text-sm">③ コンボに注目！</h3>
                      <p className="text-gray-300 text-sm">
                        連続正解でコンボが増加！コンボ数が高いほど得点倍率もアップ！
                        コンボを維持して高得点を狙おう。
                      </p>
                    </div>

                    <div className="bg-terminal-green/10 p-3 rounded border border-terminal-green/30">
                      <h3 className="text-terminal-green font-semibold mb-2 text-sm">④ ボーナスを狙え！</h3>
                      <p className="text-gray-300 text-sm">
                        残りアルファベットが5文字以下でボーナス獲得！
                        すべての文字を使い切ると全消しボーナスで1000点！
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-terminal-green/20">
                      <Link
                        href="/help"
                        className="text-terminal-green hover:text-terminal-green/80 text-sm flex items-center justify-center mt-2"
                      >
                        <HelpCircle className="h-4 w-4 mr-1.5" />
                        詳しいルールを見る
                        <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* スコア計算 */}
                <motion.div
                  className="bg-black/80 border-2 border-terminal-green rounded-lg p-6 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h2 className="font-pixel text-xl text-terminal-green mb-4 flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    &gt; score_calculation.js
                  </h2>


                  <div className="mt-4 text-sm text-gray-300">
                    <p className="mb-2">
                      <span className="text-terminal-green font-semibold">ボーナス：</span> コンボ上昇、残り5文字以下で最大250点、全消しで1000点！
                    </p>
                    <p className="italic text-gray-400 text-xs">
                      テクニック：短い単語でコンボを稼いでから長い単語を獲得すると高得点！
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* 下部セクション */}
            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {/* IT用語辞典について */}
              <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-6">
                <h2 className="font-pixel text-xl text-terminal-green mb-4 flex items-center">
                  <Book className="mr-2 h-5 w-5" />
                  &gt; dictionary_info.md
                </h2>
                <div className="text-gray-300 text-sm">
                  <p className="mb-3">
                    アクロアタックでは<span className="text-terminal-green">1,200語以上のIT関連用語</span>を収録！
                    これらはWikipediaやデジタル庁、総務省などの公的資料を参照して厳選されています。
                  </p>
                  <p className="mb-3">
                    用語辞典では全用語の意味や詳細を確認できるほか、効率的な検索も可能です。
                    知らない単語に出会ったらその場で学習しましょう！
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href="/dictionary"
                      className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-3 py-2 rounded-sm text-sm transition-colors flex items-center"
                    >
                      <Book className="h-4 w-4 mr-1.5" />
                      IT用語辞典を見る
                    </Link>
                  </div>
                </div>
              </div>

              {/* テクニカル情報 */}
              <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-6">
                <h2 className="font-pixel text-xl text-terminal-green mb-4 flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  &gt; technical_info.txt
                </h2>
                <div className="text-gray-300 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <TechInfoItem icon={<GitBranch />} label="フロントエンド" value="Next.js / TypeScript" />
                    <TechInfoItem icon={<Server />} label="バックエンド" value="FastAPI" />
                    <TechInfoItem icon={<Database />} label="データベース" value="Azure SQL Database" />
                    <TechInfoItem icon={<RefreshCcw />} label="開発期間" value="1週間" />
                  </div>
                  <p className="mt-3 text-xs text-gray-400 italic">
                    ※ 大学4年生の個人開発作品です。生成AIとクラウド技術の進化により短期開発を実現しました。
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-2 border-t border-terminal-green/20">
                    <a
                      href="https://github.com/waka320/giga-p"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center text-xs"
                    >
                      <Terminal className="h-3 w-3 mr-1" /> GitHub
                    </a>
                    <a
                      href="https://x.com/waka320port"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center text-xs"
                    >
                      <XIcon className="h-3 w-3 mr-1" /> @waka320port
                    </a>
                    <Link
                      href="/terms"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center text-xs"
                    >
                      <Shield className="h-3 w-3 mr-1" /> 利用規約
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        )}
      </AnimatePresence>

      {/* フッター */}
      <motion.footer
        className="w-full max-w-6xl mx-auto mt-auto py-4 px-4 border-t border-terminal-green/20 text-gray-400 text-xs font-mono relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="text-terminal-green/40">
            © 2025 アクロアタック. - IT用語パズルゲーム
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/game/start"
              className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
            >
              <Play className="h-3 w-3 mr-1" />
              ゲーム開始
            </Link>
            <Link
              href="/leaderboard"
              className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
            >
              <Trophy className="h-3 w-3 mr-1" />
              ランキング
            </Link>
            <Link
              href="/help"
              className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              ヘルプ
            </Link>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

// ナビゲーションリンク
function NavLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      href={href}
      className="text-terminal-green hover:text-terminal-green/80 flex items-center text-sm"
    >
      {icon}
      {text}
    </Link>
  );
}

// モバイル用ナビボタン
function NavButton({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      href={href}
      className="bg-black/40 hover:bg-black/60 border border-terminal-green/30 px-3 py-2 rounded-md transition-all flex items-center gap-2 text-terminal-green text-sm"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

// 特徴カード
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-terminal-green/10 p-3 rounded border border-terminal-green/30 flex items-start">
      <div className="text-terminal-green mr-3 pt-1">{icon}</div>
      <div>
        <h3 className="text-terminal-green font-semibold text-sm">{title}</h3>
        <p className="text-gray-400 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}

// 技術情報アイテム
function TechInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center">
      <div className="text-terminal-green/70 mr-2">{icon}</div>
      <div>
        <div className="text-terminal-green/50 text-xs">{label}</div>
        <div className="text-terminal-green font-mono text-xs">{value}</div>
      </div>
    </div>
  );
}
