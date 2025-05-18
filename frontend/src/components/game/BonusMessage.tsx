import { useGameState } from '@/hooks/useGameState';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function BonusMessage() {
  const { state } = useGameState();

  return (
    <AnimatePresence>
      {state.showBonus && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, -1, 1, -1, 0] // 小さく揺れるアニメーション
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            rotate: { repeat: 3, duration: 0.1 } 
          }}
        >
          <Alert className="border-2 border-terminal-green bg-black text-terminal-green p-4 shadow-[0_0_15px_rgba(12,250,0,0.5)] scanlines max-w-xs">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terminal-green/10 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
            
            <AlertTitle className="text-center font-pixel text-xl mb-2 tracking-wide">
              BONUS DETECTED
            </AlertTitle>
            
            <AlertDescription className="text-center font-mono text-base">
              {state.bonusMessage}
            </AlertDescription>
            
            <div className="mt-2 text-center text-[10px] font-mono opacity-70">
              [システム] ボーナスポイントが加算されました
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}