"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Database, Info, AlertTriangle, Code, ExternalLink } from "lucide-react";
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";

export default function TermsPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CyberPsychedelicBackground variant="cyber"  />
      
      <div className="scanlines absolute inset-0 pointer-events-none z-10"></div>
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 z-20">
        <motion.div
          className="bg-black/80 border-2 border-terminal-green rounded-md p-4 md:p-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="bg-black/60 hover:bg-black/80 text-terminal-green px-3 py-1.5 rounded flex items-center gap-2 text-sm border border-terminal-green/40 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              ホームに戻る
            </Link>
            <h1 className="text-lg md:text-xl font-pixel text-terminal-green">利用規約・プライバシーポリシー</h1>
          </div>
          
          {/* コンテンツ */}
          <div className="prose prose-invert prose-sm max-w-none font-mono terminal-scroll-hide space-y-10">
            {/* 導入部分 */}
            <div className="terminal-section">
              <div className="bg-black border border-terminal-green/40 rounded-t-md p-2 flex items-center">
                <Code className="h-4 w-4 mr-2 text-terminal-green" />
                <p className="text-terminal-green text-xs">$ cat legal_information.md</p>
              </div>
              <div className="bg-black/40 border-x border-b border-terminal-green/40 rounded-b-md p-4 text-gray-300 text-sm space-y-3">
                <p>
                  アクロアタック.（以下「本サービス」）は、IT用語アクロニムのパズルゲームサービスです。
                  本ページでは、本サービスの利用規約およびプライバシーポリシーについて説明します。
                  本サービスを利用することにより、以下の規約およびポリシーに同意したものとみなされます。
                </p>
                <p>
                  最終更新日: 2025年5月21日
                </p>
              </div>
            </div>
            
            {/* 利用規約 */}
            <section>
              <h2 className="text-xl font-pixel text-terminal-green flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" />
                利用規約
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-base text-terminal-green mb-2">1. 基本条項</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>1.1 本サービスは教育目的で提供されており、特定の政治的・宗教的な意図はありません。</p>
                    <p>1.2 本サービスの利用は個人利用を原則としますが、教育機関での利用についてはその限りではありません。</p>
                    <p>1.3 本サービスの内容は予告なく変更・中断・終了する場合があります。</p>
                    <p>1.4 本サービスの利用者が本規約に違反した場合、サービス提供者は利用者に対して事前の通知なくサービスの提供を停止することがあります。</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">2. 禁止事項</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>2.1 本サービスに対する不正アクセスやハッキング行為</p>
                    <p>2.2 データベースやサーバーに対する攻撃または過度の負荷をかける行為</p>
                    <p>2.3 本サービスのソースコードやゲームコンテンツの無断複製・再配布</p>
                    <p>2.4 ユーザー名に不適切な表現を使用する行為</p>
                    <p>2.5 その他、法令または公序良俗に反する行為</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">3. コンテンツの利用</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>3.1 ゲーム実況やストリーミング配信、レビュー記事など、本サービスのプレイ体験を共有する行為は許可されています。</p>
                    <p>3.2 本サービスのゲームコンテンツ（アートワーク、音声、テキスト、プログラム等）を直接再配布したり、二次的著作物として提供したりする行為は禁止されています。</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">4. 収益化について</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>4.1 本サービスは広告掲載などによる収益化を行う可能性があります。</p>
                    <p>4.2 広告内容についてはサービス提供者が責任を負うものではありません。</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">5. 免責事項</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>5.1 本サービスの利用によって生じたいかなる損害についても、サービス提供者は責任を負いません。</p>
                    <p>5.2 本サービスで提供される情報の正確性・完全性・有用性については保証されません。</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* プライバシーポリシー */}
            <section>
              <h2 className="text-xl font-pixel text-terminal-green flex items-center mb-4">
                <Shield className="h-5 w-5 mr-2" />
                プライバシーポリシー
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-base text-terminal-green mb-2">1. 収集する情報</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>1.1 <strong>アカウント情報</strong>: リーダーボードに登録する場合のユーザー名</p>
                    <p>1.2 <strong>プレイデータ</strong>: ゲームスコア、プレイ履歴、選択した単語など</p>
                    <p>1.3 <strong>利用状況データ</strong>: 訪問日時、滞在時間、利用機能</p>
                    <p>1.4 <strong>Cookie情報</strong>: セッション管理、ユーザー体験向上のため</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">2. 情報の利用目的</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>2.1 リーダーボードの管理・表示</p>
                    <p>2.2 サービス品質の向上・不具合の修正</p>
                    <p>2.3 新機能開発のための統計データの収集</p>
                    <p>2.4 セキュリティの確保・不正利用の防止</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">3. 第三者への提供</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>3.1 収集した個人情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。</p>
                    <p>3.2 統計処理された匿名データについては、分析・研究目的で第三者と共有することがあります。</p>
                  </div>
                </div>
                
              </div>
            </section>
            
            {/* データソース */}
            <section>
              <h2 className="text-xl font-pixel text-terminal-green flex items-center mb-4">
                <Database className="h-5 w-5 mr-2" />
                データソース
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-base text-terminal-green mb-2">1. アクロニム（略語）の出典</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>
                      本サービスで使用されているIT用語アクロニム（略語）は、以下の公的機関および情報源から収集・参照しています：
                    </p>
                    <ul className="space-y-2 list-disc pl-6">
                      <li className="flex items-start">
                        <span className="text-terminal-green font-bold mr-2">Wikipedia</span>
                        <div>
                          <p>IT・技術用語のアクロニムおよび定義の参照</p>
                          <p className="text-xs text-gray-400 mt-1">参照元：
                            <a 
                              href="https://ja.wikipedia.org/wiki/コンピュータ用語一覧" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「コンピュータ用語一覧」
                            </a>、
                            <a 
                              href="https://ja.wikipedia.org/wiki/インターネット用語一覧" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「インターネット用語一覧」
                            </a>、
                            <a 
                              href="https://en.wikipedia.org/wiki/List_of_computing_and_IT_abbreviations" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「List of computing and IT abbreviations」
                            </a>
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green font-bold mr-2">デジタル庁</span>
                        <div>
                          <p>政府のデジタル関連用語集を参照</p>
                          <p className="text-xs text-gray-400 mt-1">参照元：
                            <a 
                              href="https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/5ecac8cc-50f1-4168-b989-2bcaabffe870/622c2ad1/20221004_policies_priority_outline_01.pdf" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「重点計画用語集」（デジタル庁）
                            </a>、
                            <a 
                              href="https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/e2a06143-ed29-4f1d-9c31-0f06fca67afc/83a1ac09/20230331_resources_standard_guidelines_glossary_03.pdf" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「標準ガイドライン群用語集」（デジタル庁）
                            </a>
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green font-bold mr-2">総務省</span>
                        <div>
                          <p>公的資料を参照</p>
                          <p className="text-xs text-gray-400 mt-1">参照元：
                            <a 
                              href="https://dx-navi.soumu.go.jp/words" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-terminal-green/70 hover:text-terminal-green underline"
                            >
                              「地域社会DX用語集」（総務省）
                            </a>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">2. 説明文の生成</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>
                      用語の説明文はGoogle社の生成AI「Gemini AI」を活用して作成されています。説明内容については、一般的な理解を促進するための解説であり、専門的な定義と異なる場合があります。
                    </p>
                    <p>
                      AI生成コンテンツはその性質上、完全性・正確性を保証するものではありません。より詳細または正確な情報については、公式リファレンスや技術文書を参照することをお勧めします。
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">3. 著作権とライセンス</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>
                      本サービスは教育目的で提供されています。使用されているアクロニムや用語はそれぞれの権利者に帰属します。ゲーム内の説明文や解説は、一般的な知識の普及を目的としており、特定の出典からの直接引用ではありません。
                    </p>
                    <p>
                      各データソースの利用については、それぞれの利用規約に基づいています：
                    </p>
                    <ul className="space-y-1 list-disc pl-6">
                      <li>
                        <a 
                          href="https://ja.wikipedia.org/wiki/Wikipedia:ウィキペディアを二次利用する" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-green/80 hover:text-terminal-green underline flex items-center"
                        >
                          Wikipedia「ウィキペディアを二次利用する」
                          <ExternalLink className="inline-block h-3 w-3 ml-1" />
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.digital.go.jp/copyright-policy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-green/80 hover:text-terminal-green underline flex items-center"
                        >
                          デジタル庁「コピーライトポリシー」
                          <ExternalLink className="inline-block h-3 w-3 ml-1" />
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.soumu.go.jp/menu_kyotsuu/policy/tyosaku.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-green/80 hover:text-terminal-green underline flex items-center"
                        >
                          総務省「著作権について」
                          <ExternalLink className="inline-block h-3 w-3 ml-1" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 bg-black/30 p-3 border border-terminal-green/20 rounded text-xs">
                    <h4 className="text-terminal-green mb-2">Wikipediaコンテンツの利用について</h4>
                    <p className="mb-2">
                      本アプリケーションでは、Wikipediaのコンテンツをクリエイティブ・コモンズ 表示-継承ライセンス（CC BY-SA）3.0および4.0に基づいて利用しています。
                    </p>
                    
                    <p className="mt-3">
                      詳細は
                      <a 
                        href="https://ja.wikipedia.org/wiki/Wikipedia:ウィキペディアを二次利用する" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-terminal-green/80 hover:text-terminal-green underline ml-1"
                      >
                        Wikipedia:ウィキペディアを二次利用する
                      </a>
                      をご参照ください。
                    </p>
                  </div>
                  <div className="mt-4 bg-black/30 p-3 border border-terminal-green/20 rounded text-xs">
                    <h4 className="text-terminal-green mb-2">デジタル庁コンテンツの利用について</h4>
                    <p className="mb-2">デジタル庁のコンテンツは「公共データ利用規約（第1.0版）」（PDL1.0）が適用されています。本アプリケーションでの利用にあたっては以下の条件に従っています：</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>出典を記載（「○○動向調査」（デジタル庁）（URL）の形式）</li>
                      <li>編集・加工した情報は、その旨と主体を明示</li>
                      <li>編集・加工した情報をデジタル庁の未加工のコンテンツであるかのように公表していない</li>
                    </ul>
                    <p className="mt-2">詳細は<a 
                      href="https://www.digital.go.jp/copyright-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-terminal-green/80 hover:text-terminal-green underline"
                    >デジタル庁コピーライトポリシー</a>をご参照ください。</p>
                  </div>
                  <div className="mt-4 bg-black/30 p-3 border border-terminal-green/20 rounded text-xs">
                    <h4 className="text-terminal-green mb-2">総務省コンテンツの利用について</h4>
                    <p className="mb-2">総務省のコンテンツは「公共データ利用規約（第1.0版）」が適用されています。本アプリケーションでの利用にあたっては以下の条件に従っています：</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>出典記載：「地域社会DX用語集」（総務省）（https://dx-navi.soumu.go.jp/words）</li>
                      <li>編集・加工情報の明示：本アプリケーションではゲーム用に情報を編集・加工して利用</li>
                      <li>編集・加工した情報を総務省が作成したかのような態様では公表・利用していない</li>
                    </ul>
                    <p className="mt-2">詳細は<a 
                      href="https://www.soumu.go.jp/menu_kyotsuu/policy/tyosaku.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-terminal-green/80 hover:text-terminal-green underline"
                    >総務省の著作権ポリシー</a>をご参照ください。</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* お問い合わせ・免責事項 */}
            <section>
              <h2 className="text-xl font-pixel text-terminal-green flex items-center mb-4">
                <Info className="h-5 w-5 mr-2" />
                お問い合わせ・免責事項
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-base text-terminal-green mb-2">1. お問い合わせ</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>
                      本サービスに関するお問い合わせ、また個人情報の取り扱いに関するご質問は、以下の方法でご連絡ください：
                    </p>
                    <p className="bg-black/40 p-3 border border-terminal-green/30 rounded">
                      <span className="text-terminal-green">Google Form:</span> <a href="https://docs.google.com/forms/d/e/1FAIpQLSdxX_lu5OO8qZ7CSwpMYx2JhT_hhy6u4-NR8YFwv0uZRgaAHw/viewform?usp=dialog">アクロアタック. - お問い合わせフォーム</a>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base text-terminal-green mb-2">2. 免責事項</h3>
                  <div className="space-y-2 pl-1 text-sm">
                    <p>
                      本サービスで提供される情報・コンテンツの正確性、完全性、有用性等について保証するものではありません。本サービスの利用によって生じたいかなる損害についても、サービス提供者は責任を負いません。
                    </p>
                    <p>
                      本サービスに含まれる情報は、IT用語の学習を目的としたものであり、特定の製品・サービスの推奨や保証を行うものではありません。
                    </p>
                  </div>
                </div>
                
                <div className="bg-black/40 border border-terminal-green/30 p-4 rounded">
                  <h3 className="text-base text-terminal-green mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    重要なお知らせ
                  </h3>
                  <p className="text-sm">
                    本利用規約およびプライバシーポリシーは、予告なく変更される場合があります。定期的に本ページをご確認いただくことをお勧めします。
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          {/* フッター */}
          <div className="mt-8 pt-4 border-t border-terminal-green/20 flex justify-center">
            <Link href="/" className="text-terminal-green/70 hover:text-terminal-green text-sm font-mono transition-colors flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              ホームに戻る
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
