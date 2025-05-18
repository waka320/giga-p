from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import datetime

from models import (
    ITTerm, GameGrid, TermRequest,
    RefreshGridRequest, ValidateSelectionRequest
)
from data.terms import get_terms, find_term
from game_logic import (
    generate_game_grid, calculate_points,
    create_new_grid, get_selected_word
)
from game_manager import (
    create_game_session, get_game_session,
    update_game_session, is_game_expired,
    end_game_session, cleanup_expired_sessions
)

app = FastAPI(title="IT用語パズルゲームAPI")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# バックグラウンドタスク


@app.on_event("startup")
async def startup_event():
    # 定期的に古いセッションをクリーンアップ
    cleanup_expired_sessions()

# API エンドポイント


@app.get("/api/terms", response_model=List[ITTerm])
def api_get_terms():
    """すべてのIT用語を取得"""
    return get_terms()


@app.post("/api/validate")
def api_validate_term(request: TermRequest):
    """単語が有効なIT用語かどうか検証"""
    term = find_term(request.term)
    if term:
        return {"valid": True, "term": term}
    return {"valid": False}


@app.post("/api/game/start")
def api_start_game():
    """新しいゲームセッションを開始"""
    session_id, grid, terms = create_game_session()
    return {"session_id": session_id, "grid": grid, "terms": terms}


@app.get("/api/game/{session_id}/status")
def api_get_game_status(session_id: str):
    """現在のゲーム状態を取得"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 時間経過チェック
    elapsed_seconds = (datetime.now() - game.start_time).total_seconds()
    remaining_time = max(0, 60 - int(elapsed_seconds))

    if remaining_time == 0 and game.status == "active":
        # ゲーム終了処理
        game = end_game_session(session_id)

    return {
        "session_id": game.session_id,
        "score": game.score,
        "remaining_time": remaining_time,
        "status": game.status,
        "completed_terms": game.completed_terms,
        "combo_count": game.combo_count
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
        # 単語が有効な場合、スコア計算
        points = calculate_points(len(selected_word), game.combo_count)

        # グリッド更新
        updated_grid = create_new_grid(game.grid, request.selection)

        # ゲーム状態更新
        update_game_session(session_id, {
            "grid": updated_grid,
            "score": game.score + points,
            "completed_terms": game.completed_terms + [term],
            "combo_count": game.combo_count + 1
        })

        return {
            "valid": True,
            "term": term,
            "points": points,
            "new_score": game.score + points,
            "grid": updated_grid
        }

    # 無効な選択の場合、グリッドをリフレッシュ
    new_grid = generate_game_grid(game.terms)
    update_game_session(session_id, {
        "grid": new_grid,
        "combo_count": 0
    })

    return {
        "valid": False,
        "grid": new_grid
    }


@app.post("/api/game/{session_id}/end")
def api_end_game(session_id: str):
    """ゲームを終了"""
    game = end_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    return {"session_id": session_id, "final_score": game.score}

# 互換性のための古いエンドポイント
# 新しいアプリケーションでは /api/game/start を使用すべき


@app.get("/api/game", response_model=GameGrid)
def api_generate_game():
    """古いバージョン互換のためのエンドポイント"""
    _, grid, terms = create_game_session()
    return GameGrid(grid=grid, terms=terms)


@app.post("/api/refresh-grid", response_model=GameGrid)
def api_refresh_grid(request: RefreshGridRequest):
    """古いバージョン互換のためのエンドポイント"""
    grid = generate_game_grid(request.terms)
    return GameGrid(grid=grid, terms=request.terms)
