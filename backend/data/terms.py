from typing import List, Optional
from models import ITTerm
from database.term_repository import TermRepository
from datetime import datetime, timedelta
import logging

# ロガーの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# リポジトリのインスタンスを作成
_term_repository = TermRepository()

# メモリキャッシュ関連の変数
_terms_cache: List[ITTerm] = []
_cache_last_updated: Optional[datetime] = None
_cache_ttl = timedelta(hours=48)  # キャッシュの有効期間: 48時間（2日）

# メモリ内データのバックアップ（データベース接続失敗時のフォールバック用）
_it_terms_backup = [



    ITTerm(term="TS", fullName="TypeScript",
           description="JavaScriptに型システムを追加した言語"),
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
    # 6/10
    ITTerm(term="BB", fullName="Broadband",
           description="高速・大容量のデータ通信が可能なインターネット接続方式"),
    ITTerm(term="DTM", fullName="Dynamic Tag Manager",
           description="Adobeが提供するWebサイトのタグ管理システム"),
    ITTerm(term="FEP", fullName="Front-End Processor",
           description="ホストコンピュータの前段でデータ入出力を制御する装置"),
    ITTerm(term="IX", fullName="Internet Exchange",
           description="インターネット接続事業者間のネットワーク相互接続点"),
    ITTerm(term="JPNIC", fullName="Japan Network Information Center",
           description="日本のインターネットアドレスやドメイン名を管理する組織"),
    ITTerm(term="JPRS", fullName="Japan Registry Services",
           description="日本国内のドメイン名登録・管理を行う機関"),
    ITTerm(term="MD", fullName="MiniDisc / Master Data",
           description="ソニーが開発した光ディスクメディア、または業務データの基盤となるマスターデータ"),
    ITTerm(term="MO", fullName="Magneto-Optical disk",
           description="レーザー光と磁気を用いた光磁気ディスク記憶媒体"),
    ITTerm(term="POX", fullName="Plain Old XML",
           description="シンプルなXML形式でデータ交換を行う手法"),
    ITTerm(term="SIGINT", fullName="Signals Intelligence",
           description="電子信号や通信の傍受による情報収集活動"),
    ITTerm(term="TX", fullName="Total Experience",
           description="顧客・ユーザー・従業員体験を統合した戦略的アプローチ"),
    ITTerm(term="CUI", fullName="Character-based User Interface",
           description="文字だけで操作するユーザーインターフェース"),
    ITTerm(term="LTS", fullName="Long-Term Support",
           description="ソフトウェアの長期間安定サポートを意味するバージョン"),
    ITTerm(term="RM", fullName="Remove",
           description="UrmX系OSでファイルやディレクトリを削除するコマンド"),
    ITTerm(term="DM", fullName="Direct Message",
           description="SNSやチャットで利用される1対1の非公開メッセージ機能"),
    ITTerm(term="PDM", fullName="Product Data Management",
           description="設計・開発部門の成果物を一元管理するITシステム"),
    # 6/11
    ITTerm(term="DRY", fullName="Don't Repeat Yourself",
           description="同じ意味や機能を持つ情報の重複を避けるソフトウェア開発原則"),
    ITTerm(term="EC", fullName="Electronic Commerce",
           description="電子的な手段を介して行う商取引の総称"),
    ITTerm(term="IAM", fullName="Identity and Access Management",
           description="システムの利用者IDを管理し、アクセス権限を制御するセキュリティ機能"),
    ITTerm(term="VC", fullName="Visual C++",
           description="マイクロソフト製のC/C++統合開発環境"),
    ITTerm(term="XSS", fullName="Cross Site Scripting",
           description="Webアプリケーションの脆弱性を利用した悪意あるスクリプト注入攻撃"),
    ITTerm(term="re", fullName="reply",
           description="re:のこと。電子メールやネットニュースなどで返信であることを示す記号電子メールやネットニュースなどで返信であることを示す記号"),
    ITTerm(term="MUI", fullName="Material-UI",
           description="Googleのマテリアルデザインを実装したReact用UIコンポーネントライブラリ"),
    ITTerm(term="NET", fullName=".NET Framework",
           description="マイクロソフトが開発したアプリケーション開発・実行環境"),
    ITTerm(term="li", fullName="List Item",
           description="HTMLのリスト項目を表すタグ要素"),
    ITTerm(term="WP", fullName="WordPress",
           description="PHPで開発されたオープンソースのコンテンツ管理システム"),
    ITTerm(term="ID", fullName="Identifier",
           description="他の対象から特定の一つを識別・同定するために用いられる名前や符号"),
    ITTerm(term="WET", fullName="Write Everything Twice",
           description="同じコードを重複して記述してしまうプログラミングのアンチパターン"),
    ITTerm(term="KISS", fullName="Keep It Simple, Stupid",
           description="シンプルさを設計目標とする設計原則"),
    ITTerm(term="SOLID", fullName="Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion",
           description="保守性・拡張性の高いコードを書くためのオブジェクト指向プログラミング5原則"),
    ITTerm(term="YAGNI", fullName="You Aren't Gonna Need It",
           description="実際に必要となるまで機能を追加しないというエクストリーム・プログラミングの原則"),
    ITTerm(term="PID", fullName="Process ID",
           description="コンピュータシステムで実行中のプロセスを一意に識別するための番号"),





]


def _is_cache_valid() -> bool:
    """キャッシュが有効かどうかを判定"""
    if not _cache_last_updated:
        return False
    return datetime.now() - _cache_last_updated < _cache_ttl


def _update_cache() -> bool:
    """キャッシュを更新"""
    global _terms_cache, _cache_last_updated
    
    try:
        # データベースから全用語を取得
        terms = _term_repository.get_all_terms()
        if terms:
            _terms_cache = terms
            _cache_last_updated = datetime.now()
            logger.info(f"IT用語キャッシュを更新しました。{len(terms)}件の用語を読み込みました。")
            return True
    except Exception as e:
        logger.error(f"キャッシュ更新中にエラーが発生: {str(e)}")
        # キャッシュが空の場合はバックアップデータで初期化
        if not _terms_cache:
            logger.info("バックアップデータからキャッシュを初期化します")
            _terms_cache = _it_terms_backup.copy()
            _cache_last_updated = datetime.now()
    return False


def get_terms() -> List[ITTerm]:
    """すべてのIT用語を取得（キャッシュ対応）"""
    # キャッシュが無効か空なら更新を試みる
    if not _is_cache_valid() or not _terms_cache:
        _update_cache()
    
    # キャッシュが利用可能ならキャッシュを返す
    if _terms_cache:
        return _terms_cache
    
    # キャッシュもバックアップデータも利用できない場合は最後の手段としてDBに直接アクセス
    try:
        return _term_repository.get_all_terms()
    except Exception as e:
        logger.error(f"データベースアクセスエラー、バックアップデータを使用: {str(e)}")
        return _it_terms_backup


def find_term(term_str: str) -> Optional[ITTerm]:
    """指定された文字列に一致する用語を検索（キャッシュ対応）"""
    # キャッシュが無効か空なら更新を試みる
    if not _is_cache_valid() or not _terms_cache:
        _update_cache()
    
    # キャッシュから検索
    term_upper = term_str.upper()
    
    # キャッシュが利用可能ならキャッシュから検索
    if _terms_cache:
        for term in _terms_cache:
            if term.term.upper() == term_upper:
                return term
    
    # キャッシュにない場合はDBを直接検索
    try:
        term = _term_repository.find_term_by_name(term_str)
        if term:
            return term
    except Exception as e:
        logger.error(f"データベース検索エラー、バックアップデータを使用: {str(e)}")
        # バックアップデータから検索
        for term in _it_terms_backup:
            if term.term.upper() == term_upper:
                return term
    
    return None


def add_term(term: ITTerm) -> bool:
    """新しい用語を追加（キャッシュも更新）"""
    success = _term_repository.add_term(term)
    if success:
        # キャッシュに新しい用語を追加
        global _terms_cache
        if _terms_cache:
            # すでに同じ用語が存在しないか確認
            exists = False
            for cached_term in _terms_cache:
                if cached_term.term.upper() == term.term.upper():
                    exists = True
                    break
            
            if not exists:
                _terms_cache.append(term)
                logger.info(f"キャッシュに新しい用語を追加: {term.term}")
    return success


def seed_database():
    """バックアップデータを使ってデータベースに初期データを投入"""
    success_count = 0
    for term in _it_terms_backup:
        if _term_repository.add_term(term):
            success_count += 1

    # データベース初期化後にキャッシュも更新
    _update_cache()
    return success_count

# アプリケーション起動時に一度キャッシュを初期化
_update_cache()
