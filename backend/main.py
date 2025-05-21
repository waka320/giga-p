from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from models import (
    ITTerm, GameGrid, TermRequest,
    RefreshGridRequest, ValidateSelectionRequest, ScoreSubmission
)
from data.terms import get_terms, find_term
from game_logic import (
    generate_game_grid, calculate_points,
    create_new_grid, get_selected_word, check_field_bonus
)
from game_manager import (
    create_game_session, get_game_session,
    update_game_session, is_game_expired,
    end_game_session, cleanup_expired_sessions, select_term_set, get_remaining_time
)
from database.db_manager import DBManager
from database.score_repository import ScoreRepository

load_dotenv()  # .envファイルを読み込む

# 環境変数からデバッグモードを取得
# "true", "1", "yes"のいずれかの場合に有効
DEBUG_MODE = os.environ.get("DEBUG_MODE", "false").lower() in [
    "true", "1", "yes"]

app = FastAPI(title="IT用語パズルゲームAPI")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://zealous-water-072b45600.6.azurestaticapps.net",
                   "https://acro-attack.wakaport.com" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB初期化時にテーブル作成を追加
db_manager = DBManager()
db_manager.create_leaderboard_table()
score_repository = ScoreRepository(db_manager)

# バックグラウンドタスク


@app.on_event("startup")
async def startup_event():
    # 定期的に古いセッションをクリーンアップ
    cleanup_expired_sessions()

# API エンドポイント


@app.get("/api/terms", response_model=List[ITTerm])
def api_get_terms(search: Optional[str] = None, sort_by: str = "term", sort_order: str = "asc"):
    """IT用語を取得（検索・ソート機能付き）"""
    terms = get_terms()
    
    # 検索フィルタリング
    if search:
        search = search.lower()
        terms = [term for term in terms if 
                 search in term.term.lower() or 
                 search in term.fullName.lower() or 
                 search in term.description.lower()]
    
    # ソート
    if sort_by == "term":
        terms.sort(key=lambda x: x.term.lower(), reverse=(sort_order == "desc"))
    elif sort_by == "fullName":
        terms.sort(key=lambda x: x.fullName.lower(), reverse=(sort_order == "desc"))
    elif sort_by == "difficulty":
        terms.sort(key=lambda x: x.difficulty, reverse=(sort_order == "desc"))
    
    return terms


@app.post("/api/validate")
def api_validate_term(request: TermRequest):
    """単語が有効なIT用語かどうか検証"""
    term = find_term(request.term)
    if term:
        return {"valid": True, "term": term}
    return {"valid": False}


@app.post("/api/game/start")
def api_start_game(start_timer: bool = False):
    """
    新しいゲームセッションを開始

    Args:
        debug: クエリパラメータ。Trueの場合、デバッグモードで簡単な単語のみ使用
        start_timer: Falseの場合、タイマーを開始せずにセッションのみを作成
    """
    # 環境変数のデバッグモードを優先
    use_debug = DEBUG_MODE
    session_id, grid, terms = create_game_session(
        use_debug, start_timer=start_timer)
    return {"session_id": session_id, "grid": grid, "terms": terms}


@app.post("/api/game/{session_id}/start_timer")
def api_start_timer(session_id: str):
    """指定されたゲームセッションのタイマーを開始"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 現在時刻を取得
    now = datetime.now()

    # タイマーを開始（開始時刻を現在時刻に設定）
    game.start_time = now
    # 終了時刻を設定（120秒後）
    game.end_time = now + timedelta(seconds=120)

    # ゲームセッションを更新
    update_game_session(session_id, {
        "start_time": now,
        "end_time": now + timedelta(seconds=120),
        "status": "active"
    })

    return {
        "session_id": session_id,
        "start_time": game.start_time.isoformat(),
        "end_time": game.end_time.isoformat(),
        "remaining_time": 120
    }


@app.get("/api/game/{session_id}/status")
def api_get_game_status(session_id: str):
    """現在のゲーム状態を取得"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 残り時間を取得（新しい関数を使用）
    remaining_time = get_remaining_time(session_id)

    # 時間切れの場合はゲーム終了処理
    if remaining_time == 0 and game.status == "active":
        game = end_game_session(session_id)

    # ログ情報の整形
    logs = []
    if hasattr(game, "logs"):
        for log_entry in game.logs:
            logs.append({
                "action": log_entry.action,
                "details": log_entry.details,
                "timestamp": log_entry.timestamp.isoformat()
            })

    # サーバー時刻と残り時間を含めて返す
    return {
        "session_id": game.session_id,
        "score": game.score,
        "grid": game.grid,
        "remaining_time": remaining_time,
        "server_time": datetime.now().isoformat(),
        "end_time": game.end_time.isoformat() if game.end_time else None,
        "status": game.status,
        "completed_terms": game.completed_terms,
        "combo_count": game.combo_count,
        "logs": logs
    }


@app.post("/api/game/{session_id}/validate")
def api_validate_selection(session_id: str, request: ValidateSelectionRequest):
    """プレイヤーの選択を検証"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # セッションが有効か確認
    if game.status != "active" or is_game_expired(game):
        return {"valid": False, "reason": "ゲームセッションが終了しています"}

    # 選択からワードを生成
    selected_word = get_selected_word(game.grid, request.selection)

    # 単語検証
    term = find_term(selected_word)
    if term:
        # 重複チェック - 既に完了した単語かどうか
        is_duplicate = any(ct.term == term.term for ct in game.completed_terms)

        # ポイント計算 - 重複フラグを渡す
        points = calculate_points(
            term.fullName, game.combo_count, is_duplicate)

        # グリッド更新
        updated_grid = create_new_grid(game.grid, request.selection)

        # ボーナスを計算
        bonus_points, bonus_message, should_reset = check_field_bonus(
            updated_grid)

        # 新しいグリッド生成（ボーナスでリセットが必要な場合）
        if should_reset:
            new_grid = generate_game_grid(game.terms, DEBUG_MODE)
            combo_count = 0  # コンボリセット
        else:
            new_grid = updated_grid
            combo_count = game.combo_count + 1

        # ログ用の詳細情報
        log_extras = {
            "word_points": points,  # 単語による獲得ポイント
            "bonus_points": bonus_points,  # ボーナスポイント
            "term": term.term,  # 完成した単語
            "combo_count": combo_count,  # コンボ数
            "is_duplicate": is_duplicate  # 重複フラグ（新規追加）
        }

        if bonus_points > 0:
            log_extras["bonus_message"] = bonus_message

        # ゲーム状態更新 - 重複単語の場合の処理
        updates = {
            "grid": new_grid,
            "score": game.score + points + bonus_points,
            "combo_count": combo_count
        }

        # 重複でない場合のみcompletedTermsを更新
        if not is_duplicate:
            updates["completed_terms"] = game.completed_terms + [term]

        updated_game = update_game_session(session_id, updates, log_extras)

        response = {
            "valid": True,
            "term": term,
            "points": points,
            "bonus_points": bonus_points,
            "bonus_message": bonus_message,
            "new_score": updated_game.score,
            "grid": new_grid,
            "combo_count": combo_count,
            "is_duplicate": is_duplicate  # フロントエンド用の重複フラグ
        }

        return response

    # 無効な選択の場合（既存コード）
    new_grid = generate_game_grid(game.terms, DEBUG_MODE)
    updated_game = update_game_session(session_id, {
        "grid": new_grid,
        "combo_count": 0
    })

    return {
        "valid": False,
        "grid": new_grid,
        "combo_count": 0
    }

# 手動リセット用エンドポイントの追加


@app.post("/api/game/{session_id}/reset")
def api_reset_grid(session_id: str, refresh_terms: bool = True):
    """フィールドを手動でリセット"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 環境変数のデバッグモードを優先
    use_debug = DEBUG_MODE

    # 単語セットを更新するかどうか
    if refresh_terms:
        # select_new_term_set -> select_term_set に修正
        terms = select_term_set(use_debug, exclude_terms=game.terms)
        # ゲームの単語リストを更新
        game.terms = terms
    else:
        terms = game.terms

    # 新しいグリッド生成
    new_grid = generate_game_grid(terms, use_debug)

    # コンボリセット（ログ情報も追加）
    updated_game = update_game_session(session_id, {
        "grid": new_grid,
        "terms": terms,  # 新しい単語セットも更新
        "combo_count": 0
    }, {"action_type": "manual_reset", "refreshed_terms": refresh_terms})

    return {
        "grid": new_grid,
        "terms": terms,
        "combo_count": 0
    }


# 既に終了しているセッションの重複呼び出しを防止
@app.post("/api/game/{session_id}/end")
def api_end_game(session_id: str):
    """ゲームを終了"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 既に終了している場合は現在のスコアを返す
    if game.status == "completed":
        return {"session_id": session_id, "final_score": game.score}

    # 終了処理を実行
    game = end_game_session(session_id)
    return {"session_id": session_id, "final_score": game.score}

# 互換性のための古いエンドポイント
# 新しいアプリケーションでは /api/game/start を使用すべき


@app.get("/api/game", response_model=GameGrid)
def api_generate_game():
    """古いバージョン互換のためのエンドポイント"""
    _, grid, terms = create_game_session(DEBUG_MODE)
    return GameGrid(grid=grid, terms=terms)


@app.post("/api/refresh-grid", response_model=GameGrid)
def api_refresh_grid(request: RefreshGridRequest):
    """古いバージョン互換のためのエンドポイント"""
    grid = generate_game_grid(request.terms, DEBUG_MODE)
    return GameGrid(grid=grid, terms=request.terms)


@app.post("/api/scores")
def api_save_score(request: ScoreSubmission):
    """スコアを保存"""
    # 1000点未満は登録できない
    if request.score < 1000:
        raise HTTPException(status_code=400, detail="スコアが1000点未満のため登録できません")
    
    # スコアを保存
    score_id = score_repository.save_score(
        request.player_name,
        request.score,
        len(request.completed_terms)
    )
    
    if not score_id:
        raise HTTPException(status_code=500, detail="スコアの保存に失敗しました")
    
    return {"id": score_id, "success": True}


@app.get("/api/scores/leaderboard")
def api_get_leaderboard(limit: int = 10):
    """リーダーボードを取得"""
    scores = score_repository.get_top_scores(limit)
    return scores
