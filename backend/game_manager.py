import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
import random
from fastapi import FastAPI, HTTPException

from models import GameSession, ITTerm, GameLogEntry
from game_logic import generate_game_grid
from data.terms import get_terms

app = FastAPI()

# メモリ内ゲームストア
GAME_SESSIONS: Dict[str, GameSession] = {}


def create_game_session(debug_mode: bool = False, start_timer: bool = True) -> Tuple[str, List[List[str]], List[Dict]]:
    """ゲームセッションを作成 - 時間管理に特化"""
    # セッションIDの生成
    session_id = str(uuid.uuid4())

    # 単語の選択
    terms = select_term_set(debug_mode)

    # グリッドの生成（フロントエンドでも同様に生成されるが、
    # バックエンドでも初期グリッドを提供）
    grid = generate_game_grid(terms, debug_mode)

    # 現在時刻の取得
    now = datetime.now()

    # タイマーを開始する場合
    if start_timer:
        start_time = now
        end_time = now + timedelta(seconds=120)
    else:
        # タイマーを開始しない場合は、start_timeとend_timeをNoneに設定
        start_time = None
        end_time = None

    # 必要最小限の情報だけを持つセッションを作成
    new_session = GameSession(
        session_id=session_id,
        grid=grid,
        terms=terms,
        score=0,
        start_time=start_time,
        end_time=end_time,
        status="active"
    )

    # セッションをメモリに保存
    GAME_SESSIONS[session_id] = new_session

    return session_id, grid, terms


def get_game_session(session_id: str) -> Optional[GameSession]:
    """指定されたIDのゲームセッションを取得"""
    return GAME_SESSIONS.get(session_id)


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
    game = GAME_SESSIONS.get(session_id)
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

        # 重複単語の場合は特別なログアクション
        if log_extras and "is_duplicate" in log_extras and log_extras["is_duplicate"]:
            action = "単語重複"
            log_details["is_duplicate"] = True
            if "term" in log_extras:
                log_details["term"] = log_extras["term"]
                log_details["message"] = f"単語「{log_extras['term']}」が重複"
        # 通常の単語完成ケース
        elif "new_terms" in log_details:
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
    GAME_SESSIONS[session_id] = game

    return game  # 更新後のゲームセッションを返す


def get_remaining_time(session_id: str) -> int:
    """指定されたセッションの残り時間（秒）を取得"""
    game = GAME_SESSIONS.get(session_id)
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
    game = GAME_SESSIONS.get(session_id)
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
    for session_id, game in GAME_SESSIONS.items():
        if is_game_expired(game) or game.status == "completed":
            # 150秒以上経過したゲームを削除
            if (datetime.now() - game.start_time).total_seconds() > 150:
                to_remove.append(session_id)

    for session_id in to_remove:
        del GAME_SESSIONS[session_id]


def select_term_set(debug: bool = False, exclude_terms: List[ITTerm] = None) -> List[ITTerm]:
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
            ITTerm(term="AAAAA", fullName="Debug Term A",
                   description="デバッグ用単語A"),
            ITTerm(term="BBBBB", fullName="Debug Term B",
                   description="デバッグ用単語B"),
            ITTerm(term="CCCCC", fullName="Debug Term C",
                   description="デバッグ用単語C"),
            ITTerm(term="DDDDD", fullName="Debug Term D",
                   description="デバッグ用単語D"),
            ITTerm(term="EEEEE", fullName="Debug Term E",
                   description="デバッグ用単語E")
        ]
        return debug_terms

    # 通常モード
    all_terms = get_terms()

    # 除外する単語がある場合
    if exclude_terms:
        exclude_set = {term.term for term in exclude_terms}
        filtered_terms = [
            term for term in all_terms if term.term not in exclude_set]
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
            overlap = sum(char_frequency.get(char, 0)
                          for char in candidate.term)
            if overlap < lowest_overlap:
                lowest_overlap = overlap
                best_term = candidate

        if best_term:
            # 単語を入れ替え
            selected.remove(to_replace)
            selected.append(best_term)

    return selected
