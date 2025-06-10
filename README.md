# アクロアタック. - 仕様書

このドキュメントはIT用語アクロニムパズルゲームの基本仕様を記載しています。

## 1. ゲームの基本情報

### 1.1 ゲーム概要

アクロアタック.（ACRO_ATTACK.）は、IT分野で使用されるアクロニム（略語）を題材にしたワードパズルゲームです。プレイヤーは制限時間内に、画面上に配置されたアルファベットを組み合わせ、HTTPやCSSといったIT用語のアクロニムを見つけ出し、高得点を目指します。

このゲームは以下の特徴を持ちます：

- **教育的要素**: IT業界で使われる専門用語に親しみながら楽しめます
- **パズル性**: 限られたアルファベットから最適な組み合わせを見つける思考力が試されます
- **スコアアタック**: 制限時間内で高得点を狙う爽快感があります
- **コンボシステム**: 連続して単語を作ることでスコアが上昇する戦略性があります

ゲームの目的は、制限時間内にできるだけ多くのIT用語を見つけ、高得点を獲得することです。

### 1.2 対象プレイヤー

- IT分野に興味がある方
- ワードパズルゲーム愛好者
- 記憶力や語彙力を鍛えたい方
- 暇つぶしに気軽に遊びたい方

## 2. ゲームシステム

### 2.1 基本ルール

- ゲーム開始時、アルファベットが5×5のグリッドに配置されたフィールドが表示されます
- プレイヤーはフィールド上のアルファベットを選択してスタックできます
- スタックしたアルファベットがIT用語のアクロニムを形成すると得点獲得できます
- ゲームは2分(120秒)の制限時間が終了すると終了します

### 2.2 得点システム

- 単語が成立すると、元の文字数に基づいて得点が計算されます
  - 例: CSSは「cascade style sheets」で19文字分の基本点
- コンボシステムにより連続して単語を作ると得点が増加します
  - 計算式: (元の文字数) × (10 + コンボ数)
  - 例: CSSが3コンボ目の場合、19 × (10 + 3) = 247点

### 2.3 フィールド管理

- 単語形成後も残りのアルファベットでプレイを継続できます
- フィールドのアルファベットを全て消すと「全消しボーナス」獲得
  - 全消しボーナス: +500pt
- 少数のアルファベットを残した場合も残数に応じたボーナス獲得
  - 残りマス数に応じてボーナス: (5 - 残りマス数) × 50pt

### 2.4 リセット条件

- フィールドの全消し
- 無効な単語の検知
- 手動リセット操作

いずれの場合もコンボ数はリセットされ、フィールドが再生成されます

## 3. ゲームフロー

### 3.1 ゲーム開始（更新）

1. プレイヤーがゲーム開始画面でスタートボタンを押す
2. ゲームデータのプリロード処理が開始される
3. コマンドプロンプト風のカウントダウン演出が開始
4. カウントダウン中にバックグラウンドでゲームデータをプリロード
5. カウントダウン完了後にタイマーが開始され、ゲームプレイに移行

### 3.2 ゲームプレイ

1. プレイヤーはグリッド上のアルファベットを選択する
2. 選択したアルファベットは一時スタックに保存される
3. 完成したと思われる単語を確定する
4. システムが単語の有効性を検証し、成立すれば得点が加算される
5. ゲームは継続し、プレイヤーは新たな単語を探す

### 3.3 ゲーム終了

- 制限時間が経過するとゲーム終了
- プレイヤーはフィールドを操作できなくなる
- 結果画面に遷移し、最終スコアが表示される
- リプレイオプションが表示され、再度プレイ可能

## 4. 技術仕様

### 4.1 開発環境

**フロントエンド**:

- Next.js (App Router使用)
- TypeScript
- Framer Motion（アニメーション）
- TailwindCSS (スタイリング)

**バックエンド**:

- FastAPI (Python)
- RESTful API設計

**状態管理**:

- React Context APIを使用したカスタムフック

**データベース**:

- Azure SQL Database
- pyodbc (Python ODBC接続用)
- 接続プーリングによる効率的なデータベース接続

### 4.2 API エンドポイント（更新）

#### ゲームセッション管理

```
/api/game/start              POST    新しいゲームセッションを開始（start_timerオプション追加）
/api/game/{session_id}/start_timer POST  タイマーを明示的に開始（新規追加）
/api/game/{session_id}/status GET     現在のゲーム状態を取得
/api/game/{session_id}/validate POST  プレイヤーの選択を検証
/api/game/{session_id}/reset  POST    フィールドを手動でリセット
/api/game/{session_id}/end   POST    ゲームを終了
```

#### 用語および検証

```
/api/terms                   GET     すべてのIT用語を取得
/api/validate                POST    単語が有効なIT用語かどうか検証
```

#### 互換性用エンドポイント

```
/api/game                    GET     ゲーム用のグリッドとIT用語を取得（旧API互換）
/api/refresh-grid            POST    現在のIT用語でグリッドを更新（旧API互換）
```

## 5. 実装構造

### 5.1 ディレクトリ構造

#### バックエンド

```
backend/
├── database/
│   ├── db_manager.py        # データベース接続管理
│   └── term_repository.py   # IT用語データアクセスレイヤー
├── data/
│   └── terms.py            # IT用語データと検索関数
├── game_logic.py           # ゲームロジック（グリッド生成、スコア計算等）
├── game_manager.py         # ゲームセッション管理
├── main.py                 # FastAPIアプリケーションとエンドポイント定義
├── models.py               # Pydanticモデル定義
└── venv/                   # Python仮想環境
```

#### フロントエンド

```
frontend/
├── public/          # 静的ファイル
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/         # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── game/    # ゲーム関連ページ
│   │   │   ├── layout.tsx      # ゲーム共通レイアウト
│   │   │   ├── play/           # ゲームプレイ画面
│   │   │   │   └── page.tsx
│   │   │   ├── results/        # ゲーム結果画面
│   │   │   │   └── page.tsx
│   │   │   └── start/          # ゲーム開始画面
│   │   │       └── page.tsx
│   │   ├── globals.css         # グローバルスタイル
│   │   ├── layout.tsx          # アプリ全体のレイアウト
│   │   ├── page.module.css     # ホームページスタイル
│   │   └── page.tsx            # ホームページ
│   ├── components/             # コンポーネント
│   │   ├── game/               # ゲーム専用コンポーネント
│   │   │   ├── CompletedTerms.tsx # 発見された用語リスト
│   │   │   ├── Controls.tsx    # ゲームコントロール
│   │   │   ├── GameEngine.tsx  # ゲームのメインロジック
│   │   │   ├── GameGrid.tsx    # 5x5グリッド表示
│   │   │   └── GameInfo.tsx    # ゲーム情報（スコア、時間）
│   │   └── TransitionEffect.tsx  # 画面遷移エフェクト
│   ├── hooks/                  # カスタムフック
│   │   ├── useGameControls.ts  # ゲーム操作
│   │   └── useGameState.tsx    # ゲーム状態管理
│   ├── lib/                    # ユーティリティ
│   │   └── gameLogic.ts        # ゲームロジック関数
│   └── types.ts                # 型定義
├── eslint.config.mjs           # ESLint設定
├── next.config.ts              # Next.js設定
├── package-lock.json
├── package.json
├── postcss.config.mjs          # PostCSS設定
└── tsconfig.json               # TypeScript設定
```

## 6. 状態管理とロジックの詳細（更新）

### 6.1 状態管理アーキテクチャ（更新）

#### GameState型（更新）

```typescript
export interface GameState {
  sessionId?: string;       // ゲームセッションID
  grid: string[][];         // 5x5のアルファベットグリッド
  terms: ITTerm[];          // 利用可能なIT用語リスト
  score: number;            // 現在のスコア
  selectedCells: { row: number; col: number }[]; // 選択されたセル
  time: number;             // 残り時間（秒）
  gameOver: boolean;        // ゲーム終了フラグ
  completedTerms: ITTerm[]; // 発見された用語リスト
  comboCount: number;       // 現在のコンボ数
  gamePhase: 'init' | 'countdown' | 'playing' | 'gameover'; // ゲームフェーズ（新規追加）
  preloadedData: PreloadedGameData | null; // プリロードデータ（新規追加）
  endTime: number | null;   // ゲーム終了時刻（新規追加）
  serverTimeOffset: number; // サーバー時間オフセット（新規追加）
  bonusMessage?: string;    // ボーナスメッセージ
  showBonus?: boolean;      // ボーナス表示フラグ
  logs?: GameLog[];         // ゲームログ
}
```

#### カスタムフック

1. **useGameState**: ゲーム全体の状態を管理するフック
   - グローバルなゲーム状態の提供
   - ゲーム開始処理
   - タイマー管理
   - ゲーム終了時の処理（スコア保存、結果画面遷移）

2. **useGameControls**: プレイヤーの操作に関連する機能を提供するフック
   - セル選択
   - 単語検証
   - フィールドリセット
   - ボーナス計算と適用

### 6.2 ゲームロジックの実装

#### バックエンド (Python)

1. **グリッド生成**

   ```python
   def generate_game_grid(terms: List[ITTerm]) -> List[List[str]]:
       # 5x5のグリッドを生成
       grid = [['' for _ in range(5)] for _ in range(5)]
       
       # 用語をグリッドにランダムに配置
       # ...
       
       # 空白を埋める
       # ...
       
       return grid
   ```

2. **ポイント計算**

   ```python
   def calculate_points(full_name: str, combo_count: int) -> int:
       # スペースを除いた文字数を数える
       char_count = len(full_name.replace(" ", ""))
       
       # 新しい計算式：(元の文字数) × (10 + コンボ数)
       return char_count * (10 + combo_count)
   ```

3. **ボーナス計算**

   ```python
   def check_field_bonus(grid: List[List[str]]) -> Tuple[int, str, bool]:
       # 残りのセル数をカウント
       remaining_cells = sum(sum(1 for cell in row if cell != "") for row in grid)
       
       # 全消しの場合
       if remaining_cells == 0:
           return 500, "全消しボーナス！ +500点", True
       
       # 残りが少ない場合
       elif remaining_cells <= 5:
           bonus = (5 - remaining_cells) * 50
           return bonus, f"残り{remaining_cells}マスボーナス！ +{bonus}点", False
       
       return 0, "", False
   ```

#### フロントエンド (TypeScript)

1. **選択処理**

   ```typescript
   const selectCell = (row: number, col: number) => {
     // すでに選択されているか確認
     const alreadySelected = state.selectedCells.some(
       cell => cell.row === row && cell.col === col
     );
     
     if (alreadySelected) {
       // 選択解除
       // ...
     } else {
       // 選択追加
       // ...
     }
   };
   ```

2. **単語検証と得点計算**

   ```typescript
   const validateSelection = async () => {
     // APIでの検証
     const response = await axios.post(`/api/game/${state.sessionId}/validate`, {
       selection: state.selectedCells
     });
     
     if (response.data.valid) {
       // 得点加算と状態更新
       // ボーナス処理
       // ...
     } else {
       // 不正解の場合
       // ...
     }
   };
   ```

3. **ボーナス表示**

   ```typescript
   // ボーナスメッセージを表示後に非表示にするタイマー
   if (bonusMessage) {
     setTimeout(() => {
       setState(prev => ({
         ...prev,
         showBonus: false
       }));
     }, 3000);
   }
   ```

### 6.3 ゲームフロー制御の実装

1. **ゲーム開始フロー**

   ```typescript
   const startGame = async () => {
     // 新しいゲームセッション開始
     const response = await axios.post('/api/game/start');
     setState({
       ...initialState,
       sessionId: response.data.session_id,
       grid: response.data.grid,
       terms: response.data.terms,
     });
     
     // タイマー開始
     // ...
   };
   ```

2. **ゲーム終了処理**

   ```typescript
   if (prev.time <= 1) {
     // タイマー停止
     clearInterval(timerRef.current);
     
     // ゲーム終了処理
     axios.post(`/api/game/${prev.sessionId}/end`)
       .then(() => {
         // 結果保存
         localStorage.setItem('gameResults', JSON.stringify({
           score: prev.score,
           completedTerms: prev.completedTerms
         }));
         
         // 結果画面へ遷移
         setTimeout(() => {
           router.push('/game/results');
         }, 1000);
       });
     
     return { ...prev, time: 0, gameOver: true };
   }
   ```

## 7. フロントエンドとバックエンドの責任分担

アクロアタック.は明確な責任分担を持つクライアント-サーバーアーキテクチャを採用しています。これにより、保守性が高く拡張しやすい構造になっています。

### 7.1 バックエンドの責任

バックエンドはゲームロジックの中核とデータ管理を担当します：

1. **ゲームセッション管理**
   - セッションの作成、取得、更新、終了
   - セッション有効期限の管理

2. **ゲームロジックの実装**
   - グリッド生成アルゴリズム
   - 単語検証ロジック
   - スコア計算（基本点とコンボボーナス）
   - ボーナス条件判定とボーナスポイント計算

3. **データの一元管理**
   - ゲームの現在の状態（スコア、コンボ数など）
   - 完了した単語のトラッキング
   - IT用語データベースの管理

4. **デバッグモードの制御**
   - 環境変数によるデバッグ設定
   - デバッグ用グリッドと単語の生成

### 7.2 フロントエンドの責任

フロントエンドはユーザー体験とインタラクション管理を担当します：

1. **ユーザーインターフェース**
   - グリッドとゲーム情報の表示
   - アニメーションと視覚効果
   - レスポンシブデザイン
   - **統一されたUIコンポーネントシステム**
   - **アクセシビリティ対応**
   - **ダークモードテーマ**

2. **ユーザー操作の処理**
   - セル選択のハンドリング
   - バリデーションUIの管理
   - リセットボタンなどのコントロール
   - **タッチデバイスの最適化**

3. **状態の表示**
   - バックエンドから受け取ったスコアの表示
   - タイマーの表示と管理
   - コンボカウントの表示
   - ボーナスメッセージの表示
   - **ゲームログの表示と管理**

4. **ルーティングと画面遷移**
   - ゲーム開始、プレイ、結果画面間の遷移
   - ローカルストレージへの結果保存
   - **スムーズな画面遷移アニメーション**

5. **API通信**
   - バックエンドエンドポイントとの通信
   - エラーハンドリングとリトライロジック

## 8. セットアップ手順

### 8.1 バックエンド (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

### 8.2 フロントエンド (Next.js)

```bash
cd frontend
npm install
npm run dev
```

アプリケーションは <http://localhost:3000> で実行されます。

## 9. データベース設定

アクロアタック.はIT用語をAzure SQLデータベースで管理することができます。以下に設定方法とベストプラクティスを示します。

### 9.1 Azure SQLデータベースのセットアップ

1. **Azureポータルでリソースの作成**:

```bash
# Azureにログイン
az login

# リソースグループの作成
az group create --name acro-attack-rg --location japaneast

# SQLサーバーの作成
az sql server create \
  --name acro-attack-server \
  --resource-group acro-attack-rg \
  --location japaneast \
  --admin-user sqladmin \
  --admin-password "SecurePassword123!"

# ファイアウォール規則を設定（開発環境からのアクセス許可）
az sql server firewall-rule create \
  --resource-group acro-attack-rg \
  --server acro-attack-server \
  --name AllowMyIP \
  --start-ip-address <あなたのIPアドレス> \
  --end-ip-address <あなたのIPアドレス>

# データベースの作成
az sql db create \
  --resource-group acro-attack-rg \
  --server acro-attack-server \
  --name acro_attack_db \
  --service-objective Basic
```

## 10. 将来の展望

アクロアタック.は今後以下の機能追加を予定しています：

1. **マルチプレイヤーモード**:
   - リアルタイムで他のプレイヤーと競争するモード
   - スコアランキングの表示

2. **新しい用語カテゴリ**:
   - IT以外の分野（医療、科学、エンターテインメントなど）の用語を追加

3. **カスタムグリッドサイズ**:
   - プレイヤーがグリッドサイズを選択可能に

4. **AI対戦モード**:
   - AIプレイヤーとの対戦機能

5. **モバイルアプリ版**:
   - iOSおよびAndroid向けのネイティブアプリ開発

## 11. UI設計とデザインシステム

アクロアタック.は一貫したユーザー体験を提供するために、整理されたUI設計とデザインシステムを採用しています。

### 11.1 デザインテーマ

- **ITテーマ**：ターミナル、コード、テクノロジーを想起させるデザイン要素
- **ピクセルアート**：レトロなゲーム感を演出する特殊フォントとエフェクト
- **ダークモード優先**：目の疲れを軽減し、IT感を高めるダークテーマベース
- **ネオンカラー**：サイバー感のあるアクセントカラー

### 11.2 カラーシステム

// 主要カラーテーマ
ターミナル系: #0CFA00（緑）, #001500（ダーク）
スクリーン系: #0066ff（青）, #001133（ダーク）
マトリックス系: #00FF41（ライト）, #0D0208（ダーク）
サイバー系: #FF00FF（紫）, #00FFFF（青）, #FFFF00（黄）

これらのカラーは特に以下の要素に適用されています：

- グリッドセル（選択状態、未選択状態）
- ボーナスメッセージ
- ログ表示
- アクションボタン

### 11.3 タイポグラフィ

ゲームでは3種類の主要フォントを使用しています：

1. **DotGothic16**：メインテキスト用の日本語対応ドットフォント
2. **Geist Mono**：コード風表示やログ表示用のモノスペースフォント
3. **Press Start 2P**：スコアや特殊表示用のピクセルフォント

### 11.4 UIコンポーネント

主要なUIコンポーネントは再利用可能な形で実装されています：

1. **ゲームグリッド**：インタラクティブな5x5のセルグリッド
2. **ログ表示**：ターミナル風のスクロール可能なログ表示
3. **スコア表示**：ピクセルフォントを用いた目立つスコア表示
4. **タイマー**：残り時間表示（警告時に視覚効果あり）
5. **ボーナスメッセージ**：アニメーション付きの特殊メッセージ
6. **コントロールボタン**：統一されたスタイルのアクションボタン群

### 11.5 レスポンシブデザイン

- モバイルファースト設計
- デバイスサイズに応じた最適なレイアウト調整
- タッチデバイス向けの大きなタッチターゲット（最小44px）
- モバイル向け簡易表示とデスクトップ向け詳細表示の切り替え

### 11.6 アニメーションとエフェクト

- Framer Motionを活用した滑らかなアニメーション
- セル選択時のフィードバックアニメーション
- スコア加算時の数値アップアニメーション
- ボーナス獲得時の特殊エフェクト
- 時間切れ警告のパルスアニメーション
- 画面遷移エフェクト

### 11.7 アクセシビリティ

- 適切なコントラスト比
- キーボードナビゲーション対応
- フォーカス可視化の改善
- スクリーンリーダー対応のaria属性
- タッチデバイス向け最適化

このデザインシステムにより、一貫性のあるユーザー体験を提供しながら、保守性と拡張性の高いUIを実現しています。
