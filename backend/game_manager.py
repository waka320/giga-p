import uuid
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import random

from models import GameSession, ITTerm
from game_logic import generate_game_grid
from data.terms import get_terms

# メモリ内ゲームストア（実際はデータベースを使用推奨）
active_games: Dict[str, GameSession] = {}

def create_game_session(debug: bool = False) -> Tuple[str, List[List[str]], List[ITTerm]]:
    """
    新しいゲームセッションを作成して返す
    
    Args:
        debug: Trueの場合、デバッグ用の単純なグリッドを生成
    """
    session_id = str(uuid.uuid4())
    
    # 用語をランダムに5つ選択
    all_terms = get_terms()
    
    # デバッグモードの場合、デバッグ用の単語を追加
    if debug:
        debug_terms = [
            ITTerm(term="AAAAA", fullName="Debug Term A", description="デバッグ用単語A"),
            ITTerm(term="BBBBB", fullName="Debug Term B", description="デバッグ用単語B"),
            ITTerm(term="CCCCC", fullName="Debug Term C", description="デバッグ用単語C"),
            ITTerm(term="DDDDD", fullName="Debug Term D", description="デバッグ用単語D"),
            ITTerm(term="EEEEE", fullName="Debug Term E", description="デバッグ用単語E")
        ]
        selected_terms = debug_terms
    else:
        selected_terms = random.sample(all_terms, min(5, len(all_terms)))
    
    # グリッドを生成（デバッグフラグ渡し）
    grid = generate_game_grid(selected_terms, debug)
    
    # ゲームセッション作成
    game_session = GameSession(
        session_id=session_id,
        grid=grid,
        terms=selected_terms,
        start_time=datetime.now()
    )
    
    # セッション保存
    active_games[session_id] = game_session
    
    return session_id, grid, selected_terms

def get_game_session(session_id: str) -> Optional[GameSession]:
    """指定されたIDのゲームセッションを取得"""
    return active_games.get(session_id)

def update_game_session(session_id: str, updates: Dict) -> GameSession:
    """
    ゲームセッションを更新
    
    Args:
        session_id: セッションID
        updates: 更新内容のディクショナリ
    
    Returns:
        更新されたゲームセッション
    """
    game = active_games.get(session_id)
    if not game:
        return None
    
    # 各項目を更新
    for key, value in updates.items():
        setattr(game, key, value)
    
    # セッション保存
    active_games[session_id] = game
    
    return game  # 更新後のゲームセッションを返す

def is_game_expired(game: GameSession) -> bool:
    """ゲームの制限時間が経過したかチェック"""
    elapsed_seconds = (datetime.now() - game.start_time).total_seconds()
    return elapsed_seconds >= 60

def end_game_session(session_id: str) -> Optional[GameSession]:
    """ゲームセッションを終了状態に更新"""
    if session_id not in active_games:
        return None
    
    game = active_games[session_id]
    game.status = "completed"
    game.end_time = datetime.now()
    
    return game

def cleanup_expired_sessions():
    """期限切れのセッションをクリーンアップ"""
    to_remove = []
    for session_id, game in active_games.items():
        if is_game_expired(game) or game.status == "completed":
            # 24時間以上経過したゲームを削除
            if (datetime.now() - game.start_time).total_seconds() > 86400:
                to_remove.append(session_id)
    
    for session_id in to_remove:
        del active_games[session_id]