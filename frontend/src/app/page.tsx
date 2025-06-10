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
      <header className="w-full max-w-6xl mx-auto pt-4 md:pt-6 px-4 relative z-20">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl font-pixel text-terminal-green drop-shadow-[0_0_10px_rgba(12,250,0,0.7)]"
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
          <main className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8 relative z-20 flex-grow">
            {/* モバイル向け導入セクション - モバイル表示で最初に配置 */}
            <motion.div
              className="md:hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-pixel text-xl sm:text-2xl text-terminal-green mb-3 flex items-center">
                <Code className="mr-2 h-5 w-5" />
                VR、SNS、AI...どれだけ知ってる？
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                「アクロアタック.」はIT用語の頭文字（アクロニム）を探して高得点を目指す、
                脳トレ×知識×戦略のパズルゲームです。
              </p>

              {/* モバイル向けゲーム開始ボタン */}
              <motion.button
                onClick={navigateToGame}
                className="w-full group relative px-4 py-3 bg-black/70 border-2 border-terminal-green text-terminal-green font-pixel rounded-md shadow-[0_0_15px_rgba(12,250,0,0.3)] hover:bg-terminal-green/20 transition-colors overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 flex items-center justify-center text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  ゲームを始める
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
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* メインプロモーション */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-4 md:p-6">
                  {/* PC向けゲーム説明 - モバイルでは非表示 */}
                  <div className="hidden md:block mb-6">
                    <h2 className="font-pixel text-2xl md:text-3xl text-terminal-green mb-4 flex items-center">
                      <Code className="mr-2 h-6 w-6" />
                      VR、SNS、AI...どれだけ知ってる？
                    </h2>
                    <p className="text-gray-300 mb-4">
                      「アクロアタック.」はIT用語の頭文字（アクロニム）を探して高得点を目指す、
                      脳トレ×知識×戦略のパズルゲームです。制限時間2分の中で、どれだけ多くの用語を見つけられるか挑戦しよう！
                    </p>

                    {/* PC向けプレイボタン */}
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
                  </div>

                  {/* ゲームスクリーンショット - 両方で表示するが先に配置 */}
                  <motion.div
                    className="mb-6 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div
                      className="relative mx-auto overflow-hidden rounded-md border-2 border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.2)]"
                      style={{
                        maxWidth: "min(100%, 926px)",
                        paddingTop: "80.5%" // アスペクト比 746/926 = 0.805
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
                      <div className="absolute bottom-0 left-0 right-0 py-1 px-2 md:py-1.5 md:px-3 bg-black/70 text-xs text-terminal-green font-mono flex items-center justify-between z-20">
                        <span className="truncate">&gt; ACRO_ATTACK.exe</span>
                        <span className="opacity-70 text-2xs md:text-xs">[スクリーンショット]</span>
                      </div>
                      <div className="scanlines absolute inset-0 pointer-events-none z-30 opacity-30"></div>
                    </div>
                  </motion.div>

                  {/* モバイル用ナビゲーション - モバイルでのみ表示 */}
                  <div className="flex flex-wrap justify-center gap-2 md:hidden">
                    <NavButton href="/dictionary" icon={<Book />} text="IT用語辞典" />
                    <NavButton href="/leaderboard" icon={<Trophy />} text="ランキング" />
                    <NavButton href="/help" icon={<HelpCircle />} text="ヘルプ" />
                  </div>
                </div>
              </motion.div>

              {/* サイドバー：基本ルール */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {/* ルールセクション */}
                <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-4 md:p-6 mb-4">
                  <h2 className="font-pixel text-lg md:text-xl text-terminal-green mb-3 md:mb-4 flex items-center">
                    <Terminal className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    &gt; how_to_play.exe
                  </h2>

                  <div className="space-y-3">
                    <RuleItem
                      number="①"
                      title="用語を探して選択！"
                      description="5×5のグリッドに並んだアルファベットから、「HTML」や「AI」などのIT用語を見つけ出そう。隣接していなくてもOK！"
                    />
                    <RuleItem
                      number="②"
                      title="用語を決定！"
                      description="選択したら、決定ボタン（Space/Enterキー）を押そう。正解するとスコアとコンボが増加！"
                    />
                    <RuleItem
                      number="③"
                      title="コンボに注目！"
                      description="連続正解でコンボが増加！コンボ数が高いほど得点倍率もアップ！"
                    />
                    <RuleItem
                      number="④"
                      title="ボーナスを狙え！"
                      description="残り5文字以下でボーナス獲得！全消しで1000点！"
                    />

                    <div className="mt-3 pt-2 border-t border-terminal-green/20">
                      <Link
                        href="/help"
                        className="text-terminal-green hover:text-terminal-green/80 text-xs md:text-sm flex items-center justify-center mt-1"
                      >
                        <HelpCircle className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                        詳しいルールを見る
                        <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* スコア計算 */}
                <motion.div
                  className="bg-black/80 border-2 border-terminal-green rounded-lg p-4 md:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h2 className="font-pixel text-lg md:text-xl text-terminal-green mb-3 md:mb-4 flex items-center">
                    <Database className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    &gt; score_calculation.js
                  </h2>

                  <div className="mt-3 text-2xs md:text-sm text-gray-300">
                    <p className="mb-1.5">
                      <span className="text-terminal-green font-semibold">ボーナス：</span> コンボ上昇、残り5文字以下で最大250点、全消しで1000点！
                    </p>
                    <p className="italic text-gray-400 text-2xs md:text-xs">
                      テクニック：短い単語でコンボを稼いでから長い単語を獲得すると高得点！
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* 下部セクション */}
            <motion.div
              className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {/* IT用語辞典について */}
              <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-4 md:p-6">
                <h2 className="font-pixel text-lg md:text-xl text-terminal-green mb-3 md:mb-4 flex items-center">
                  <Book className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  &gt; dictionary_info.md
                </h2>
                <div className="text-gray-300 text-xs md:text-sm">
                  <p className="mb-3">
                    アクロアタックでは<span className="text-terminal-green">1,200語以上のIT関連用語</span>を収録！
                    これらはWikipediaやデジタル庁、総務省などの公的資料を参照しています。
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/dictionary"
                      className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-3 py-2 rounded-sm text-xs md:text-sm transition-colors flex items-center w-fit"
                    >
                      <Book className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                      IT用語辞典を見る
                    </Link>
                  </div>
                </div>
              </div>

              {/* テクニカル情報 */}
              <div className="bg-black/80 border-2 border-terminal-green rounded-lg p-4 md:p-6">
                <h2 className="font-pixel text-lg md:text-xl text-terminal-green mb-3 md:mb-4 flex items-center">
                  <Code className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  &gt; technical_info.txt
                </h2>
                <div className="text-gray-300 text-xs md:text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <TechInfoItem icon={<GitBranch />} label="フロントエンド" value="Next.js / TypeScript" />
                    <TechInfoItem icon={<Server />} label="バックエンド" value="FastAPI" />
                    <TechInfoItem icon={<Database />} label="データベース" value="Azure SQL" />
                    <TechInfoItem icon={<RefreshCcw />} label="制作期間" value="3週間が経った" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 pt-2 border-t border-terminal-green/20 text-2xs md:text-xs">
                    <a
                      href="https://github.com/waka320/giga-p"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center"
                    >
                      <Terminal className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> GitHub
                    </a>
                    <a
                      href="https://x.com/waka320port"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center"
                    >
                      <XIcon className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> @waka320port
                    </a>
                    <Link
                      href="/terms"
                      className="text-terminal-green hover:text-terminal-green/80 flex items-center"
                    >
                      <Shield className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 利用規約
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
        className="w-full max-w-6xl mx-auto mt-auto py-3 md:py-4 px-4 border-t border-terminal-green/20 text-gray-400 text-2xs md:text-xs font-mono relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="text-terminal-green/40">
            © 2025 アクロアタック. - IT用語パズルゲーム
          </div>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            <Link
              href="/game/start"
              className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
            >
              <Play className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
              ゲーム開始
            </Link>
            <Link
              href="/leaderboard"
              className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
            >
              <Trophy className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
              ランキング
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
      className="bg-black/40 hover:bg-black/60 border border-terminal-green/30 px-2 py-1.5 rounded-md transition-all flex items-center gap-1.5 text-terminal-green text-xs"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}


// ルールアイテム
function RuleItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-terminal-green/10 p-2.5 md:p-3 rounded border border-terminal-green/30">
      <h3 className="text-terminal-green font-semibold mb-1 text-xs md:text-sm flex items-center">
        <span className="bg-terminal-green/20 w-5 h-5 flex items-center justify-center rounded-full mr-1.5 text-2xs md:text-xs">
          {number}
        </span>
        {title}
      </h3>
      <p className="text-gray-300 text-2xs md:text-sm">
        {description}
      </p>
    </div>
  );
}

// 技術情報アイテム
function TechInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-terminal-green/70 flex-shrink-0 mt-0.5">
        <div className="w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-terminal-green/50 text-2xs md:text-xs truncate">
          {label}
        </div>
        <div className="text-terminal-green font-mono text-2xs md:text-xs font-medium">
          {value}
        </div>
      </div>
    </div>
  );
}
