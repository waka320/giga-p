from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# IT用語データモデル
class ITTerm(BaseModel):
    term: str
    fullName: str
    description: str
    difficulty: int = 1

# ゲーム用のグリッドデータモデル
class GameGrid(BaseModel):
    grid: List[List[str]]
    terms: List[ITTerm]

# リクエストボディ用のモデル
class TermRequest(BaseModel):
    term: str

# リクエストモデル
class RefreshGridRequest(BaseModel):
    terms: List[ITTerm]

# 選択セルモデル
class CellSelection(BaseModel):
    row: int
    col: int

# 選択検証リクエスト
class ValidateSelectionRequest(BaseModel):
    selection: List[CellSelection]

# ゲームログエントリー
class GameLogEntry(BaseModel):
    """ゲームログエントリー"""
    action: str  # アクション種類（例: "単語完成", "ボーナス獲得"）
    details: Dict[str, Any]  # 詳細情報
    timestamp: datetime

    # モデルの設定
    model_config = {
        "arbitrary_types_allowed": True
    }

    @classmethod
    def create(cls, action: str, details: Dict[str, Any], timestamp: Optional[datetime] = None) -> 'GameLogEntry':
        """ログエントリを作成するヘルパーメソッド"""
        return cls(
            action=action, 
            details=details, 
            timestamp=timestamp or datetime.now()
        )

# ゲームセッションモデル
class GameSession(BaseModel):
    session_id: str
    grid: List[List[str]]
    terms: List[ITTerm]
    score: int = 0
    completed_terms: List[ITTerm] = []
    combo_count: int = 0
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = "active"  # "active", "completed"
    logs: List[GameLogEntry] = []

    def add_log(self, action: str, details: Dict[str, Any]) -> None:
        """ゲームログにエントリーを追加"""
        self.logs.append(GameLogEntry.create(action, details))

# ゲームステータスモデル
class GameStatus(BaseModel):
    session_id: str
    score: int
    grid: List[List[str]]
    remaining_time: int
    status: str
    completed_terms: List[ITTerm]
    combo_count: int
    bonus_message: Optional[str] = None
    bonus_points: Optional[int] = None