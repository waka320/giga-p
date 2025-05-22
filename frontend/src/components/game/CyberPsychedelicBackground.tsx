import { useEffect, useRef } from 'react';

interface CyberPsychedelicBackgroundProps {
  intensity?: number; // 0.0〜1.0 でエフェクトの強さを調整
  variant?: 'matrix' | 'cyber' | 'glitch'; // 背景のバリエーション
  brightness?: number; // 0.0〜1.0 で全体の明るさを調整 (追加)
}

export default function CyberPsychedelicBackground({
  intensity = 0.5,
  variant = 'matrix',
  brightness = 0.6 // デフォルト値を明るめに設定 (変更)
}: CyberPsychedelicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  let frameCount = 0;

  // Canvas描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズをウィンドウに合わせる
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 色の設定 - 明るさを上げる
    const colors = {
      matrix: ['#0CFA00', '#00FF41', '#00FF00', '#11FF11'], // 明るいグリーン (変更)
      cyber: ['#00FFFF', '#FF00FF', '#55AAFF', '#7700FF'],  // 明るいネオン (変更)
      glitch: ['#FF0033', '#00FFFF', '#FF00FF', '#FFFFFF']  // そのまま
    };

    const selectedColors = colors[variant];
    let time = 0;

    // アニメーションフレーム
    const animate = () => {
      // フレームスキップを追加
      if (frameCount % 2 !== 0) {  // 2フレームに1回だけ描画
        frameCount++;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      frameCount++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 背景を暗めの黒からダークグレーに変更して明るく
      ctx.fillStyle = '#111111'; // 以前の #000000 から変更
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // グリッドのサイズ
      const gridSize = 40;
      const waveHeight = 15 * intensity;
      const waveFrequency = 0.05;

      // 波形グリッドパターンの描画
      for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
          // 時間とともに変化する波形オフセット
          const offsetX = Math.sin(y * waveFrequency + time) * waveHeight;
          const offsetY = Math.cos(x * waveFrequency + time) * waveHeight;

          // パターンの選択
          if (variant === 'matrix') {
            // マトリックス風の円形
            ctx.beginPath();
            ctx.arc(
              x + offsetX,
              y + offsetY,
              Math.sin(time * 0.5) * 5 + 5,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = selectedColors[Math.floor(Math.random() * selectedColors.length)];
            // 明るさを調整（増加）
            ctx.globalAlpha = Math.min(0.2 + Math.sin(time + x * y) * 0.1, 1) * brightness;
            ctx.fill();
          } else if (variant === 'cyber') {
            // サイバー風の四角形
            const size = Math.sin(time * 0.3 + x * 0.01 + y * 0.01) * 10 + 10;
            ctx.beginPath();
            ctx.rect(
              x + offsetX - size / 2,
              y + offsetY - size / 2,
              size,
              size
            );
            ctx.fillStyle = selectedColors[Math.floor(Math.random() * selectedColors.length)];
            // 明るさを調整（増加）
            ctx.globalAlpha = Math.min(0.2 + Math.sin(time + x * y) * 0.1, 1) * brightness;
            ctx.fill();
          } else {
            // グリッチ風の線
            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY);
            ctx.lineTo(x + offsetX + 20, y + offsetY + Math.sin(time) * 20);
            ctx.strokeStyle = selectedColors[Math.floor(Math.random() * selectedColors.length)];
            // 明るさを調整（増加）
            ctx.globalAlpha = Math.min(0.2 + Math.sin(time + x * y) * 0.1, 1) * brightness;
            ctx.lineWidth = Math.random() * 3;
            ctx.stroke();
          }
        }
      }

      // 追加のエフェクト：流れる線
      ctx.globalAlpha = 0.15 * brightness; // 明るさに応じて調整
      for (let i = 0; i < 10; i++) {
        const y = (time * 50 + i * 100) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = selectedColors[i % selectedColors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 時間を進める
      time += 0.01;
      ctx.globalAlpha = 1.0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, variant, brightness]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-noise" />
    </div>
  );
}
