import sys
import os
import csv
import logging

# 先にパスを追加してから相対インポートを行う
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 絶対インポートに変更
from database.db_manager import DBManager
from data.terms import seed_database
from models import ITTerm
from database.term_repository import TermRepository

# ロギングの設定
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def create_table():
    """ITTermsテーブルの作成（既存のテーブルがある場合は削除して再作成）"""
    drop_and_create_table_sql = """
    IF EXISTS (SELECT * FROM sys.tables WHERE name = 'ITTerms')
    BEGIN
        DROP TABLE ITTerms;
        PRINT 'テーブルを削除しました';
    END

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
    """

    db_manager = DBManager()
    try:
        with db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(drop_and_create_table_sql)
            conn.commit()
            print("テーブルの削除と再作成に成功しました")
    except Exception as e:
        print(f"テーブル作成エラー: {str(e)}")
        return False

    return True


def import_terms_from_csv(csv_file_path):
    """CSVファイルからIT用語をインポートしデータベースに登録する"""
    if not os.path.exists(csv_file_path):
        logger.error(f"CSVファイルが見つかりません: {csv_file_path}")
        return 0

    term_repo = TermRepository()
    total_count = 0
    success_count = 0

    try:
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            # ヘッダー行をスキップ
            next(csv_reader)

            for row in csv_reader:
                total_count += 1
                if len(row) < 3:
                    logger.warning(f"行 {total_count}: データ不足 - {row}")
                    continue

                # CSVファイルの列を適切にマッピング
                term = row[0].strip()
                full_name = row[1].strip()
                description = row[2].strip()

                # 難易度がある場合は取得
                difficulty = 1
                if len(row) > 3 and row[3].strip().isdigit():
                    difficulty = int(row[3].strip())

                # 用語オブジェクトを作成
                it_term = ITTerm(
                    term=term,
                    fullName=full_name,
                    description=description,
                    difficulty=difficulty
                )

                # データベースに登録
                if term_repo.add_term(it_term):
                    success_count += 1
                    if success_count % 50 == 0:
                        logger.info(f"進捗: {success_count}/{total_count} 件登録完了")

    except Exception as e:
        logger.error(f"CSVのインポート中にエラーが発生しました: {str(e)}")
        return success_count

    logger.info(f"インポート完了: 合計 {total_count} 件中 {success_count} 件登録成功")
    return success_count


if __name__ == "__main__":
    print("データベース初期化を開始します...")

    if create_table():
        # デフォルトのシードデータを投入
        print("デフォルトの初期データの投入を開始します...")
        count1 = seed_database()
        print(f"デフォルト初期データ投入完了: {count1}件のIT用語を追加しました")

        # CSVファイルからのデータ投入
        csv_path = os.path.join(os.path.dirname(
            __file__), '..', 'data', 'merged_it_terms.csv')
        print(f"CSVファイル '{csv_path}' からの初期データ投入を開始します...")
        count2 = import_terms_from_csv(csv_path)
        print(f"CSV初期データ投入完了: {count2}件のIT用語を追加しました")

        print(f"初期データ投入完了: 合計 {count1 + count2}件のIT用語を追加しました")
    else:
        print("テーブル作成に失敗したため、初期データの投入をスキップします")
