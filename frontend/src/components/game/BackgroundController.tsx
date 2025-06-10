import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import CyberPsychedelicBackground from './CyberPsychedelicBackground';

export default function BackgroundController() {
  const { state } = useGameState();
  const [variant, setVariant] = useState<'matrix' | 'cyber'>('matrix');
  const [intensity, setIntensity] = useState(0.3);
  const [brightness, setBrightness] = useState(0.6);
  const [pulseEffect, setPulseEffect] = useState(false);

  // コンボがあったときにパルスエフェクトを作動させる
  useEffect(() => {
    // コンボ数が変化したときにパルスエフェクトを発生（ただし4コンボ以上限定）
    if (state.comboCount >= 4) {
      setPulseEffect(true);
      
      // 短時間で元に戻す
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 600); // 短くして軽く
      
      return () => clearTimeout(timer);
    }
  }, [state.comboCount]);

  // 時間やコンボによる背景変化
  useEffect(() => {
    // 残り時間に応じた変化
    if (state.time <= 10) {
      // 危険時は赤系のサイバー演出
      setVariant('cyber');
      setIntensity(0.8);
      setBrightness(0.9); // 0.7 → 0.85に上げる
    } else if (state.time <= 30) {
      // 中間は緊張感を高めるサイバー
      setVariant('cyber');
      setIntensity(0.6);
      setBrightness(0.8); // 0.65 → 0.8に上げる
    } else {
      // 通常時はマトリックス
      setVariant('matrix');
      setIntensity(0.3);
      setBrightness(0.75); // 0.6 → 0.75に上げる
    }
    
    // コンボによる変化
    if (state.comboCount >= 3) {
      // コンボが高いとエフェクトを強く、明るく
      setIntensity(prev => Math.min(0.9, prev + 0.1 * Math.min(state.comboCount / 3, 1)));
      setBrightness(prev => Math.min(0.8, prev + 0.05 * Math.min(state.comboCount / 3, 1)));
      
      // コンボが高い場合は強制的にサイバーに
      if (state.comboCount >= 5) {
        setVariant('cyber');
      }
    }
  }, [state.time, state.comboCount]);

  return (
    <>
      <CyberPsychedelicBackground 
        variant={variant} 
        intensity={pulseEffect ? intensity + 0.3 : intensity} 
        brightness={pulseEffect ? brightness + 0.15 : brightness} 
      />
      
      {/* コンボ時のフラッシュエフェクト */}
      {pulseEffect && state.comboCount >= 4 && (
        <div 
          className="fixed inset-0 bg-white/5 mix-blend-overlay z-10 pointer-events-none"
          style={{
            animation: `flash-out 0.4s ease-out forwards`
          }}
        />
      )}
    </>
  );
}
