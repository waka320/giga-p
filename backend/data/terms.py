from typing import List, Optional
from models import ITTerm
from database.term_repository import TermRepository

# リポジトリのインスタンスを作成
_term_repository = TermRepository()

# メモリ内データのバックアップ（データベース接続失敗時のフォールバック用）
_it_terms_backup = [



    ITTerm(term="JAVA", fullName="Java",
           description="オブジェクト指向のプログラミング言語"),
    ITTerm(term="RUBY", fullName="Ruby",
           description="シンプルさを重視したオブジェクト指向言語"),
    ITTerm(term="PERL", fullName="Practical Extraction and Report Language",
           description="テキスト処理に強いスクリプト言語"),
    ITTerm(term="TS", fullName="TypeScript",
           description="JavaScriptに型システムを追加した言語"),
    ITTerm(term="NET", fullName="DotNet Framework",
           description="Microsoftが開発したアプリケーションフレームワーク"),

    # データベース技術

    ITTerm(term="NoSQL", fullName="Not Only SQL",
           description="非リレーショナルデータベースの総称"),


    ITTerm(term="MITM", fullName="Man In The Middle",
           description="通信の間に第三者が介入する攻撃手法"),


    # 開発プロセスと手法
    ITTerm(term="CI", fullName="Continuous Integration",
           description="継続的にコードの統合とテストを行う開発手法"),
    ITTerm(term="CD", fullName="Continuous Deployment",
           description="継続的にソフトウェアをデプロイする開発手法"),
    ITTerm(term="TDD", fullName="Test Driven Development",
           description="テストを先に書いてから実装する開発手法"),
    ITTerm(term="DDD", fullName="Domain Driven Design",
           description="ドメインモデルを中心に設計する開発手法"),
    ITTerm(term="SCRUM", fullName="Scrum",
           description="アジャイル開発手法の一種"),

    # その他のIT用語
    ITTerm(term="IoT", fullName="Internet of Things",
           description="モノのインターネット、様々な機器をネットワークに接続する技術"),

    ITTerm(term="DL", fullName="Deep Learning",
           description="ニューラルネットワークを使用した機械学習の一種"),
    ITTerm(term="AR", fullName="Augmented Reality",
           description="拡張現実技術"),

    ITTerm(term="PWA", fullName="Progressive Web Application",
           description="Webとアプリの利点を組み合わせた新しいアプローチ")
]

def get_terms() -> List[ITTerm]:
    """すべてのIT用語を取得"""
    try:
        # データベースから用語を取得
        return _term_repository.get_all_terms()
    except Exception as e:
        # エラーログ記録はリポジトリ内で行われる
        # データベース接続エラー時はバックアップデータを返す
        print(f"Error retrieving terms from database, using backup: {str(e)}")
        return _it_terms_backup

def find_term(term_str: str) -> Optional[ITTerm]:
    """指定された文字列に一致する用語を検索"""
    try:
        # データベースから用語を検索
        return _term_repository.find_term_by_name(term_str)
    except Exception as e:
        # データベース接続エラー時はバックアップデータから検索
        print(f"Error finding term in database, using backup: {str(e)}")
        term_upper = term_str.upper()
        for term in _it_terms_backup:
            if term.term.upper() == term_upper:
                return term
        return None

def add_term(term: ITTerm) -> bool:
    """新しい用語を追加（データベースへの追加のみ、バックアップには追加しない）"""
    return _term_repository.add_term(term)

def seed_database():
    """バックアップデータを使ってデータベースに初期データを投入"""
    success_count = 0
    for term in _it_terms_backup:
        if _term_repository.add_term(term):
            success_count += 1
    
    return success_count
