"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { ITTerm, GameState } from '@/types';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    terms: [],
    score: 0,
    selectedCells: [],
    time: 60,
    gameOver: false,
    completedTerms: [],
    comboCount: 0
  });

  const startGame = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/game');
      setGameState({
        ...gameState,
        grid: response.data.grid,
        terms: response.data.terms,
        score: 0,
        selectedCells: [],
        time: 60,
        gameOver: false,
        completedTerms: [],
        comboCount: 0
      });
      
      // タイマーの開始
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.time <= 1) {
            clearInterval(timer);
            return { ...prev, time: 0, gameOver: true };
          }
          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.gameOver) return;
    
    // すでに選択されているセルかチェック
    const alreadySelected = gameState.selectedCells.some(
      cell => cell.row === row && cell.col === col
    );
    
    if (alreadySelected) {
      // 選択解除（最後のセルの場合のみ）
      if (gameState.selectedCells.length > 0 && 
          gameState.selectedCells[gameState.selectedCells.length - 1].row === row && 
          gameState.selectedCells[gameState.selectedCells.length - 1].col === col) {
        setGameState({
          ...gameState,
          selectedCells: gameState.selectedCells.slice(0, -1)
        });
      }
      return;
    }
    
    // 隣接チェック（最初のセルは除く）
    if (gameState.selectedCells.length > 0) {
      const lastCell = gameState.selectedCells[gameState.selectedCells.length - 1];
      const isAdjacent = 
        Math.abs(lastCell.row - row) <= 1 && 
        Math.abs(lastCell.col - col) <= 1;
      
      if (!isAdjacent) return;
    }
    
    // セルを選択状態に追加
    setGameState({
      ...gameState,
      selectedCells: [...gameState.selectedCells, { row, col }]
    });
  };

  const validateSelection = async () => {
    if (gameState.selectedCells.length < 2 || gameState.gameOver) return;
    
    // 選択されたアルファベットを結合して単語を形成
    const selectedWord = gameState.selectedCells.map(
      cell => gameState.grid[cell.row][cell.col]
    ).join('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/validate', { term: selectedWord });
      
      if (response.data.valid) {
        const term = response.data.term;
        const basePoints = selectedWord.length * 10;
        const comboMultiplier = Math.min(3, 1 + gameState.comboCount * 0.25);
        const points = Math.floor(basePoints * comboMultiplier);
        
        // 新しいグリッドを作成（選択したセルを削除）
        const newGrid = gameState.grid.map((row, rowIdx) => 
          row.map((cell, colIdx) => {
            if (gameState.selectedCells.some(s => s.row === rowIdx && s.col === colIdx)) {
              return '';  // 選択したセルをクリア
            }
            return cell;
          })
        );
        
        setGameState({
          ...gameState,
          grid: newGrid,
          score: gameState.score + points,
          selectedCells: [],
          completedTerms: [...gameState.completedTerms, term],
          comboCount: gameState.comboCount + 1
        });
      } else {
        // 不正解の場合、選択をリセット
        setGameState({
          ...gameState,
          selectedCells: [],
          comboCount: 0
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>IT用語パズル</h1>
      
      <div className={styles.gameInfo}>
        <div>スコア: {gameState.score}</div>
        <div>残り時間: {gameState.time}秒</div>
        <div>コンボ: ×{Math.min(3, 1 + gameState.comboCount * 0.25).toFixed(2)}</div>
      </div>
      
      {gameState.gameOver ? (
        <div className={styles.gameOver}>
          <h2>ゲーム終了!</h2>
          <p>最終スコア: {gameState.score}</p>
          <button onClick={startGame} className={styles.button}>もう一度プレイ</button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {gameState.grid.map((row, rowIdx) => (
              <div key={rowIdx} className={styles.row}>
                {row.map((cell, colIdx) => (
                  <div 
                    key={`${rowIdx}-${colIdx}`} 
                    className={`${styles.cell} ${
                      gameState.selectedCells.some(s => s.row === rowIdx && s.col === colIdx) 
                        ? styles.selected 
                        : ''
                    }`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className={styles.controls}>
            <div className={styles.selectedWord}>
              選択中: {gameState.selectedCells.map(
                cell => gameState.grid[cell.row][cell.col]
              ).join('')}
            </div>
            <button onClick={validateSelection} className={styles.button}>
              決定
            </button>
          </div>
          
          <div className={styles.completedTerms}>
            <h3>完成した用語:</h3>
            {gameState.completedTerms.map((term, index) => (
              <div key={index} className={styles.termItem}>
                <strong>{term.term}</strong>: {term.fullName} - {term.description}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
