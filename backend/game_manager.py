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

def update_game_session(session_id: str, updates: Dict, log_extras: Dict = None) -> GameSession:
    """
    ゲームセッションを更新
    
    Args:
        session_id: セッションID
        updates: 更新内容のディクショナリ
        log_extras: 追加のログ情報（オプション）
    
    Returns:
        更新されたゲームセッション
    """
    game = active_games.get(session_id)
    if not game:
        return None
    
    # ログに記録する内容を収集
    log_details = {}
    
    # 追加のログ情報がある場合はマージ
    if log_extras:
        log_details.update(log_extras)
    
    # 各項目を更新とログ収集
    for key, value in updates.items():
        if key == "score" and hasattr(game, "score"):
            score_diff = value - game.score
            if score_diff > 0 and "score_change" not in log_details:
                log_details["score_change"] = score_diff
                
        if key == "completed_terms" and hasattr(game, "completed_terms"):
            # 完了した単語が追加された場合
            if len(value) > len(game.completed_terms):
                new_terms = value[len(game.completed_terms):]
                log_details["new_terms"] = [t.term for t in new_terms]
        
        # 実際の値を更新
        setattr(game, key, value)
    
    # 何か重要な変更があった場合はログに記録
    if log_details:
        action = "状態更新"
        
        # アクションの種類を決定
        if "new_terms" in log_details:
            if "bonus_points" in log_details and log_details["bonus_points"] > 0:
                action = "単語完成・ボーナス獲得"
            else:
                action = "単語完成"
        elif "bonus_points" in log_details and log_details["bonus_points"] > 0:
            action = "ボーナス獲得"
        elif "score_change" in log_details and log_details["score_change"] > 100:
            action = "高得点獲得"
            
        if hasattr(game, "add_log"):
            game.add_log(action, log_details)
    
    # セッション保存
    active_games[session_id] = game
    
    return game  # 更新後のゲームセッションを返す

def is_game_expired(game: GameSession) -> bool:
    """ゲームの制限時間が経過したかチェック"""
    elapsed_seconds = (datetime.now() - game.start_time).total_seconds()
    return elapsed_seconds >= 120

def end_game_session(session_id: str) -> Optional[GameSession]:
    """ゲームセッションを終了状態に更新"""
    game = active_games.get(session_id)
    if not game:
        return None
    
    game.status = "completed"
    
    # ゲーム終了ログを追加
    if hasattr(game, "add_log"):
        game.add_log("ゲーム終了", {"final_score": game.score})
    
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
