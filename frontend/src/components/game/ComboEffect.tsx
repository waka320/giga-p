import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComboEffectProps {
  comboCount: number;
  term?: string;
  isVisible: boolean;
}

export default function ComboEffect({ comboCount, term, isVisible }: ComboEffectProps) {
  // コンボ数に応じた色とサイズを設定
  const getComboColor = () => {
    if (comboCount >= 5) return "text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]";
    if (comboCount >= 4) return "text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]";
    if (comboCount >= 3) return "text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
    if (comboCount >= 2) return "text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]";
    return "text-terminal-green shadow-[0_0_15px_rgba(12,250,0,0.4)]";
  }
  
  // コンボ数に応じたスケールを設定
  const getComboScale = () => {
    return Math.min(1 + (comboCount * 0.15), 2.0);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          {/* 中央に表示されるコンボ数 - シンプル化 */}
          <motion.div
            className={cn(
              "font-pixel text-3xl md:text-7xl",
              getComboColor()
            )}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0.8, 0],
              scale: [0.8, getComboScale(), getComboScale() * 1.1, getComboScale() * 1.5],
              y: [0, -20, -40, -60]
            }}
            transition={{ 
              duration: 1,
              times: [0, 0.2, 0.6, 1] 
            }}
            exit={{ opacity: 0 }}
          >
            {comboCount}x
          </motion.div>
          
          {/* 発見した用語の表示 - より目立つように */}
          {term && (
            <motion.div
              className={cn(
                "absolute mt-16 font-mono text-base md:text-xl tracking-wider font-semibold",
                getComboColor()
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [20, 0, -20],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              {term}
            </motion.div>
          )}
          
          {/* 高いコンボのときだけ残像エフェクト表示 */}
          {comboCount >= 4 && Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute font-pixel text-2xl md:text-5xl opacity-40",
                getComboColor()
              )}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0, 0.2, 0],
                scale: [1, 1.3 + (i * 0.1), 1.6 + (i * 0.1)],
                x: (Math.random() * 80 - 40) * (i + 1),
                y: (Math.random() * -60 - 20) * (i + 1)
              }}
              transition={{ 
                duration: 0.7,
                delay: 0.1 + (i * 0.1)
              }}
            >
              {comboCount}x
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
