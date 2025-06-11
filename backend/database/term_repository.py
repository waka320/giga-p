import logging
from typing import List, Optional
from models import ITTerm
from database.db_manager import DBManager

class TermRepository:
    """IT用語のデータアクセスレイヤー"""
    
    def __init__(self):
        self.db_manager = DBManager()
    
    def test_connection(self) -> bool:
        """データベース接続をテスト"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")  # 最も軽量なクエリ
                result = cursor.fetchone()
                return result is not None and result[0] == 1
        except Exception as e:
            logging.error(f"データベース接続テストに失敗: {str(e)}")
            raise
    
    def get_all_terms(self) -> List[ITTerm]:
        """すべてのIT用語を取得"""
        terms = []
        
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT term, fullName, description, difficulty FROM ITTerms")
                
                for row in cursor.fetchall():
                    terms.append(ITTerm(
                        term=row[0],
                        fullName=row[1],
                        description=row[2],
                        difficulty=row[3]
                    ))
                
                return terms
        except Exception as e:
            logging.error(f"Error getting all terms: {str(e)}")
            # エラー時は空のリストを返す代わりに例外を再度投げる
            # 呼び出し側で適切に処理できるようにする
            raise
    
    def find_term_by_name(self, term_str: str) -> Optional[ITTerm]:
        """指定された文字列に一致する用語を検索"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                # パラメータ化クエリでSQLインジェクションを防止
                cursor.execute(
                    "SELECT term, fullName, description, difficulty FROM ITTerms WHERE UPPER(term) = UPPER(?)",
                    term_str
                )
                
                row = cursor.fetchone()
                if row:
                    return ITTerm(
                        term=row[0],
                        fullName=row[1],
                        description=row[2],
                        difficulty=row[3]
                    )
                
                return None
        except Exception as e:
            logging.error(f"Error finding term {term_str}: {str(e)}")
            raise
    
    def add_term(self, term: ITTerm) -> bool:
        """新しい用語を追加"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO ITTerms (term, fullName, description, difficulty) VALUES (?, ?, ?, ?)",
                    term.term, term.fullName, term.description, term.difficulty
                )
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Error adding term {term.term}: {str(e)}")
            return False
    
    def update_term(self, term: ITTerm) -> bool:
        """既存の用語を更新"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE ITTerms SET fullName = ?, description = ?, difficulty = ?, updated_at = GETDATE() WHERE term = ?",
                    term.fullName, term.description, term.difficulty, term.term
                )
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            logging.error(f"Error updating term {term.term}: {str(e)}")
            return False
    
    def delete_term(self, term_str: str) -> bool:
        """用語を削除"""
        try:
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM ITTerms WHERE term = ?", term_str)
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            logging.error(f"Error deleting term {term_str}: {str(e)}")
            return False