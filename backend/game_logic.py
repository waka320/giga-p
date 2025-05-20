import random
import string
import math
from typing import List, Dict, Tuple
from models import ITTerm


def generate_game_grid(terms: List[ITTerm], debug: bool = False) -> List[List[str]]:
    """
    用語をグリッドに配置し、5x5のグリッドを生成
    全消しが可能なレイアウトを目指す

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

    # 通常モード - 最適化版
    # 5x5のグリッドを生成
    grid = [['' for _ in range(5)] for _ in range(5)]
    
    # 使用済みセルを追跡
    used_cells = set()
    
    # 単語の配置方向をシャッフル
    directions = ['horizontal', 'vertical', 'diagonal', 'reverse_diagonal']
    
    # 各単語について複数回配置を試みる
    for term in terms:
        # termの値を大文字に変換してグリッドに配置するために一時変数に保存
        uppercase_term = term.term.upper()
        random.shuffle(directions)
        placed = False
        
        # 各方向で配置を試みる
        for direction in directions:
            if placed:
                break
                
            # 最大試行回数
            max_attempts = 30
            attempt = 0
            
            while not placed and attempt < max_attempts:
                attempt += 1
                
                # 現在の使用済みセル数
                current_usage = len(used_cells)
                
                # 単語を配置する可能なすべての位置を取得
                possible_positions = []
                
                if direction == 'horizontal' and len(uppercase_term) <= 5:
                    for row in range(5):
                        for col in range(6 - len(uppercase_term)):
                            can_place = True
                            new_cells = []
                            
                            for i, char in enumerate(uppercase_term):
                                cell_pos = (row, col + i)
                                # グリッドの文字も大文字として比較
                                if grid[row][col + i] != '' and grid[row][col + i] != char:
                                    can_place = False
                                    break
                                
                                if grid[row][col + i] == '':
                                    new_cells.append(cell_pos)
                            
                            if can_place:
                                # 新しく使用するセル数と位置を記録
                                possible_positions.append({
                                    'row': row,
                                    'col': col,
                                    'new_cells': new_cells,
                                    'cell_count': len(new_cells)
                                })
                
                elif direction == 'vertical' and len(uppercase_term) <= 5:
                    # 縦方向の配置ロジック（横と同様）
                    for row in range(6 - len(uppercase_term)):
                        for col in range(5):
                            can_place = True
                            new_cells = []
                            
                            for i, char in enumerate(uppercase_term):
                                cell_pos = (row + i, col)
                                if grid[row + i][col] != '' and grid[row + i][col] != char:
                                    can_place = False
                                    break
                                
                                if grid[row + i][col] == '':
                                    new_cells.append(cell_pos)
                            
                            if can_place:
                                possible_positions.append({
                                    'row': row,
                                    'col': col,
                                    'new_cells': new_cells,
                                    'cell_count': len(new_cells)
                                })
                
                # 対角線方向の配置も追加（オプション）
                elif direction == 'diagonal' and len(uppercase_term) <= 5:
                    for row in range(6 - len(uppercase_term)):
                        for col in range(6 - len(uppercase_term)):
                            can_place = True
                            new_cells = []
                            
                            for i, char in enumerate(uppercase_term):
                                cell_pos = (row + i, col + i)
                                if grid[row + i][col + i] != '' and grid[row + i][col + i] != char:
                                    can_place = False
                                    break
                                
                                if grid[row + i][col + i] == '':
                                    new_cells.append(cell_pos)
                            
                            if can_place:
                                possible_positions.append({
                                    'row': row,
                                    'col': col,
                                    'new_cells': new_cells,
                                    'cell_count': len(new_cells)
                                })
                
                elif direction == 'reverse_diagonal' and len(uppercase_term) <= 5:
                    for row in range(6 - len(uppercase_term)):
                        for col in range(len(uppercase_term) - 1, 5):
                            can_place = True
                            new_cells = []
                            
                            for i, char in enumerate(uppercase_term):
                                cell_pos = (row + i, col - i)
                                if grid[row + i][col - i] != '' and grid[row + i][col - i] != char:
                                    can_place = False
                                    break
                                
                                if grid[row + i][col - i] == '':
                                    new_cells.append(cell_pos)
                            
                            if can_place:
                                possible_positions.append({
                                    'row': row,
                                    'col': col,
                                    'new_cells': new_cells,
                                    'cell_count': len(new_cells)
                                })
                
                # 可能な位置がある場合
                if possible_positions:
                    # 優先度：1. 新しいセル数が最大のもの、2. ランダム
                    possible_positions.sort(key=lambda p: p['cell_count'], reverse=True)
                    max_new_cells = possible_positions[0]['cell_count']
                    best_positions = [p for p in possible_positions if p['cell_count'] == max_new_cells]
                    position = random.choice(best_positions)
                    
                    # 選択した位置に単語を配置
                    if direction == 'horizontal':
                        row, col = position['row'], position['col']
                        for i, char in enumerate(uppercase_term):
                            grid[row][col + i] = char
                            used_cells.add((row, col + i))
                        placed = True
                    elif direction == 'vertical':
                        row, col = position['row'], position['col']
                        for i, char in enumerate(uppercase_term):
                            grid[row + i][col] = char
                            used_cells.add((row + i, col))
                        placed = True
                    elif direction == 'diagonal':
                        row, col = position['row'], position['col']
                        for i, char in enumerate(uppercase_term):
                            grid[row + i][col + i] = char
                            used_cells.add((row + i, col + i))
                        placed = True
                    elif direction == 'reverse_diagonal':
                        row, col = position['row'], position['col']
                        for i, char in enumerate(uppercase_term):
                            grid[row + i][col - i] = char
                            used_cells.add((row + i, col - i))
                        placed = True
    
    # 空白を埋める部分
    for i in range(5):
        for j in range(5):
            if grid[i][j] == '':
                grid[i][j] = random.choice(string.ascii_uppercase)

    return grid


def calculate_points(full_name: str, combo_count: int, is_duplicate: bool = False) -> int:
    """
    仕様に基づいてポイントを計算する
    
    Args:
        full_name: 元の用語の完全名称（例："Cascading Style Sheets"）
        combo_count: 現在のコンボ数
        is_duplicate: 重複している単語かどうか
    
    Returns:
        計算されたポイント
    """
    # スペースを除いた文字数を数える
    char_count = len(full_name.replace(" ", ""))

    # 重複の場合は異なる計算式を使用
    if is_duplicate:
        # 重複の場合：(元の文字数) × (1 + コンボ数)
        return char_count * (1 + combo_count) 
    else:
        # 通常の計算式：(元の文字数) × (10 + コンボ数)
        return char_count * (10 + combo_count)


def create_new_grid(grid: List[List[str]], selection: List) -> List[List[str]]:
    """選択されたセルを空にした新しいグリッドを作成"""
    new_grid = [row[:] for row in grid]
    for cell in selection:
        new_grid[cell.row][cell.col] = ""
    return new_grid


def get_selected_word(grid: List[List[str]], selection: List) -> str:
    """選択されたセルからワードを生成"""
    # 大文字小文字を区別しないよう、常に大文字として返す
    return "".join([grid[cell.row][cell.col] for cell in selection]).upper()


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
