from pydantic import BaseModel
from typing import List, Optional, Dict
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