from pydantic import BaseModel
import csv
import logging
from pathlib import Path
from database.term_repository import TermRepository
from database.db_manager import DBManager
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


class ITTerm(BaseModel):
    term: str
    fullName: str
    description: str
    difficulty: int = 1


# ロギングの設定
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def import_terms_from_csv(csv_file_path):
    """CSVファイルからIT用語をインポートしデータベースに登録する"""
    if not os.path.exists(csv_file_path):
        logger.error(f"CSVファイルが見つかりません: {csv_file_path}")
        return False

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

                # CSVファイルの列を適切にマッピングする（必須フィールドのみ）
                term = row[0].strip()
                full_name = row[1].strip()
                description = row[2].strip()

                # 用語オブジェクトを作成（必須フィールドのみ）
                it_term = ITTerm(
                    term=term,
                    fullName=full_name,
                    description=description
                )

                # データベースに登録
                if term_repo.add_term(it_term):
                    success_count += 1
                    if total_count % 50 == 0:
                        logger.info(f"進捗: {success_count}/{total_count} 件登録完了")

    except Exception as e:
        logger.error(f"CSVのインポート中にエラーが発生しました: {str(e)}")
        return False

    logger.info(f"インポート完了: 合計 {total_count} 件中 {success_count} 件登録成功")
    return True


if __name__ == "__main__":
    # コマンドライン引数でCSVファイルパスを指定できるようにする
    import argparse
    parser = argparse.ArgumentParser(description='IT用語のCSVファイルをデータベースに登録します')
    parser.add_argument('--csv', default='../data/merged_it_terms.csv',
                        help='CSVファイルのパス (デフォルト: ../data/merged_it_terms.csv)')
    args = parser.parse_args()

    csv_path = args.csv
    if not os.path.isabs(csv_path):
        # 相対パスの場合、スクリプトの場所からの相対パスに変換
        csv_path = os.path.join(os.path.dirname(__file__), csv_path)

    logger.info(f"CSVファイル '{csv_path}' からデータをインポートします...")
    import_terms_from_csv(csv_path)
