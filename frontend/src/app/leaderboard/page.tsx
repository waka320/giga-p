"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";

type LeaderboardEntry = {
  id: number;
  player_name: string;
  score: number;
  completed_terms_count: number;
  game_date: string;
};

export default function LeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/scores/leaderboard', {
          params: { limit: 100 } // 取得する上位スコア数
        });
        setScores(response.data);
      } catch (err) {
        setError('ランキングの読み込みに失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  // ランク表示用の色とアイコンを取得
  const getRankStyle = (rank: number) => {
    if (rank === 0) return { color: "text-yellow-400", icon: <Trophy className="h-5 w-5" /> };
    if (rank === 1) return { color: "text-gray-300", icon: <Medal className="h-5 w-5" /> };
    if (rank === 2) return { color: "text-amber-700", icon: <Medal className="h-5 w-5" /> };
    return { color: "text-gray-400", icon: null };
  };
  
  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* サイバー背景 */}
      <CyberPsychedelicBackground />
      
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 z-20">
        <motion.div
          className="w-full bg-black/80 border-2 border-terminal-green rounded-md p-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-terminal-green font-pixel">リーダーボード</h1>
            <Link 
              href="/game/start" 
              className="text-terminal-green hover:text-terminal-green/80 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> ゲームに戻る
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center p-8">
              <motion.div
                className="inline-block w-8 h-8 border-2 border-terminal-green border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-2 text-terminal-green">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">{error}</div>
          ) : scores.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              まだスコアが登録されていません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-terminal-green/30">
                    <th className="p-2 text-left text-terminal-green">順位</th>
                    <th className="p-2 text-left text-terminal-green">プレイヤー</th>
                    <th className="p-2 text-right text-terminal-green">スコア</th>
                    <th className="p-2 text-right text-terminal-green">単語数</th>
                    <th className="p-2 text-right text-terminal-green hidden md:table-cell">日時</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => {
                    const rankStyle = getRankStyle(index);
                    return (
                      <motion.tr
                        key={score.id}
                        className="border-b border-terminal-green/10 hover:bg-terminal-green/5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                      >
                        <td className={`p-2 ${rankStyle.color} font-bold`}>
                          <div className="flex items-center gap-1">
                            {rankStyle.icon}
                            <span>{index + 1}</span>
                          </div>
                        </td>
                        <td className="p-2 text-gray-300 font-pixel">{score.player_name}</td>
                        <td className="p-2 text-right font-pixel text-terminal-green">{score.score.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-300">{score.completed_terms_count}</td>
                        <td className="p-2 text-right text-xs text-gray-400 hidden md:table-cell">
                          {new Date(score.game_date).toLocaleString('ja-JP')}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
