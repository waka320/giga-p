import random
import string
import math
from typing import List, Dict, Tuple
from models import ITTerm

def generate_game_grid(terms: List[ITTerm]) -> List[List[str]]:
    """
    用語をグリッドに配置し、5x5のグリッドを生成
    """
    # 5x5のグリッドを生成
    grid = [['' for _ in range(5)] for _ in range(5)]
    
    # 用語をグリッドにランダムに配置
    for term in terms:
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
    
    return grid

def calculate_points(word_length: int, combo_count: int) -> int:
    """ポイント計算ロジック"""
    base_points = word_length * 10
    combo_multiplier = min(3, 1 + combo_count * 0.25)
    return math.floor(base_points * combo_multiplier)

def create_new_grid(grid: List[List[str]], selection: List[Dict[str, int]]) -> List[List[str]]:
    """選択されたセルを空にした新しいグリッドを作成"""
    new_grid = [row[:] for row in grid]
    for cell in selection:
        new_grid[cell["row"]][cell["col"]] = ""
    return new_grid

def get_selected_word(grid: List[List[str]], selection: List[Dict[str, int]]) -> str:
    """選択されたセルからワードを生成"""
    return "".join([grid[cell["row"]][cell["col"]] for cell in selection])