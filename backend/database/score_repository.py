from datetime import datetime
from typing import List, Optional
from database.db_manager import DBManager
from models import LeaderboardEntry

class ScoreRepository:
    def __init__(self, db_manager: DBManager):
        self.db_manager = db_manager
        
    def save_score(self, player_name: str, score: int, completed_terms_count: int) -> Optional[int]:
        """スコアをデータベースに保存"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                # INSERTを実行
                cursor.execute(
                    """
                    INSERT INTO leaderboard (player_name, score, completed_terms_count)
                    VALUES (?, ?, ?);
                    """,
                    (player_name, score, completed_terms_count)
                )
                
                # 挿入されたIDを別のクエリで取得
                cursor.execute("SELECT @@IDENTITY AS id;")
                result = cursor.fetchone()
                conn.commit()
                return result[0] if result else None
        except Exception as e:
            print(f"スコア保存エラー: {e}")
            return None
            
    def get_top_scores(self, limit: int = 10) -> List[LeaderboardEntry]:
        """トップスコアを取得"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    SELECT TOP (?) id, player_name, score, completed_terms_count, game_date
                    FROM leaderboard
                    ORDER BY score DESC, completed_terms_count DESC, game_date ASC
                    """,
                    (limit,)
                )
                
                results = []
                for row in cursor.fetchall():
                    results.append(LeaderboardEntry(
                        id=row[0],
                        player_name=row[1],
                        score=row[2],
                        completed_terms_count=row[3],
                        game_date=row[4]
                    ))
                return results
        except Exception as e:
            print(f"トップスコア取得エラー: {e}")
            return []