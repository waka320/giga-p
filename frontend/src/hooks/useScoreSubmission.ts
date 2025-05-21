import { useState } from 'react';
import axios from 'axios';
import { ITTerm } from '@/types';

// バックエンドAPIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function useScoreSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const submitScore = async (playerName: string, score: number, completedTerms: ITTerm[]) => {
    // 1000点未満は登録不可
    if (score < 1000) {
      setError("1000点以上のスコアのみ登録できます");
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/scores`, {
        player_name: playerName,
        score: score,
        completed_terms: completedTerms
      });
      
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('スコア登録エラー:', err);
      
      // エラーメッセージをより詳細に
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "スコア登録に失敗しました");
      } else {
        setError("スコア登録に失敗しました");
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { submitScore, isSubmitting, error, success };
}