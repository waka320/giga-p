import { useGameState } from '@/hooks/useGameState';
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CompletedTerms() {
  const { state } = useGameState();
  console.log("CompletedTerms: state", state);

  if (state.completedTerms.length === 0) {
    return (
      <div className="w-full max-w-xs mx-auto font-mono text-[10px] text-white/60 bg-black/40 border-t border-white/10">
        <div className="p-1 border-b border-white/10 flex items-center">
          <span className="text-gray-500 mr-1">$</span>
          <span>cat found_terms.log</span>
        </div>
        <div className="p-1">
          <span className="text-gray-500"># ログは空です。まだ用語が見つかっていません。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto font-mono text-[10px] text-white/70 bg-black/40 border-t border-white/10">
      <div className="p-1 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-gray-500 mr-1">$</span>
          <span>cat found_terms.log</span>
        </div>
        <div className="text-gray-500">total: {state.completedTerms.length}</div>
      </div>
      <div className="max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {state.completedTerms.map((term, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 border-b border-white/5 flex justify-between items-center cursor-help"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">{index + 1}:</span>
                    <span className="text-terminal-green/90 font-pixel">{term.term}</span>
                  </div>
                  <span className="text-gray-400">+{Number(term.points) || 0}pts</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black border border-white/20 text-white text-[10px] max-w-[250px]">
                <div className="mb-1"><span className="text-gray-400">term:</span> {term.term}</div>
                <div className="mb-1"><span className="text-gray-400">full:</span> {term.fullName}</div>
                <div className="text-[8px] text-gray-300">{term.description}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
