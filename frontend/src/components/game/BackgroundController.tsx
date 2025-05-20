import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import CyberPsychedelicBackground from './CyberPsychedelicBackground';

export default function BackgroundController() {
  const { state } = useGameState();
  const [intensity, setIntensity] = useState(0.3);
  const [variant, setVariant] = useState<'matrix' | 'cyber' | 'glitch'>('matrix');
  const [brightness, setBrightness] = useState(0.6); // 明るさ制御を追加
  
  // ゲームの進行状況に応じて背景を変化
  useEffect(() => {
    // 時間に応じた変化
    if (state.time <= 10) {
      // 残り時間が少ない時は警告的なグリッチ
      setVariant('glitch');
      setIntensity(0.8);
      setBrightness(0.7); // 緊迫感を出すために明るく
    } else if (state.time <= 30) {
      // 中間は緊張感を高めるサイバー
      setVariant('cyber');
      setIntensity(0.6);
      setBrightness(0.65);
    } else {
      // 通常時はマトリックス
      setVariant('matrix');
      setIntensity(0.3);
      setBrightness(0.6);
    }
    
    // コンボによる変化
    if (state.comboCount >= 3) {
      // コンボが高いとエフェクトを強く、明るく
      setIntensity(prev => Math.min(0.9, prev + 0.1 * Math.min(state.comboCount / 3, 1)));
      setBrightness(prev => Math.min(0.8, prev + 0.05 * Math.min(state.comboCount / 3, 1)));
    }
  }, [state.time, state.comboCount]);

  return <CyberPsychedelicBackground intensity={intensity} variant={variant} brightness={brightness} />;
}