import axios from 'axios';
import { ITTerm } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// 単語辞書をキャッシュするためのシングルトン
class TermDictionary {
    private static instance: TermDictionary;
    private terms: ITTerm[] = [];
    private termsMap: Map<string, ITTerm> = new Map();
    private isLoaded = false;

    private constructor() { }

    public static getInstance(): TermDictionary {
        if (!TermDictionary.instance) {
            TermDictionary.instance = new TermDictionary();
        }
        return TermDictionary.instance;
    }

    public async loadTerms(): Promise<void> {
        if (this.isLoaded) return;

        try {
            const response = await axios.get<ITTerm[]>(`${API_URL}/terms`);
            this.terms = response.data;

            // 検索を高速化するためにMapに格納
            this.terms.forEach(term => {
                this.termsMap.set(term.term.toUpperCase(), term);
            });

            this.isLoaded = true;
            console.log(`単語辞書をロード完了: ${this.terms.length}件`);
        } catch (error) {
            console.error('単語辞書のロードに失敗:', error);
            throw error;
        }
    }

    public validateTerm(term: string): ITTerm | null {
        if (!term) return null;
        return this.termsMap.get(term.toUpperCase()) || null;
    }

    public getTerms(): ITTerm[] {
        return this.terms;
    }

    public isTermLoaded(): boolean {
        return this.isLoaded;
    }
}

// ゲームロジッククラスの追加
class GameLogic {
    // グリッド生成ロジック
    public static generateGameGrid(terms: ITTerm[], debug: boolean = false): string[][] {
        // 5x5のグリッドを生成
        const grid: string[][] = Array(5).fill('').map(() => Array(5).fill(''));

        if (debug) {
            // デバッグモードの簡易グリッド生成
            const debugWords = ["AAAAA", "BBBBB", "CCCCC", "DDDDD", "EEEEE"];

            for (let i = 0; i < Math.min(5, debugWords.length); i++) {
                for (let j = 0; j < 5; j++) {
                    if (i < 5 && j < 5 && j < debugWords[i].length) {
                        grid[i][j] = debugWords[i][j];
                    }
                }
            }
            return grid;
        }

        // 単語を配置するためのロジック
        const usedCells = new Set<string>();

        // 最大5つの単語を選択 (単語が多すぎると配置が難しくなるため)
        const selectedTerms = GameLogic.selectRandomTerms(terms, 5);

        // 各配置方向
        const directions = [
            { name: 'horizontal', dx: 1, dy: 0 },
            { name: 'vertical', dx: 0, dy: 1 },
            { name: 'diagonal', dx: 1, dy: 1 },
            { name: 'reverse_diagonal', dx: 1, dy: -1 }
        ];

        // 各単語をグリッドに配置
        for (const term of selectedTerms) {
            // 単語を大文字に変換
            const uppercaseTerm = term.term.toUpperCase();
            if (uppercaseTerm.length > 5) continue; // 5文字を超える単語はスキップ

            // 方向をシャッフル
            GameLogic.shuffleArray(directions);
            let placed = false;

            // 各方向で配置を試みる
            for (const direction of directions) {
                if (placed) break;

                // 20回試行
                for (let attempt = 0; attempt < 20; attempt++) {
                    // ランダムな開始位置
                    const startRow = Math.floor(Math.random() * 5);
                    const startCol = Math.floor(Math.random() * 5);

                    // この位置と方向での単語の配置が可能か確認
                    if (GameLogic.canPlaceWord(grid, uppercaseTerm, startRow, startCol, direction.dx, direction.dy, usedCells)) {
                        // 単語を配置
                        for (let i = 0; i < uppercaseTerm.length; i++) {
                            const row = startRow + i * direction.dy;
                            const col = startCol + i * direction.dx;
                            grid[row][col] = uppercaseTerm[i];
                            usedCells.add(`${row},${col}`);
                        }
                        placed = true;
                        break;
                    }
                }
            }
        }

        // 空白を埋める
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (grid[i][j] === '') {
                    // ランダムなアルファベットで埋める
                    grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }

        return grid;
    }

    // 単語を配置できるかチェック
    private static canPlaceWord(
        grid: string[][],
        word: string,
        startRow: number,
        startCol: number,
        dx: number,
        dy: number,
        usedCells: Set<string>
    ): boolean {
        // 単語が配置できる長さかチェック
        const endRow = startRow + (word.length - 1) * dy;
        const endCol = startCol + (word.length - 1) * dx;

        // グリッドをはみ出さないかチェック
        if (endRow < 0 || endRow >= 5 || endCol < 0 || endCol >= 5) {
            return false;
        }

        // 他の単語と重複しないかチェック
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dy;
            const col = startCol + i * dx;
            const cell = `${row},${col}`;

            // 既に使用されているセルか、別の文字が入っていればNG
            if (usedCells.has(cell) && grid[row][col] !== '' && grid[row][col] !== word[i]) {
                return false;
            }
        }

        return true;
    }

    // 配列をランダムに並べ替える
    private static shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ランダムな単語を選択
    private static selectRandomTerms(terms: ITTerm[], count: number): ITTerm[] {
        const shuffled = [...terms];
        GameLogic.shuffleArray(shuffled);

        // 短い単語を優先的に選択（5文字以下）
        const shortTerms = shuffled.filter(term => term.term.length <= 5);
        const selectedTerms = shortTerms.slice(0, count);

        // 短い単語が足りない場合は他の単語も使用
        if (selectedTerms.length < count) {
            const remaining = shuffled.filter(term => term.term.length > 5);
            selectedTerms.push(...remaining.slice(0, count - selectedTerms.length));
        }

        return selectedTerms;
    }

    // ポイント計算
    public static calculatePoints(fullName: string, comboCount: number, isDuplicate: boolean = false): number {
        // スペースを除いた文字数を数える
        const charCount = fullName.replace(/\s/g, '').length;

        // 重複の場合は異なる計算式を使用
        if (isDuplicate) {
            // 重複の場合：(元の文字数) × (1 + コンボ数)
            return charCount * (1 + comboCount);
        } else {
            // 通常の計算式：(元の文字数) × (10 + コンボ数)
            return charCount * (10 + comboCount);
        }
    }

    // フィールドボーナス計算
    public static checkFieldBonus(grid: string[][]): [number, string, boolean] {
        // 残りのセル数をカウント
        const remainingCells = grid.flat().filter(cell => cell !== '').length;

        // 全消しの場合
        if (remainingCells === 0) {
            return [1000, "全消しボーナス！ +1000点", true];
        }

        // 残りが1マス以下の場合のみリセット
        else if (remainingCells <= 1) {
            const bonus = (6 - remainingCells) * 50;
            return [bonus, `残り${remainingCells}マスボーナス！ +${bonus}点`, true];
        }

        // 残りが2～5マスの場合はリセットしない
        else if (remainingCells <= 5) {
            const bonus = (6 - remainingCells) * 50;
            return [bonus, `残り${remainingCells}マスボーナス！ +${bonus}点`, false];
        }

        // それ以外の場合
        return [0, "", false];
    }

    // 新しいグリッドを作成（選択されたセルを空にする）
    public static createNewGrid(grid: string[][], selection: { row: number; col: number }[]): string[][] {
        const newGrid = grid.map(row => [...row]);
        selection.forEach(cell => {
            newGrid[cell.row][cell.col] = '';
        });
        return newGrid;
    }
}

// APIクライアント
const apiClient = {
    // TermDictionaryクラスを公開
    TermDictionary,

    // ゲーム開始時に呼び出す
    preloadGame: async () => {
        // 単語辞書をロード
        const dictionary = TermDictionary.getInstance();
        await dictionary.loadTerms();

        // バックエンドからセッション情報のみを取得
        const response = await axios.post(`${API_URL}/game/start`, {
            start_timer: false
        });

        // 得られたセッションIDとバックエンドから提供される情報を返す
        return {
            sessionId: response.data.session_id,
            grid: response.data.grid,
            terms: response.data.terms
        };
    },

    // フロントエンドでの選択検証
    validateSelection: (grid: string[][], selection: { row: number; col: number }[]): {
        valid: boolean;
        term?: ITTerm;
        selectedWord: string;
    } => {
        // 選択からワードを生成
        const selectedWord = selection.map(cell => grid[cell.row][cell.col]).join('');

        // 単語辞書で検証
        const dictionary = TermDictionary.getInstance();
        const term = dictionary.validateTerm(selectedWord);

        return {
            valid: !!term,
            term: term || undefined,
            selectedWord
        };
    },

    // ゲーム終了時に結果を送信
    submitGameResult: async (sessionId: string, completedTerms: ITTerm[], score: number) => {
        return axios.post(`${API_URL}/game/${sessionId}/end`, {
            completed_terms: completedTerms.map(term => term.term),
            score
        });
    },

    // フロントエンドでゲームグリッドを生成
    generateGameGrid: (terms: ITTerm[], debug: boolean = false): string[][] => {
        return GameLogic.generateGameGrid(terms, debug);
    },

    // フロントエンドでポイント計算
    calculatePoints: (fullName: string, comboCount: number, isDuplicate: boolean = false): number => {
        return GameLogic.calculatePoints(fullName, comboCount, isDuplicate);
    },

    // フロントエンドでボーナス計算
    checkFieldBonus: (grid: string[][]): [number, string, boolean] => {
        return GameLogic.checkFieldBonus(grid);
    },

    // 選択されたセルを空にした新しいグリッドを作成
    createNewGrid: (grid: string[][], selection: { row: number; col: number }[]): string[][] => {
        return GameLogic.createNewGrid(grid, selection);
    }
};

export default apiClient;
