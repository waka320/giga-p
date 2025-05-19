import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.db_manager import DBManager
from data.terms import seed_database

def create_table():
    """ITTermsテーブルの作成"""
    create_table_sql = """
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ITTerms')
    BEGIN
        CREATE TABLE ITTerms (
            id INT IDENTITY(1,1) PRIMARY KEY,
            term NVARCHAR(50) NOT NULL,
            fullName NVARCHAR(200) NOT NULL,
            description NVARCHAR(500) NOT NULL,
            difficulty INT DEFAULT 1,
            created_at DATETIME2 DEFAULT GETDATE(),
            updated_at DATETIME2 DEFAULT GETDATE()
        );
        
        CREATE INDEX idx_term ON ITTerms(term);
    END
    """
    
    db_manager = DBManager()
    try:
        with db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_sql)
            conn.commit()
            print("テーブルの作成に成功しました")
    except Exception as e:
        print(f"テーブル作成エラー: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    print("データベース初期化を開始します...")
    
    if create_table():
        print("初期データの投入を開始します...")
        count = seed_database()
        print(f"初期データ投入完了: {count}件のIT用語を追加しました")
    else:
        print("テーブル作成に失敗したため、初期データの投入をスキップします")