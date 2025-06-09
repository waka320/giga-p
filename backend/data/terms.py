from typing import List, Optional
from models import ITTerm
from database.term_repository import TermRepository

# リポジトリのインスタンスを作成
_term_repository = TermRepository()

# メモリ内データのバックアップ（データベース接続失敗時のフォールバック用）
_it_terms_backup = [



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
           description="Webとアプリの利点を組み合わせた新しいアプローチ"),
    # 6/9
    ITTerm(term="LLM", fullName="Large Language Model",
           description="大規模なデータで訓練された自然言語処理モデル"),
    ITTerm(term="QR", fullName="Quick Response Code",
           description="情報を格納できる2次元バーコード"),
    ITTerm(term="RDB", fullName="Relational Database",
           description="テーブル間の関係を利用するデータベース"),
    ITTerm(term="LS", fullName="List Directory",
           description="UNIX系OSでディレクトリ内容を表示するコマンド"),
    ITTerm(term="VS", fullName="Visual Studio",
           description="Microsoft社の統合開発環境"),
    ITTerm(term="DDoS", fullName="Distributed Denial of Service",
           description="複数のコンピュータから攻撃するサービス妨害攻撃"),
    ITTerm(term="AA", fullName="ASCII Art",
           description="文字や記号で描かれたアート作品...もしくはこのゲームのタイトル「アクロアタック.」のこと。"),
    ITTerm(term="NN", fullName="Neural Network",
           description="人間の脳を模した機械学習モデル"),
    ITTerm(term="VAE", fullName="Variational Autoencoder",
           description="生成モデルの一種であるオートエンコーダ"),
    ITTerm(term="WSL", fullName="Windows Subsystem for Linux",
           description="Windows上でLinux環境を実行できる機能"),
    ITTerm(term="BD", fullName="Blu-ray Disc",
           description="大容量光ディスク記憶媒体"),
    ITTerm(term="FFT", fullName="Fast Fourier Transform",
           description="高速フーリエ変換。信号処理で用いられるアルゴリズム"),
    ITTerm(term="DS", fullName="Data Science",
           description="データを解析し価値を引き出す学問・技術"),
    ITTerm(term="AU", fullName="Audio Format",
           description="サン・マイクロシステムズが開発した音声ファイル形式"),
    ITTerm(term="GAN", fullName="Generative Adversarial Network",
           description="生成モデルの一種で、敵対的学習を用いるニューラルネットワーク"),
    ITTerm(term="SA", fullName="Simulated Annealing",
           description="組合せ最適化問題を解くための確率的アルゴリズム"),
    ITTerm(term="WAV", fullName="Waveform Audio File Format",
           description="音声データを保存するファイル形式"),
    ITTerm(term="VHS", fullName="Video Home System",
           description="家庭用ビデオテープの規格"),
    ITTerm(term="npm", fullName="Node Package Manager",
           description="Node.jsのパッケージ管理ツール"),
    ITTerm(term="src", fullName="Source Code",
           description="プログラムのソースコード"),
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
