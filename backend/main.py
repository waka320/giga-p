from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from datetime import datetime
import os
from dotenv import load_dotenv

from models import (
    ITTerm, GameGrid, TermRequest,
    RefreshGridRequest, ValidateSelectionRequest
)
from data.terms import get_terms, find_term
from game_logic import (
    generate_game_grid, calculate_points,
    create_new_grid, get_selected_word, check_field_bonus
)
from game_manager import (
    create_game_session, get_game_session,
    update_game_session, is_game_expired,
    end_game_session, cleanup_expired_sessions,select_new_term_set
)

load_dotenv()  # .envファイルを読み込む

# 環境変数からデバッグモードを取得
# "true", "1", "yes"のいずれかの場合に有効
DEBUG_MODE = os.environ.get("DEBUG_MODE", "false").lower() in [
    "true", "1", "yes"]

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
    """
    新しいゲームセッションを開始

    Args:
        debug: クエリパラメータ。Trueの場合、デバッグモードで簡単な単語のみ使用

    Note:
        環境変数 DEBUG_MODE が設定されている場合はそちらが優先されます
    """
    # 環境変数のデバッグモードを優先
    use_debug = DEBUG_MODE
    session_id, grid, terms = create_game_session(use_debug)
    return {"session_id": session_id, "grid": grid, "terms": terms}


@app.get("/api/game/{session_id}/status")
def api_get_game_status(session_id: str):
    """現在のゲーム状態を取得"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 時間経過チェック
    elapsed_seconds = (datetime.now() - game.start_time).total_seconds()
    remaining_time = max(0, 120 - int(elapsed_seconds))

    if remaining_time == 0 and game.status == "active":
        # ゲーム終了処理
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

    return {
        "session_id": game.session_id,
        "score": game.score,
        "remaining_time": remaining_time,
        "status": game.status,
        "completed_terms": game.completed_terms,
        "combo_count": game.combo_count,
        "logs": logs  # ログ情報を追加
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
        # ポイント計算を新しい方式に変更
        points = calculate_points(term.fullName, game.combo_count)

        # グリッド更新
        updated_grid = create_new_grid(game.grid, request.selection)

        # ボーナスを計算 - check_field_bonus関数を使用
        bonus_points, bonus_message, should_reset = check_field_bonus(
            updated_grid)

        # 新しいグリッド生成（ボーナスでリセットが必要な場合）
        if should_reset:
            new_grid = generate_game_grid(game.terms)
            combo_count = 0  # コンボリセット
        else:
            new_grid = updated_grid
            combo_count = game.combo_count + 1

        # ログ用の詳細情報
        log_extras = {
            "word_points": points,  # 単語による獲得ポイント
            "bonus_points": bonus_points,  # ボーナスポイント
            "term": term.term,  # 完成した単語
            "combo_count": combo_count  # コンボ数
        }

        if bonus_points > 0:
            log_extras["bonus_message"] = bonus_message

        # ゲーム状態更新（ログ詳細情報も渡す）
        updated_game = update_game_session(session_id, {
            "grid": new_grid,
            "score": game.score + points + bonus_points,
            "completed_terms": game.completed_terms + [term],
            "combo_count": combo_count
        }, log_extras)

        response = {
            "valid": True,
            "term": term,
            "points": points,
            "bonus_points": bonus_points,
            "bonus_message": bonus_message,
            "new_score": updated_game.score,  # 更新後のスコアを使用
            "grid": new_grid,
            "combo_count": combo_count  # コンボ数をレスポンスに追加
        }

        return response

    # 無効な選択の場合（以下は変更なし）
    new_grid = generate_game_grid(game.terms, DEBUG_MODE)
    updated_game = update_game_session(session_id, {
        "grid": new_grid,
        "combo_count": 0
    })

    return {
        "valid": False,
        "grid": new_grid,
        "combo_count": 0  # コンボ数をリセットして返す
    }

# 手動リセット用エンドポイントの追加


@app.post("/api/game/{session_id}/reset")
def api_reset_grid(session_id: str,  refresh_terms: bool = True):
    """フィールドを手動でリセット"""
    game = get_game_session(session_id)
    if not game:
        raise HTTPException(404, "ゲームセッションが見つかりません")

    # 環境変数のデバッグモードを優先
    use_debug = DEBUG_MODE

    # 単語セットを更新するかどうか
    if refresh_terms:
        # 現在の単語を除外して新しい単語セットを選択
        terms = select_new_term_set(use_debug, exclude_terms=game.terms)
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
    _, grid, terms = create_game_session(DEBUG_MODE)
    return GameGrid(grid=grid, terms=terms)


@app.post("/api/refresh-grid", response_model=GameGrid)
def api_refresh_grid(request: RefreshGridRequest):
    """古いバージョン互換のためのエンドポイント"""
    grid = generate_game_grid(request.terms, DEBUG_MODE)
    return GameGrid(grid=grid, terms=request.terms)
