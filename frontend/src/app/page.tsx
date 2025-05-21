"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Play, Trophy, Book, Info, Code, GithubIcon, FileText, Heart, Shield, Globe } from "lucide-react";
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";

export default function HomePage() {
  const router = useRouter();
  const [showAbout, setShowAbout] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  const navigateToGame = () => {
    router.push("/game/start");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* サイバー背景 */}
      <CyberPsychedelicBackground variant="matrix" />

      {/* スキャンライン効果 */}
      <div className="scanlines absolute inset-0 pointer-events-none z-10"></div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-10 h-full flex flex-col z-20">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-10"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-pixel mb-3 text-center text-terminal-green drop-shadow-[0_0_10px_rgba(12,250,0,0.7)]"
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
            IT用語パズルゲーム
          </motion.p>
        </motion.div>

        {/* メインコンテンツ */}
        <div className="flex-grow">
          {/* メインCTA - ゲーム開始ボタン */}
          <motion.div
            className="flex justify-center mb-8 md:mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={navigateToGame}
              className="relative bg-black/70 text-terminal-green border-2 border-terminal-green px-8 py-4 rounded-md font-pixel text-xl md:text-2xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(12,250,0,0.3)] w-full max-w-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Play className="mr-2 h-5 w-5" />
                &gt;_ ゲームスタート
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
          </motion.div>

          {/* 機能グリッド */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* リーダーボード */}
            <Link href="/leaderboard" className="group">
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <Trophy className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">リーダーボード</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">ハイスコアと他のプレイヤーのランキングを確認できます。</p>
              </div>
            </Link>

            {/* 用語辞典 */}
            <Link href="/dictionary" className="group">
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <Book className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">用語辞典</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">ゲームに登場するIT用語や略語の詳細な説明を確認できます。知識を深めるために活用してください。</p>
              </div>
            </Link>

            {/* 遊び方 */}
            <div className="group cursor-pointer" onClick={() => setShowAbout(true)}>
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <Info className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">遊び方・紹介</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">ゲームのルールや操作方法、スコア計算方法など、アクロアタックの基本情報を確認できます。</p>
              </div>
            </div>

            {/* GitHub */}
            <a href="https://github.com/yourusername/acro-attack" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <GithubIcon className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">GitHubリポジトリ</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">アクロアタックのソースコードと開発情報を確認できます。スターをいただけるととても嬉しいです。</p>
              </div>
            </a>

            {/* 開発者情報 */}
            <div className="group cursor-pointer" onClick={() => setShowAbout(true)}>
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <Code className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">開発者情報</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">アクロアタックの開発情報について。</p>
              </div>
            </div>

            {/* 法的情報 */}
            <div className="group cursor-pointer" onClick={() => setShowLegal(true)}>
              <div className="bg-black/60 border border-terminal-green/40 hover:border-terminal-green/70 rounded-md p-4 md:p-6 h-full transition-all hover:bg-black/80 hover:shadow-[0_0_10px_rgba(12,250,0,0.2)]">
                <div className="flex items-center gap-3 mb-2 text-terminal-green group-hover:text-terminal-green/100">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-pixel text-lg">法的情報</h3>
                </div>
                <p className="text-gray-400 text-sm font-mono">ライセンス、プライバシーポリシー、利用規約などの法的情報を確認できます。</p>
              </div>
            </div>
          </motion.div>

          {/* ゲーム紹介 */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="bg-black/60 border border-terminal-green/30 rounded-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-pixel text-terminal-green mb-4 flex items-center">
                <Terminal className="mr-2 h-5 w-5" />
                &gt; about_game.exe
              </h2>
              <div className="space-y-3 text-gray-300 font-mono text-sm leading-relaxed">
                <p>
                  <span className="text-terminal-green">$</span> アクロアタック.はIT用語の略語（アクロニム）を探すパズルゲームです。
                </p>
                <p>
                  <span className="text-terminal-green">$</span> 5×5のグリッドに並んだアルファベットから、HTTP、CSS、SQLなどのIT用語を見つけ出します。
                </p>
                <p>
                  <span className="text-terminal-green">$</span> 単語が長いほど高得点！連続で単語を見つけるとコンボボーナスも発生します。
                </p>
                <p>
                  <span className="text-terminal-green">$</span> 制限時間は60秒。できるだけ多くの用語を見つけてハイスコアを目指しましょう。
                </p>
                <div className="pt-2">
                  <motion.button
                    onClick={navigateToGame}
                    className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play className="h-4 w-4" />
                    ゲームをプレイする
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* フッター */}
        <motion.div
          className="mt-auto pt-4 border-t border-terminal-green/20 text-gray-400 text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              © 2025 アクロアタック. - IT用語パズルゲーム
            </div>
            <div className="flex gap-4 flex-wrap">
              <a 
                href="https://github.com/waka320/acro-attack" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
              >
                <GithubIcon className="h-3 w-3 mr-1" />
                リポジトリ
              </a>
              <a 
                href="https://wakaport.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
              >
                <Globe className="h-3 w-3 mr-1" />
                開発者
              </a>
              <Link
                href="/terms"
                className="text-terminal-green/70 hover:text-terminal-green transition-colors flex items-center"
              >
                <FileText className="h-3 w-3 mr-1" />
                利用規約・プライバシー
              </Link>
            </div>
          </div>
          <div className="mt-2 text-center text-gray-500">
            STATUS: SYSTEM ONLINE | CPU: STABLE | MEMORY: OPTIMIZED
          </div>
        </motion.div>
      </div>

      {/* 遊び方・ゲーム紹介モーダル */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              className="bg-zinc-900 border-2 border-terminal-green rounded-md w-full max-w-3xl max-h-[80vh] overflow-y-auto terminal-scroll-hide"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black/90 backdrop-blur-sm z-10 px-4 py-3 border-b border-terminal-green/30 flex justify-between items-center">
                <h2 className="text-xl font-pixel text-terminal-green flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  アクロアタック.について
                </h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="text-gray-400 hover:text-terminal-green"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                {/* 遊び方 */}
                <div>
                  <h3 className="text-lg font-pixel text-terminal-green mb-3 flex items-center">
                    <GameController className="mr-2 h-5 w-5" />
                    遊び方
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>1. 5×5のグリッドに配置されたアルファベットから、有効なIT用語の略語を見つけます。</p>
                    <p>2. アルファベットをクリック/タップして単語を作ります。選択したマスは連続している必要があります。</p>
                    <p>3. 単語ができたら「確定」ボタンを押して単語を送信します。</p>
                    <p>4. 正しいIT用語の略語であれば、スコアが加算されます。</p>
                    <p>5. 60秒の制限時間内に、できるだけ多くの単語を見つけましょう。</p>
                  </div>
                </div>

                {/* スコア計算 */}
                <div>
                  <h3 className="text-lg font-pixel text-terminal-green mb-3 flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    スコア計算
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>・基本点: 元の単語の文字数に基づいて計算されます。</p>
                    <p>・コンボボーナス: 連続して単語を見つけるとボーナス倍率が上がります。</p>
                    <p>・計算式: (元の文字数) × (10 + コンボ数)</p>
                    <p>・例: CSSが3コンボ目の場合、&quot;Cascading Style Sheets&quot; の19文字 × (10 + 3) = 247点</p>
                    <p>・全消しボーナス: アルファベットをすべて使い切ると+1000点のボーナス!</p>
                  </div>
                </div>

                {/* 開発者情報 */}
                <div>
                  <h3 className="text-lg font-pixel text-terminal-green mb-3 flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    開発者情報
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>アクロアタック.は以下の技術で開発されています：</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>フロントエンド: Next.js, TypeScript, Framer Motion, TailwindCSS</li>
                      <li>バックエンド: FastAPI (Python)</li>
                      <li>データベース: Azure SQL Database</li>
                      <li>インフラ: Azure App Service, Azure Functions</li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-gray-700">
                      <p className="flex items-center">
                        <span className="text-terminal-green font-bold mr-2">開発者:</span> @waka320
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <a
                          href="https://wakaport.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-terminal-green hover:underline"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          wakaport.com
                        </a>
                        <a
                          href="https://github.com/waka320"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-terminal-green hover:underline"
                        >
                          <GithubIcon className="h-4 w-4 mr-2" />
                          github.com/waka320
                        </a>
                        <a
                          href="https://x.com/waka320port"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-terminal-green hover:underline"
                        >
                          
                          X @waka320port
                        </a>
                        <a
                          href="https://github.com/waka320/acro-attack"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-terminal-green hover:underline"
                        >
                          <GithubIcon className="h-4 w-4 mr-2" />
                          アクロアタック リポジトリ
                        </a>
                      </div>
                    </div>
                    <p className="mt-3 flex items-center text-terminal-green">
                      <Heart className="h-4 w-4 mr-2" />
                      THANKS TO ALL PLAYERS.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <motion.button
                    onClick={() => setShowAbout(false)}
                    className="bg-black/70 text-terminal-green border border-terminal-green/50 px-6 py-2 rounded font-pixel"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    閉じる
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 法的情報モーダル */}
      <AnimatePresence>
        {showLegal && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLegal(false)}
          >
            <motion.div
              className="bg-zinc-900 border-2 border-terminal-green rounded-md w-full max-w-3xl max-h-[80vh] overflow-y-auto terminal-scroll-hide"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black/90 backdrop-blur-sm z-10 px-4 py-3 border-b border-terminal-green/30 flex justify-between items-center">
                <h2 className="text-xl font-pixel text-terminal-green flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  法的情報
                </h2>
                <button
                  onClick={() => setShowLegal(false)}
                  className="text-gray-400 hover:text-terminal-green"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                {/* 利用規約 */}
                <div>
                  <h3 className="text-lg font-pixel text-terminal-green mb-3 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    利用規約
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>アクロアタック.をご利用いただくことにより、以下の利用規約に同意したものとみなされます。</p>
                    <p>・当ゲームは教育目的で提供されており、個人的な利用に限定されます。</p>
                    <p>・不正行為やゲームシステムの改ざんは禁止されています。</p>
                    <p>・ユーザー名に不適切な表現を使用することは禁止されています。</p>
                    <p>・当サービスは予告なく変更・中断・終了する場合があります。</p>
                  </div>
                </div>

                {/* プライバシーポリシー */}
                <div>
                  <h3 className="text-lg font-pixel text-terminal-green mb-3 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    プライバシーポリシー
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>当サービスでは、以下の情報を収集・保存する場合があります：</p>
                    <p>・ゲームスコアとユーザー名（リーダーボードに登録する場合）</p>
                    <p>・プレイ履歴と統計情報（サービス改善のため）</p>
                    <p>・Cookie情報（ユーザー体験向上のため）</p>
                    <p>収集した情報は第三者に提供されることはありません。</p>
                  </div>
                </div>


                <div className="pt-4 flex justify-center gap-3">
                  <motion.button
                    onClick={() => setShowLegal(false)}
                    className="bg-black/70 text-terminal-green border border-terminal-green/50 px-6 py-2 rounded font-pixel"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    閉じる
                  </motion.button>

                  <Link href="/terms">
                    <motion.button
                      className="bg-terminal-green/20 text-terminal-green border border-terminal-green/50 px-6 py-2 rounded font-pixel"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      詳細ページへ
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ターミナルアイコン
function Terminal({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}

// Xアイコン
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// ゲームコントローラーアイコン
function GameController({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      <line x1="12" y1="10" x2="12" y2="14"></line>
      <line x1="10" y1="12" x2="14" y2="12"></line>
      <line x1="6" y1="12" x2="6" y2="12.01"></line>
      <line x1="18" y1="12" x2="18" y2="12.01"></line>
    </svg>
  );
}

// 計算機アイコン
function Calculator({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="18" x2="16" y2="18"></line>
    </svg>
  );
}
