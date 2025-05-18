import { useGameState } from '@/hooks/useGameState';
import { motion } from "framer-motion";

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

  // 単語の説明を取得する関数
  const getTermDescription = (termName: string) => {
    const term = state.terms.find(t => t.term === termName);
    return term ? term.description : '説明なし';
  };

  return (
    <div className="w-full font-mono text-[10px] text-white/70 bg-black/40 border border-white/10 rounded-md lg:h-full">
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
          
          // 単語の説明を取得
          const description = getTermDescription(term);

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-white/5 cursor-default"
            >
              {/* 単語情報の行 */}
              <div className="p-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">{(state.logs?.length || 0) - index}:</span>
                    <span className="text-terminal-green/90 font-pixel">
                      {term ? term : log.action}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    +{wordPoints}pts
                  </div>
                </div>
                
                {/* 単語の説明 */}
                {term && (
                  <div className="text-gray-400 pl-4 pr-2 text-[8px] leading-tight mt-0.5">
                    {description.length > 120 
                      ? `${description.substring(0, 120)}...` 
                      : description}
                  </div>
                )}
              </div>
              
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
