import { useGameState } from '@/hooks/useGameState';
import { motion, AnimatePresence } from 'framer-motion';

export default function BonusMessage() {
  const { state } = useGameState();

  return (
    <AnimatePresence>
      {state.showBonus && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-yellow-100 border-2 border-yellow-400 p-5 rounded-lg shadow-lg z-50
                    text-2xl font-bold text-yellow-800"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {state.bonusMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}