"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Info, Play, Plus, Terminal, BookOpen, Award, MessageSquarePlus, Mail, ExternalLink, ChevronDown, Search, Home, Clock, Shield } from 'lucide-react';
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";

export default function HelpPage() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

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

            <div className="w-full max-w-4xl mx-auto px-4 py-6 z-20 relative">
                <motion.div
                    className="w-full bg-black/80 border-2 border-terminal-green rounded-md p-4 md:p-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* ヘッダー */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl md:text-2xl text-terminal-green font-pixel flex items-center">
                            <HelpCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                            困った時は
                        </h1>
                        <Link
                            href="/game/start"
                            className="text-terminal-green hover:text-terminal-green/80 flex items-center gap-1.5 text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" /> ゲームに戻る
                        </Link>
                    </div>

                    {/* コンテンツセクション */}
                    <div className="space-y-6">
                        {/* 遊び方セクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('howtoplay')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Play className="mr-2 h-5 w-5" />
                                    基本ルール・遊び方
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'howtoplay' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'howtoplay' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">ゲーム目的</h3>
                                        <p>制限時間2分間の中で、できるだけ多くのIT用語（アクロニム）を見つけて高得点を目指すパズルゲームです。</p>
                                    </div>

                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">基本ルール</h3>
                                        <ol className="list-decimal ml-5 space-y-1.5">
                                            <li>5×5のグリッドに様々なアルファベットが配置されています</li>
                                            <li>グリッド上の<span className="text-terminal-green">任意のアルファベット</span>を順番に選択して、IT用語を作ります</li>
                                            <li><span className="font-semibold">隣接していなくても</span>選択できます（飛び飛びでもOK）</li>
                                            <li>作った単語がIT用語辞書に登録されていれば得点獲得</li>
                                            <li>制限時間は2分(120秒)です</li>
                                        </ol>
                                    </div>

                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">対応端末・操作方法</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                                <h4 className="text-terminal-green font-semibold mb-1">PC操作</h4>
                                                <ul className="list-disc ml-4 space-y-1">
                                                    <li>マウスクリックでアルファベットを選択/選択解除</li>
                                                    <li>キーボードから選択も可能</li>
                                                    <li>BackSpaceキーから解除も可能</li>
                                                    <li>Enter/Spaceキー：選択を確定</li>
                                                    <li>Escキー：選択をリセット</li>
                                                </ul>
                                            </div>
                                            <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                                <h4 className="text-terminal-green font-semibold mb-1">モバイル操作</h4>
                                                <ul className="list-disc ml-4 space-y-1">
                                                    <li>タップでアルファベットを選択</li>
                                                    <li>スワイプで連続選択も可能</li>
                                                    <li>「確定」ボタン：選択を確定</li>
                                                    <li>「リセット」ボタン：選択をクリア</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h4 className="text-terminal-green font-semibold mb-1">テクニック</h4>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>長い単語ほど高得点になります</li>
                                            <li>コンボを積み重ねると点数が大きくなります</li>
                                            <li>グリッドを一度に全て消すと1000点のボーナス</li>
                                            <li>残りのアルファベットが5つ以下になるとボーナス</li>
                                            <li>簡単な短い用語はコンボを増やす戦略に活用しましょう</li>
                                            <li>コンボが大きい時に長い単語を作るとスコアが爆発的に伸びます</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* スコア計算セクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('scoring')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Award className="mr-2 h-5 w-5" />
                                    スコア計算システム
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'scoring' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'scoring' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    {/* スコア計算テーブル */}
                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">得点計算一覧表</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border-collapse border border-terminal-green/30 text-xs md:text-sm">
                                                <thead>
                                                    <tr className="bg-terminal-green/10">
                                                        <th className="border border-terminal-green/30 p-2">項目</th>
                                                        <th className="border border-terminal-green/30 p-2">計算式・詳細</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-terminal-green/30 p-2 font-semibold">新規単語の基本点</td>
                                                        <td className="border border-terminal-green/30 p-2">(単語の長さ) × (10 + コンボ数)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-terminal-green/30 p-2 font-semibold">重複単語の得点</td>
                                                        <td className="border border-terminal-green/30 p-2">(単語の長さ) × (1 + コンボ数) <span className="text-yellow-300">※コンボ数は増加します</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-terminal-green/30 p-2 font-semibold">残り文字数ボーナス</td>
                                                        <td className="border border-terminal-green/30 p-2">残りが5文字以下で (6 - 残り文字数) × 50点</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-terminal-green/30 p-2 font-semibold">全消しボーナス</td>
                                                        <td className="border border-terminal-green/30 p-2 text-yellow-300">全ての文字を使い切ると+1000点 (場とコンボはリセット)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-terminal-green/30 p-2 font-semibold">コンボボーナス</td>
                                                        <td className="border border-terminal-green/30 p-2">連続正解でコンボ数増加、得点倍率も上昇</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                            <h4 className="text-terminal-green font-semibold mb-1">コンボ効率の例</h4>
                                            <p className="mb-2">コンボ3の状態で6文字の単語を見つけた場合：</p>
                                            <p className="font-mono">6 × (10 + 3) = 78点</p>
                                            <p className="italic text-xs text-gray-400 mt-1">※コンボが高いほど得点効率が上がります</p>
                                        </div>

                                        <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                            <h4 className="text-terminal-green font-semibold mb-1">戦略ヒント</h4>
                                            <ul className="list-disc ml-4 space-y-1">
                                                <li>短い単語でコンボを稼いでから長い単語を</li>
                                                <li>重複でもコンボは増えるため有効活用</li>
                                                <li>全消しボーナスを狙えるタイミングを見極める</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 p-3 rounded border border-yellow-500/20">
                                        <h4 className="text-yellow-400 font-semibold mb-1">ハイスコア攻略のコツ</h4>
                                        <p>コンボを上げてから長い単語を作ると一気に点数が伸びます。またコンボを伸ばすために「AI」や「OS」などの短い単語を戦略的に消しておくと良いでしょう。</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* よくある質問セクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('faq')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Info className="mr-2 h-5 w-5" />
                                    よくある質問（FAQ）
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'faq' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'faq' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: ゲームがロードされない・動作が遅い</h3>
                                        <p>A: 以下の対処法をお試しください：</p>
                                        <ul className="list-disc ml-5 mt-1 space-y-1">
                                            <li>ブラウザのキャッシュとCookieをクリアする</li>
                                            <li>最新版のChromeやEdge、Safariなど別のブラウザで試す</li>
                                            <li>デバイスを再起動する</li>
                                            <li>ネットワーク接続を確認する</li>
                                        </ul>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: 有効なIT用語なのに認識されない</h3>
                                        <p>A: ゲーム内辞書に未登録の用語である可能性があります。現在1,200語以上のIT用語が登録されていますが、すべてをカバーしきれていません。新しい用語や未収録の用語は「用語リクエスト」からご提案ください。定期的に辞書をアップデートしています。</p>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: スコアがランキングに登録されない</h3>
                                        <p>A: 以下の可能性を確認してください：</p>
                                        <ul className="list-disc ml-5 mt-1 space-y-1">
                                            <li>1000点以上のスコアのみがランキングに登録できます</li>
                                            <li>インターネット接続が安定していることを確認</li>
                                            <li>サーバーメンテナンス中の場合はしばらく待ってから再度お試しください</li>
                                            <li>同一プレイヤー名で登録する場合、前回より高いスコアのみ更新されます</li>
                                        </ul>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: フリーズしたらどうすればいいですか？</h3>
                                        <p>A: 以下の対処法を順にお試しください：</p>
                                        <ol className="list-decimal ml-5 mt-1 space-y-1">
                                            <li>画面右上の設定ボタンからリロードオプションを選択</li>
                                            <li>ブラウザの更新ボタンでページを再読み込み</li>
                                            <li>タブを閉じて再度開き直す</li>
                                            <li>問題が続く場合は、お問い合わせフォームからご報告ください</li>
                                        </ol>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: モバイルで操作がうまくできない</h3>
                                        <p>A: モバイルでは以下のコツを試してみてください：</p>
                                        <ul className="list-disc ml-5 mt-1 space-y-1">
                                            <li>画面を横向きにすると操作しやすくなります</li>
                                            <li>タップは少し長めに押さえると認識しやすくなります</li>
                                            <li>画面を拡大してプレイすることもできます</li>
                                        </ul>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">Q: 制限時間を延長できますか？</h3>
                                        <p>A: 現在の仕様では制限時間は2分（120秒）で固定されています。将来のアップデートで異なるゲームモードを導入する可能性があります。ご意見はお問い合わせフォームからお寄せください。</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 用語リクエストセクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('terms')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Plus className="mr-2 h-5 w-5" />
                                    用語リクエスト・辞典
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'terms' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'terms' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">IT用語辞典について</h3>
                                        <p>アクロアタックでは1,200語以上のIT関連用語・アクロニムを収録しています。これらはWikipediaやデジタル庁などの公的資料を参照して収集されています。</p>
                                        <p className="mt-2">辞典ページでは全用語の意味や詳細を確認できるほか、検索機能も利用可能です。</p>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-1">用語リクエスト方法</h3>
                                        <p className="mb-2">
                                            追加して欲しいIT用語や略語がありましたら、専用フォームからリクエストしてください。
                                            以下の情報を含めていただくとスムーズに追加検討できます：
                                        </p>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>アクロニム・略語（例：HTML）</li>
                                            <li>正式名称（例：HyperText Markup Language）</li>
                                            <li>簡単な説明や参考URL（任意）</li>
                                        </ul>
                                        <p className="mt-2 text-xs italic">※定期的に辞書を更新しています。重複がなく、一般的なIT用語であれば追加されます。</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <a
                                            href="https://docs.google.com/forms/d/e/1FAIpQLSdxX_lu5OO8qZ7CSwpMYx2JhT_hhy6u4-NR8YFwv0uZRgaAHw/viewform?usp=dialog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-3 py-2 rounded-sm text-xs md:text-sm transition-colors"
                                        >
                                            <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                                            用語をリクエストする
                                            <ExternalLink className="h-3 w-3 ml-1.5" />
                                        </a>

                                        <Link
                                            href="/dictionary"
                                            className="inline-flex items-center bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green border border-terminal-green/30 px-3 py-2 rounded-sm text-xs md:text-sm transition-colors"
                                        >
                                            <BookOpen className="h-4 w-4 mr-1.5" />
                                            IT用語辞典を見る
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* お問い合わせセクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('contact')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Mail className="mr-2 h-5 w-5" />
                                    お問い合わせ・バグ報告
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'contact' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'contact' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <p>
                                        バグ報告や機能リクエスト、その他のお問い合わせは以下の方法でご連絡ください。
                                        開発チームが確認次第、対応いたします。
                                    </p>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-2">バグ報告時に役立つ情報</h3>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>発生した問題の詳細な説明</li>
                                            <li>問題が発生した状況（プレイ中、結果画面など）</li>
                                            <li>使用しているデバイスとブラウザの情報</li>
                                            <li>可能であればスクリーンショットやエラーメッセージ</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-terminal-green" />
                                            <span>お問い合わせフォーム：</span>
                                            <a
                                                href="https://docs.google.com/forms/d/e/1FAIpQLSdxX_lu5OO8qZ7CSwpMYx2JhT_hhy6u4-NR8YFwv0uZRgaAHw/viewform?usp=dialog"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-terminal-green/80 hover:text-terminal-green ml-1 underline flex items-center"
                                            >
                                                フォームを開く
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        </div>
                                        <div className="flex items-center">
                                            <Terminal className="h-4 w-4 mr-2 text-terminal-green" />
                                            <span>GitHub：</span>
                                            <a
                                                href="https://github.com/waka320/giga-p"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-terminal-green/80 hover:text-terminal-green ml-1 underline flex items-center"
                                            >
                                                イシューを作成する
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-xs italic text-gray-400">通常、お問い合わせには1週間以内に返信いたします。</p>
                                </div>
                            )}
                        </section>

                        {/* 基本情報セクション */}
                        <section>
                            <button
                                onClick={() => toggleSection('info')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Terminal className="mr-2 h-5 w-5" />
                                    ゲーム情報・技術詳細
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'info' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'info' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-terminal-green font-semibold mb-2">アクロアタック基本情報</h3>
                                            <p className="mb-1">バージョン: 1.1</p>
                                            <p className="mb-1">最終更新: 2025年6月10日</p>
                                            <p className="mb-1">収録用語数: 1,200語以上</p>
                                            <p className="mb-3">開発: <a href="https://wakaport.com" target="_blank" rel="noopener noreferrer" className="text-terminal-green/80 hover:text-terminal-green underline">@waka320</a></p>
                                        </div>

                                        <div>
                                            <h3 className="text-terminal-green font-semibold mb-2">技術スタック</h3>
                                            <ul className="space-y-1">
                                                <li>フロントエンド: Next.js, TypeScript, Framer Motion, TailwindCSS</li>
                                                <li>バックエンド: FastAPI (Python)</li>
                                                <li>データベース: Azure SQL Database</li>
                                                <li>インフラ: Azure App Service, Azure Functions</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                        <h3 className="text-terminal-green font-semibold mb-2">権利・引用情報</h3>
                                        <p className="mb-2">アクロアタックは教育目的で開発されており、収録されているIT用語はWikipediaやデジタル庁などの公的資料を参照しています。各種ライセンスに配慮し、引用元を明示しています。</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Link
                                                href="/terms"
                                                className="text-terminal-green/80 hover:text-terminal-green underline text-xs flex items-center"
                                            >
                                                <Shield className="h-3 w-3 mr-1" /> 利用規約
                                            </Link>
                                            <span className="text-terminal-green/50">|</span>
                                            <a
                                                href="https://github.com/waka320/giga-p"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-terminal-green/80 hover:text-terminal-green underline text-xs flex items-center"
                                            >
                                                <Terminal className="h-3 w-3 mr-1" /> GitHub
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-terminal-green font-semibold mb-2">クイックリンク</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <Link href="/" className="text-terminal-green/80 hover:text-terminal-green flex items-center bg-black/30 p-2 rounded border border-terminal-green/20">
                                                <Home className="h-3.5 w-3.5 mr-1.5" /> ホーム
                                            </Link>
                                            <Link href="/game/start" className="text-terminal-green/80 hover:text-terminal-green flex items-center bg-black/30 p-2 rounded border border-terminal-green/20">
                                                <Play className="h-3.5 w-3.5 mr-1.5" /> ゲームスタート
                                            </Link>
                                            <Link href="/dictionary" className="text-terminal-green/80 hover:text-terminal-green flex items-center bg-black/30 p-2 rounded border border-terminal-green/20">
                                                <BookOpen className="h-3.5 w-3.5 mr-1.5" /> IT用語辞典
                                            </Link>
                                            <Link href="/leaderboard" className="text-terminal-green/80 hover:text-terminal-green flex items-center bg-black/30 p-2 rounded border border-terminal-green/20">
                                                <Award className="h-3.5 w-3.5 mr-1.5" /> ランキング
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* サポート情報セクション (新規追加) */}
                        <section>
                            <button
                                onClick={() => toggleSection('support')}
                                className="w-full flex justify-between items-center bg-terminal-green/10 hover:bg-terminal-green/15 p-3 rounded-md border border-terminal-green/30 text-terminal-green transition-colors"
                            >
                                <div className="flex items-center text-lg font-mono">
                                    <Clock className="mr-2 h-5 w-5" />
                                    更新履歴・最新情報
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'support' ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedSection === 'support' && (
                                <div className="mt-3 bg-black/50 border border-terminal-green/20 rounded-md p-4 text-gray-300 text-sm space-y-4">
                                    <div className="space-y-3">
                                        <div className="bg-black/30 p-3 rounded border border-terminal-green/20">
                                            <h3 className="text-terminal-green font-semibold mb-2">最新アップデート v1.1</h3>
                                            <ul className="list-disc ml-5 space-y-1">
                                                <li>100以上の新規IT用語を追加</li>
                                                <li>モバイル操作性の向上</li>
                                                <li>パフォーマンス最適化</li>
                                                <li>細かなバグ修正</li>
                                            </ul>
                                            <p className="text-xs mt-2 text-terminal-green/60">リリース日: 2025年6月5日</p>
                                        </div>

                                        <div className="bg-black/30 p-3 rounded border border-yellow-500/20">
                                            <h3 className="text-yellow-400 font-semibold mb-1">今後の予定</h3>
                                            <ul className="list-disc ml-5 space-y-1">
                                                <li>新ゲームモード「ボスマッチ」の追加</li>
                                                <li>さらなる用語追加と辞書の拡充</li>
                                                <li>程よい程度の広告の追加</li>
                                            </ul>
                                            <p className="text-xs mt-2 italic">※実装予定は開発者の機嫌で変更になる場合があります</p>
                                        </div>
                                    </div>

                                    <p className="text-center">
                                        開発者の情報は
                                        <a
                                            href="https://x.com/waka320port"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-terminal-green underline mx-1"
                                        >
                                            X(@waka320port)
                                        </a>
                                        をなどをご確認ください
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* フッター */}
                    <div className="mt-8 pt-4 border-t border-terminal-green/20 text-gray-400 text-xs font-mono flex justify-between items-center">
                        <div className="text-terminal-green/40">
                            © 2025 アクロアタック.
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/game/start"
                                className="text-terminal-green/70 hover:text-terminal-green/90 transition-colors flex items-center"
                            >
                                <Play className="h-3 w-3 mr-1" />
                                ゲームに戻る
                            </Link>
                            <Link
                                href="/dictionary"
                                className="text-terminal-green/70 hover:text-terminal-green/90 transition-colors flex items-center"
                            >
                                <Search className="h-3 w-3 mr-1" />
                                辞典を見る
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
