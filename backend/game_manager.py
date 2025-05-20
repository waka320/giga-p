import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
import random

from models import GameSession, ITTerm, GameLogEntry
from game_logic import generate_game_grid
from data.terms import get_terms

# メモリ内ゲームストア
active_games: Dict[str, GameSession] = {}

def create_game_session(debug: bool = False) -> Tuple[str, List[List[str]], List[ITTerm]]:
    """新しいゲームセッションを作成して返す"""
    session_id = str(uuid.uuid4())
    
    # 新しい単語選択関数を使用
    selected_terms = select_new_term_set(debug)
    
    # グリッドを生成（デバッグフラグ渡し）
    grid = generate_game_grid(selected_terms, debug)
    
    # 現在時刻を記録（UTC）
    start_time = datetime.now()
    # ゲームの終了時刻を計算（120秒後）
    end_time = start_time + timedelta(seconds=120)
    
    # ゲームセッション作成
    game_session = GameSession(
        session_id=session_id,
        grid=grid,
        terms=selected_terms,
        start_time=start_time,
        end_time=end_time,  # 終了時刻を明示的に設定
        status="active"
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
                # 単語の識別子だけでなく、説明文も含める
                log_details["new_terms"] = [t.term for t in new_terms]
                
                # 単語の詳細情報も記録する
                term_details = []
                for t in new_terms:
                    term_details.append({
                        "term": t.term,
                        "fullName": t.fullName,
                        "description": t.description
                    })
                log_details["term_details"] = term_details
                
                # 最初の単語の詳細をログに追加（複数の場合は最初のものだけ）
                if new_terms and "term" in log_details:
                    log_details["term_fullName"] = new_terms[0].fullName
                    log_details["term_description"] = new_terms[0].description
        
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

def get_remaining_time(session_id: str) -> int:
    """指定されたセッションの残り時間（秒）を取得"""
    game = active_games.get(session_id)
    if not game:
        return 0
    
    # 現在時刻
    now = datetime.now()
    
    # 終了時刻との差を計算
    if game.end_time:
        remaining_seconds = (game.end_time - now).total_seconds()
        return max(0, int(remaining_seconds))
    
    # 終了時刻が設定されていない場合は開始時刻から計算
    elapsed_seconds = (now - game.start_time).total_seconds()
    remaining_seconds = 120 - elapsed_seconds
    return max(0, int(remaining_seconds))

def is_game_expired(game: GameSession) -> bool:
    """ゲームの制限時間が経過したかチェック"""
    # 現在時刻
    now = datetime.now()
    
    # 終了時刻が設定されている場合はそれを使用
    if game.end_time:
        return now >= game.end_time
    
    # 設定されていない場合は開始時刻から計算
    elapsed_seconds = (now - game.start_time).total_seconds()
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
            # 150秒以上経過したゲームを削除
            if (datetime.now() - game.start_time).total_seconds() > 150:
                to_remove.append(session_id)
    
    for session_id in to_remove:
        del active_games[session_id]

def select_new_term_set(debug: bool = False, exclude_terms: List[ITTerm] = None) -> List[ITTerm]:
    """
    新しい単語セットをランダムに選択する
    
    Args:
        debug: デバッグモードかどうか
        exclude_terms: 除外する単語リスト（前回のセットなど）
    
    Returns:
        選択された単語リスト
    """
    # デバッグモードの場合
    if debug:
        debug_terms = [
            ITTerm(term="AAAAA", fullName="Debug Term A", description="デバッグ用単語A"),
            ITTerm(term="BBBBB", fullName="Debug Term B", description="デバッグ用単語B"),
            ITTerm(term="CCCCC", fullName="Debug Term C", description="デバッグ用単語C"),
            ITTerm(term="DDDDD", fullName="Debug Term D", description="デバッグ用単語D"),
            ITTerm(term="EEEEE", fullName="Debug Term E", description="デバッグ用単語E")
        ]
        return debug_terms
    
    # 通常モード
    all_terms = get_terms()
    
    # 除外する単語がある場合
    if exclude_terms:
        exclude_set = {term.term for term in exclude_terms}
        filtered_terms = [term for term in all_terms if term.term not in exclude_set]
        # 除外後の単語が少なすぎる場合は全単語から選択
        if len(filtered_terms) < 5:
            filtered_terms = all_terms
    else:
        filtered_terms = all_terms
    
    # 単語の文字に基づいて重なりが少なくなるように選択
    selected_terms = select_terms_with_minimal_overlap(filtered_terms, 5)
    
    return selected_terms

def select_terms_with_minimal_overlap(terms: List[ITTerm], count: int) -> List[ITTerm]:
    """
    文字の重なりが少なくなるように単語を選択する
    
    Args:
        terms: 候補となる単語リスト
        count: 選択する単語数
    
    Returns:
        選択された単語リスト
    """
    if len(terms) <= count:
        return terms
    
    # まずランダムに選択して初期セットを作る
    selected = random.sample(terms, count)
    
    # 改善を試みる回数
    improvement_attempts = 20
    
    for _ in range(improvement_attempts):
        # 現在の選択の文字頻度を計算
        char_frequency = {}
        for term in selected:
            for char in term.term:
                char_frequency[char] = char_frequency.get(char, 0) + 1
        
        # 未選択の単語から候補を選ぶ
        unselected = [term for term in terms if term not in selected]
        if not unselected:
            break
        
        # ランダムに入れ替える単語を選択
        to_replace = random.choice(selected)
        
        # to_replaceの文字頻度影響を削除
        for char in to_replace.term:
            char_frequency[char] = char_frequency.get(char, 0) - 1
        
        # 最も重なりが少ない単語を探す
        best_term = None
        lowest_overlap = float('inf')
        
        for candidate in unselected:
            overlap = sum(char_frequency.get(char, 0) for char in candidate.term)
            if overlap < lowest_overlap:
                lowest_overlap = overlap
                best_term = candidate
        
        if best_term:
            # 単語を入れ替え
            selected.remove(to_replace)
            selected.append(best_term)
    
    return selected
