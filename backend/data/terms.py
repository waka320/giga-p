from models import ITTerm

# サンプル用語データ
it_terms = [
    # 既存の用語
    ITTerm(term="HTTP", fullName="Hypertext Transfer Protocol",
           description="Webページを転送するための通信プロトコル"),
    ITTerm(term="CSS", fullName="Cascading Style Sheets",
           description="Webページのデザインを指定するための言語"),
    ITTerm(term="HTML", fullName="Hypertext Markup Language",
           description="Webページを構成するためのマークアップ言語"),
    ITTerm(term="API", fullName="Application Programming Interface",
           description="ソフトウェア間のインターフェース"),
    ITTerm(term="SQL", fullName="Structured Query Language",
           description="データベースを操作するための言語"),

    # ネットワーク関連
    ITTerm(term="TCP", fullName="Transmission Control Protocol",
           description="インターネット通信の信頼性を確保するプロトコル"),
    ITTerm(term="IP", fullName="Internet Protocol",
           description="インターネット上でのデータ転送を管理するプロトコル"),
    ITTerm(term="DNS", fullName="Domain Name System",
           description="ドメイン名をIPアドレスに変換するシステム"),
    ITTerm(term="FTP", fullName="File Transfer Protocol",
           description="ファイル転送のための通信プロトコル"),
    ITTerm(term="SMTP", fullName="Simple Mail Transfer Protocol",
           description="電子メールを送信するためのプロトコル"),
    ITTerm(term="IMAP", fullName="Internet Message Access Protocol",
           description="電子メールの受信を管理するプロトコル"),
    ITTerm(term="VPN", fullName="Virtual Private Network",
           description="プライベートネットワークを公共ネットワーク上に構築する技術"),

    # プログラミング言語とフレームワーク
    ITTerm(term="PHP", fullName="PHP Hypertext Preprocessor",
           description="Web開発用のスクリプト言語"),
    ITTerm(term="JAVA", fullName="Java",
           description="オブジェクト指向のプログラミング言語"),
    ITTerm(term="RUBY", fullName="Ruby",
           description="シンプルさを重視したオブジェクト指向言語"),
    ITTerm(term="PERL", fullName="Practical Extraction and Report Language",
           description="テキスト処理に強いスクリプト言語"),
    ITTerm(term="JS", fullName="JavaScript",
           description="Webブラウザで動作するスクリプト言語"),
    ITTerm(term="TS", fullName="TypeScript",
           description="JavaScriptに型システムを追加した言語"),
    ITTerm(term="NET", fullName="DotNet Framework",
           description="Microsoftが開発したアプリケーションフレームワーク"),

    # データベース技術
    ITTerm(term="DBMS", fullName="Database Management System",
           description="データベースを管理するためのソフトウェア"),
    ITTerm(term="RDBMS", fullName="Relational Database Management System",
           description="リレーショナルモデルに基づくデータベース管理システム"),
    ITTerm(term="NoSQL", fullName="Not Only SQL",
           description="非リレーショナルデータベースの総称"),
    ITTerm(term="ORM", fullName="Object Relational Mapping",
           description="オブジェクトとリレーショナルデータベースを紐づける技術"),

    # セキュリティ関連
    ITTerm(term="SSL", fullName="Secure Sockets Layer",
           description="通信を暗号化するセキュリティプロトコル"),
    ITTerm(term="TLS", fullName="Transport Layer Security",
           description="SSLの後継となる通信暗号化プロトコル"),
    ITTerm(term="XSS", fullName="Cross Site Scripting",
           description="Webサイトに悪意のあるスクリプトを挿入する攻撃"),
    ITTerm(term="CSRF", fullName="Cross Site Request Forgery",
           description="ユーザーに意図しないリクエストを送信させる攻撃"),
    ITTerm(term="MITM", fullName="Man In The Middle",
           description="通信の間に第三者が介入する攻撃手法"),

    # クラウドとインフラ
    ITTerm(term="AWS", fullName="Amazon Web Services",
           description="Amazonが提供するクラウドコンピューティングサービス"),
    ITTerm(term="GCP", fullName="Google Cloud Platform",
           description="Googleが提供するクラウドコンピューティングサービス"),
    ITTerm(term="IaaS", fullName="Infrastructure as a Service",
           description="インフラをサービスとして提供するクラウドモデル"),
    ITTerm(term="PaaS", fullName="Platform as a Service",
           description="プラットフォームをサービスとして提供するクラウドモデル"),
    ITTerm(term="SaaS", fullName="Software as a Service",
           description="ソフトウェアをサービスとして提供するクラウドモデル"),
    ITTerm(term="VM", fullName="Virtual Machine",
           description="物理的なコンピュータ上に作られた仮想コンピュータ"),

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
    ITTerm(term="AI", fullName="Artificial Intelligence",
           description="人工知能技術"),
    ITTerm(term="ML", fullName="Machine Learning",
           description="機械学習技術"),
    ITTerm(term="DL", fullName="Deep Learning",
           description="ニューラルネットワークを使用した機械学習の一種"),
    ITTerm(term="AR", fullName="Augmented Reality",
           description="拡張現実技術"),
    ITTerm(term="VR", fullName="Virtual Reality",
           description="仮想現実技術"),
    ITTerm(term="UI", fullName="User Interface",
           description="ユーザーとシステムの接点となる部分"),
    ITTerm(term="UX", fullName="User Experience",
           description="ユーザーの体験や満足度に関わる概念"),
    ITTerm(term="SEO", fullName="Search Engine Optimization",
           description="検索エンジン最適化"),
    ITTerm(term="SPA", fullName="Single Page Application",
           description="単一ページで構成されるWebアプリケーション"),
    ITTerm(term="PWA", fullName="Progressive Web Application",
           description="Webとアプリの利点を組み合わせた新しいアプローチ"),
    ITTerm(term="REST", fullName="Representational State Transfer",
           description="Webサービスの設計原則のひとつ"),
    ITTerm(term="JSON", fullName="JavaScript Object Notation",
           description="データ交換フォーマットの一種"),
    ITTerm(term="XML", fullName="Extensible Markup Language",
           description="データ構造を表現するためのマークアップ言語")

]


def get_terms():
    return it_terms


def find_term(term_str: str):
    """指定された文字列に一致する用語を検索"""
    term_upper = term_str.upper()
    for term in it_terms:
        if term.term.upper() == term_upper:
            return term
    return None
