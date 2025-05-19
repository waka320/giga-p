import os
import pyodbc
import logging
from dotenv import load_dotenv
from contextlib import contextmanager
from azure.identity import DefaultAzureCredential

load_dotenv()

class DBManager:
    _instance = None
    _connection_pool = []
    _pool_size = 5

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DBManager, cls).__new__(cls)
            cls._instance._init_connection_pool()
        return cls._instance

    def _init_connection_pool(self):
        """接続プールを初期化"""
        for _ in range(self._pool_size):
            try:
                conn = self._create_connection()
                self._connection_pool.append(conn)
            except Exception as e:
                logging.error(f"Connection pool initialization error: {str(e)}")

    def _create_connection(self):
        """新しいデータベース接続を作成"""
        server = os.getenv("AZURE_SQL_SERVER")
        database = os.getenv("AZURE_SQL_DATABASE")
        username = os.getenv("AZURE_SQL_USERNAME")
        password = os.getenv("AZURE_SQL_PASSWORD")
        
        # 通常の接続文字列認証
        if username and password:
            conn_str = f"Driver={{ODBC Driver 18 for SQL Server}};Server={server};Database={database};Uid={username};Pwd={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
            return pyodbc.connect(conn_str)
        
        # Azure Managed Identityを使用する場合
        else:
            credential = DefaultAzureCredential()
            token = credential.get_token("https://database.windows.net/")
            conn_str = f"Driver={{ODBC Driver 18 for SQL Server}};Server={server};Database={database};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
            conn = pyodbc.connect(conn_str, attrs_before={1256: token.token})
            return conn

    @contextmanager
    def get_connection(self):
        """接続プールから接続を取得するコンテキストマネージャー"""
        connection = None
        
        try:
            if self._connection_pool:
                connection = self._connection_pool.pop()
            else:
                connection = self._create_connection()
                
            yield connection
        except Exception as e:
            logging.error(f"Database connection error: {str(e)}")
            # 接続が壊れている場合は新しい接続を作成して置き換え
            if connection:
                try:
                    connection.close()
                except:
                    pass
                connection = self._create_connection()
            raise
        finally:
            if connection:
                try:
                    # 接続がまだ有効かチェック
                    connection.execute("SELECT 1")
                    self._connection_pool.append(connection)
                except:
                    # 接続が無効なら閉じて新しいものを作成
                    try:
                        connection.close()
                    except:
                        pass
                    self._connection_pool.append(self._create_connection())