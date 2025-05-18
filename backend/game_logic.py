import random
import string
import math
from typing import List, Dict, Tuple
from models import ITTerm


def generate_game_grid(terms: List[ITTerm], debug: bool = False) -> List[List[str]]:
    """
    用語をグリッドに配置し、5x5のグリッドを生成

    Args:
        terms: 配置する用語のリスト
        debug: Trueの場合、デバッグ用の単純なグリッドを生成
    """
    # デバッグモードの場合は単純なグリッドを作成
    if debug:
        # 5x5のグリッドを生成
        grid = [['' for _ in range(5)] for _ in range(5)]

        # デバッグ用の単純な単語を配置
        debug_words = ["AAAAA", "BBBBB", "CCCCC", "DDDDD", "EEEEE"]

        # 各単語を横方向に配置
        for i, word in enumerate(debug_words[:min(5, len(debug_words))]):
            for j, char in enumerate(word[:5]):
                if i < 5 and j < 5:  # グリッドの範囲内か確認
                    grid[i][j] = char

        return grid

    # 通常モード - 以下は元のコード
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
                can_place = all(grid[row][col+i] ==
                                '' for i in range(len(term.term)))
                if can_place:
                    for i, char in enumerate(term.term):
                        grid[row][col+i] = char
                    placed = True
            elif direction == 'vertical' and len(term.term) <= 5:
                row = random.randint(0, 5 - len(term.term))
                col = random.randint(0, 4)
                can_place = all(grid[row+i][col] ==
                                '' for i in range(len(term.term)))
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


def calculate_points(full_name: str, combo_count: int) -> int:
    """
    仕様に基づいてポイントを計算する
    full_name: 元の用語の完全名称（例："Cascading Style Sheets"）
    combo_count: 現在のコンボ数
    """
    # スペースを除いた文字数を数える
    char_count = len(full_name.replace(" ", ""))

    # 新しい計算式：(元の文字数) × (10 + コンボ数)
    return char_count * (10 + combo_count)


def create_new_grid(grid: List[List[str]], selection: List) -> List[List[str]]:
    """選択されたセルを空にした新しいグリッドを作成"""
    new_grid = [row[:] for row in grid]
    for cell in selection:
        new_grid[cell.row][cell.col] = ""
    return new_grid


def get_selected_word(grid: List[List[str]], selection: List) -> str:
    """選択されたセルからワードを生成"""
    return "".join([grid[cell.row][cell.col] for cell in selection])


def check_field_bonus(grid: List[List[str]]) -> Tuple[int, str, bool]:
    """フィールドの状態に応じたボーナスを計算

    Returns:
        Tuple[int, str, bool]: (ボーナスポイント, ボーナスメッセージ, リセットフラグ)
    """
    # 残りのセル数をカウント
    remaining_cells = sum(sum(1 for cell in row if cell != "") for row in grid)

    # 全消しの場合
    if remaining_cells == 0:
        return 1000, "全消しボーナス！ +1000点", True

    # 残りが1マス以下の場合のみリセット
    elif remaining_cells <= 1:
        bonus = (6 - remaining_cells) * 50
        return bonus, f"残り{remaining_cells}マスボーナス！ +{bonus}点", True

    # 残りが2～5マスの場合はリセットしない
    elif remaining_cells <= 5:
        bonus = (6 - remaining_cells) * 50
        return bonus, f"残り{remaining_cells}マスボーナス！ +{bonus}点", False

    # それ以外の場合
    return 0, "", False
