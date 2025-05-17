from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import string

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# リクエストボディ用のモデルを追加
class TermRequest(BaseModel):
    term: str

# リクエストモデルを追加
class RefreshGridRequest(BaseModel):
    terms: List[ITTerm]

# サンプル用語データ
it_terms = [
    ITTerm(term="HTTP", fullName="Hypertext Transfer Protocol", 
           description="Webページを転送するための通信プロトコル"),
    ITTerm(term="CSS", fullName="Cascading Style Sheets", 
           description="Webページのデザインを指定するための言語"),
    ITTerm(term="HTML", fullName="Hypertext Markup Language", 
           description="Webページを構成するためのマークアップ言語"),
    ITTerm(term="API", fullName="Application Programming Interface", 
           description="ソフトウェア間のインターフェース"),
    ITTerm(term="SQL", fullName="Structured Query Language", 
           description="データベースを操作するための言語")
]

@app.get("/api/terms", response_model=List[ITTerm])
def get_terms():
    return it_terms

@app.get("/api/game", response_model=GameGrid)
def generate_game():
    # 用語をランダムに5つ選択
    selected_terms = random.sample(it_terms, min(5, len(it_terms)))
    
    # 5x5のグリッドを生成
    grid = [['' for _ in range(5)] for _ in range(5)]
    
    # 用語をグリッドにランダムに配置
    for term in selected_terms:
        placed = False
        attempts = 0
        while not placed and attempts < 50:
            attempts += 1
            direction = random.choice(['horizontal', 'vertical'])
            if direction == 'horizontal' and len(term.term) <= 5:
                row = random.randint(0, 4)
                col = random.randint(0, 5 - len(term.term))
                can_place = all(grid[row][col+i] == '' for i in range(len(term.term)))
                if can_place:
                    for i, char in enumerate(term.term):
                        grid[row][col+i] = char
                    placed = True
            elif direction == 'vertical' and len(term.term) <= 5:
                row = random.randint(0, 5 - len(term.term))
                col = random.randint(0, 4)
                can_place = all(grid[row+i][col] == '' for i in range(len(term.term)))
                if can_place:
                    for i, char in enumerate(term.term):
                        grid[row+i][col] = char
                    placed = True
    
    # 空白を埋める
    for i in range(5):
        for j in range(5):
            if grid[i][j] == '':
                grid[i][j] = random.choice(string.ascii_uppercase)
    
    return GameGrid(grid=grid, terms=selected_terms)

@app.post("/api/validate")
def validate_term(request: TermRequest):
    term = request.term.upper()
    for it_term in it_terms:
        if it_term.term.upper() == term:
            return {"valid": True, "term": it_term}
    return {"valid": False}

@app.post("/api/refresh-grid", response_model=GameGrid)
def refresh_grid(request: BaseModel):
    # リクエストから現在のターム情報を取得
    current_terms = request.terms if hasattr(request, 'terms') else random.sample(it_terms, min(5, len(it_terms)))
    
    # 5x5のグリッドを生成
    grid = [['' for _ in range(5)] for _ in range(5)]
    
    # 用語をグリッドにランダムに配置
    for term in current_terms:
        placed = False
        attempts = 0
        while not placed and attempts < 50:
            attempts += 1
            direction = random.choice(['horizontal', 'vertical'])
            if direction == 'horizontal' and len(term.term) <= 5:
                row = random.randint(0, 4)
                col = random.randint(0, 5 - len(term.term))
                can_place = all(grid[row][col+i] == '' for i in range(len(term.term)))
                if can_place:
                    for i, char in enumerate(term.term):
                        grid[row][col+i] = char
                    placed = True
            elif direction == 'vertical' and len(term.term) <= 5:
                row = random.randint(0, 5 - len(term.term))
                col = random.randint(0, 4)
                can_place = all(grid[row+i][col] == '' for i in range(len(term.term)))
                if can_place:
                    for i, char in enumerate(term.term):
                        grid[row+i][col] = char
                    placed = True
    
    # 空白を埋める
    for i in range(5):
        for j in range(5):
            if grid[i][j] == '':
                grid[i][j] = random.choice(string.ascii_uppercase)
    
    return GameGrid(grid=grid, terms=current_terms)
