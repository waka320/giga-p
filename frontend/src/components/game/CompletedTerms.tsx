import { useGameState } from '@/hooks/useGameState';
import { motion } from "framer-motion";
import { GameLogDetails, TermDetail } from '@/types';
import { cn } from '@/lib/utils';

export default function CompletedTerms() {
  const { state } = useGameState();
  console.log("CompletedTerms: state", state);

  if (!state.logs || state.logs.length === 0) {
    return (
      <div className="w-full max-w-xs mx-auto font-mono text-[10px] text-white/60 bg-black/40 border-t border-white/10">
        <div className="p-1 border-b border-white/10 flex items-center">
          <span className="text-gray-500 mr-1">$</span>
          <span>cat game_logs.log</span>
        </div>
        <div className="p-1">
          <span className="text-gray-500"># ログは空です。まだアクションが記録されていません。</span>
        </div>
      </div>
    );
  }

  // ログを配列のコピーを作成して反転（最新のものが先頭に）
  const reversedLogs = [...state.logs].reverse();

  // より柔軟な大文字小文字を区別しない単語検索関数
  const findTermCaseInsensitive = (termName: string) => {
    if (!termName) return null;

    const upperTermName = termName.toUpperCase();

    if (state.completedTerms && state.completedTerms.length > 0) {
      const completedTerm = state.completedTerms.find(
        t => t.term.toUpperCase() === upperTermName
      );
      console.log("findTermCaseInsensitive: completedTerm", completedTerm);
      console.log("findTermCaseInsensitive: termName", termName);
      if (completedTerm) return completedTerm;
    }

    return null;
  };

  // 単語の説明を取得する関数の型を修正
  const getTermDescription = (termName: string, logDetails: GameLogDetails): string => {
    // ログにterm_descriptionがある場合はそれを使用
    if (logDetails.term_description) {
      return logDetails.term_description;
    }

    // term_detailsから検索
    if (logDetails.term_details) {
      const termDetail = logDetails.term_details.find(
        (td: TermDetail) => td.term.toUpperCase() === termName.toUpperCase()
      );
      if (termDetail) {
        return termDetail.description;
      }
    }

    // 従来の方法でも検索
    const term = findTermCaseInsensitive(termName);
    return term ? term.description : '説明なし';
  };

  // 正しい表記の単語を取得する関数の型を修正
  const getOriginalTermName = (termName: string, logDetails: GameLogDetails): string => {
    // ログにterm_detailsがある場合はそれを使用
    if (logDetails.term_details) {
      const termDetail = logDetails.term_details.find(
        (td: TermDetail) => td.term.toUpperCase() === termName.toUpperCase()
      );
      if (termDetail) {
        return termDetail.term;
      }
    }

    // 従来の方法でも検索
    const term = findTermCaseInsensitive(termName);
    return term ? term.term : termName;
  };

  // コンボに応じたスタイル取得関数
  const getComboStyle = (combo: number) => {
    if (combo >= 5) return "text-purple-400 border-purple-400/50";
    if (combo >= 4) return "text-pink-500 border-pink-500/50";
    if (combo >= 3) return "text-red-500 border-red-500/50";
    if (combo >= 2) return "text-yellow-500 border-yellow-500/50";
    return "text-terminal-green";
  };

  return (
    <div className="bg-black/90 border border-terminal-green/50 shadow-[0_0_5px_rgba(12,250,0,0.2)] rounded-md p-2 overflow-hidden h-60 lg:h-96 relative scanlines">
      <div className="p-1 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-gray-500 mr-1">$</span>
          <span>cat game_logs.log</span>
        </div>
        <div className="text-gray-500">total: {state.logs.length}</div>
      </div>
      {/* PC表示時はより高さを確保 */}
      <div className="max-h-36 lg:max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {reversedLogs.map((log, index) => {
          // タイムスタンプをDate型に変換
          const logDate = new Date(log.timestamp);

          // スコア変更情報を取得
          const wordPoints = log.details.word_points || 0;
          const bonusPoints = log.details.bonus_points || 0;
          const hasBonus = bonusPoints > 0 || log.action.includes('ボーナス');
          const term = log.details.term || '';

          // 重複単語かどうかを判定
          const isDuplicate = log.action === "単語重複";

          // コンボ数を取得（なければ0）
          const comboCount = (log.details as { combo_count?: number }).combo_count || 0;

          return (
            <motion.div
              key={index}
              className={cn(
                "mb-1 text-xs border-l-2 pl-2",
                index === 0 ? "border-terminal-green" : "border-terminal-green/30",
                // コンボに応じたスタイル
                comboCount >= 2 && getComboStyle(comboCount)
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 単語情報の行 */}
              <div className="p-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">{(state.logs?.length || 0) - index}:</span>
                    <span className={`${isDuplicate ? 'text-terminal-green/50 italic' : 'text-terminal-green/90'} font-pixel`}>
                      {term ? getOriginalTermName(term, log.details) : log.action}
                      {isDuplicate && (
                        <span className="ml-1.5 text-[7px] font-normal bg-gray-800/80 text-gray-400 px-1 py-0.5 rounded-sm">
                          重複
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={`${isDuplicate ? 'text-gray-400/60' : 'text-gray-400'}`}>
                    +{wordPoints}pts
                    {comboCount > 0 && (
                      <span className="ml-1 text-2xs opacity-70">
                        ({isDuplicate ? '×' : '+'}
                        {isDuplicate ? (1 + comboCount) : (10 + comboCount)})
                      </span>
                    )}
                  </div>
                </div>

                {/* 単語の説明 - 重複の場合は薄く表示 */}
                {term && (
                  <div className={`${isDuplicate ? 'text-gray-400/40' : 'text-gray-400'} pl-4 pr-2 text-[8px] leading-tight mt-0.5`}>
                    {(() => {
                      const description = getTermDescription(term, log.details);
                      return description.length > 120
                        ? `${description.substring(0, 120)}...`
                        : description;
                    })()}

                    {/* 重複単語の場合に追加メッセージを表示 */}
                    {isDuplicate && (
                      <span className="block mt-0.5 text-amber-400/40 italic">
                        * この単語は既に発見済みのため、低倍率で得点計算されました
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* コンボ表示を追加 */}
              {comboCount >= 2 && (
                <motion.span
                  className={cn(
                    "ml-2 px-1 text-[10px] rounded",
                    getComboStyle(comboCount)
                  )}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {comboCount}x
                </motion.span>
              )}

              {/* ボーナス情報の行（あれば表示） */}
              {hasBonus && (
                <div className="p-1 pl-4 flex justify-between items-center bg-amber-900/20">
                  <div className="flex items-center">
                    <span className="text-amber-400/90 font-pixel">
                      {log.details.bonus_message || 'ボーナス獲得！'}
                    </span>
                  </div>
                  <div className="text-amber-400/90">
                    +{bonusPoints}pts
                  </div>
                </div>
              )}

              {/* タイムスタンプ - モバイルでは非表示、sm(640px)以上で表示 */}
              <div className="px-1 text-[8px] text-gray-500 text-right hidden sm:block">
                {logDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
