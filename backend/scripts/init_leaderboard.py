import sys
import os
import logging

# 先にパスを追加してから相対インポートを行う
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 絶対インポートに変更
from database.db_manager import DBManager

# ロギングの設定
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_leaderboard_table():
    """リーダーボードテーブルを作成"""
    create_table_sql = """
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'leaderboard')
    BEGIN
        CREATE TABLE leaderboard (
            id INT IDENTITY(1,1) PRIMARY KEY,
            player_name NVARCHAR(50) NOT NULL,
            score INT NOT NULL,
            completed_terms_count INT NOT NULL,
            game_date DATETIME DEFAULT GETDATE()
        );
        
        -- スコア検索用インデックス
        CREATE INDEX idx_score ON leaderboard(score DESC);
        -- 日付検索用インデックス
        CREATE INDEX idx_game_date ON leaderboard(game_date);
    END
    """

    db_manager = DBManager()
    try:
        with db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_sql)
            conn.commit()
            logger.info("リーダーボードテーブルの作成に成功しました")
            return True
    except Exception as e:
        logger.error(f"リーダーボードテーブル作成エラー: {str(e)}")
        return False


def check_leaderboard_exists():
    """リーダーボードテーブルが存在するか確認"""
    db_manager = DBManager()
    try:
        with db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                IF EXISTS (SELECT * FROM sys.tables WHERE name = 'leaderboard')
                SELECT 1 AS exists_flag
                ELSE
                SELECT 0 AS exists_flag
            """)
            result = cursor.fetchone()
            exists = result[0] == 1 if result else False
            if exists:
                logger.info("リーダーボードテーブルは既に存在します")
            else:
                logger.info("リーダーボードテーブルは存在しません")
            return exists
    except Exception as e:
        logger.error(f"テーブル存在確認エラー: {str(e)}")
        return False


if __name__ == "__main__":
    print("リーダーボードテーブル初期化を開始します...")
    
    if check_leaderboard_exists():
        user_input = input("リーダーボードテーブルは既に存在します。再作成しますか？(y/n): ")
        if user_input.lower() not in ['y', 'yes']:
            print("操作をキャンセルしました。")
            sys.exit(0)
        
        # 既存のテーブルを削除
        db_manager = DBManager()
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DROP TABLE IF EXISTS leaderboard")
                conn.commit()
                print("既存のリーダーボードテーブルを削除しました。")
        except Exception as e:
            print(f"テーブル削除エラー: {str(e)}")
            sys.exit(1)
    
    if create_leaderboard_table():
        print("リーダーボードテーブルの初期化が完了しました。")
        
        # サンプルデータを追加するかどうか確認
        user_input = input("サンプルデータを追加しますか？(y/n): ")
        if user_input.lower() in ['y', 'yes']:
            db_manager = DBManager()
            try:
                with db_manager.get_connection() as conn:
                    cursor = conn.cursor()
                    
                    # サンプルデータを追加
                    sample_data = [
                        ('プレイヤー1', 1500, 12),
                        ('プレイヤー2', 2200, 15),
                        ('プレイヤー3', 1800, 10),
                        ('プレイヤー4', 3000, 20),
                        ('プレイヤー5', 1200, 8),
                    ]
                    
                    for name, score, terms_count in sample_data:
                        cursor.execute(
                            "INSERT INTO leaderboard (player_name, score, completed_terms_count) VALUES (?, ?, ?)",
                            (name, score, terms_count)
                        )
                    
                    conn.commit()
                    print(f"{len(sample_data)}件のサンプルデータを追加しました。")
            except Exception as e:
                print(f"サンプルデータ追加エラー: {str(e)}")
    else:
        print("リーダーボードテーブルの初期化に失敗しました。")