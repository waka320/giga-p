import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function CompletedTerms() {
  const { state } = useGameState();

  if (state.completedTerms.length === 0) {
    return (
      <Card className="bg-black border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.3)] w-full max-w-md mt-4 scanlines">
        <CardHeader className="p-3 border-b border-terminal-green/30">
          <CardTitle className="text-lg font-mono text-terminal-green">
            <span className="mr-2">$</span>found_terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-terminal-green/70 font-mono text-sm italic">
            {"// まだ用語が見つかっていません"}
          </p>
          <div className="text-[10px] font-mono text-terminal-green/50 mt-2">
            アルファベットを選択してIT用語を見つけよう
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-terminal-green shadow-[0_0_10px_rgba(12,250,0,0.3)] w-full max-w-md mt-4 scanlines">
      <CardHeader className="p-3 border-b border-terminal-green/30">
        <CardTitle className="text-lg font-mono text-terminal-green flex justify-between items-center">
          <span>
            <span className="mr-2">$</span>found_terms
          </span>
          <span className="text-sm">
            [{state.completedTerms.length}]
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-60 p-4">
          {state.completedTerms.map((term, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <motion.div
                  className="p-2 mb-2 bg-matrix-dark/30 rounded border-l-2 border-terminal-green cursor-help"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className="font-pixel text-terminal-green text-sm">
                      {term.term}
                    </div>
                    <div className="ml-auto text-[10px] font-mono text-terminal-green/70">
                      +{term.points || '??'}pts
                    </div>
                  </div>
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-black border border-terminal-green text-terminal-green font-mono">
                <div className="text-sm mb-1">
                  <span className="opacity-50">term:</span> {term.term}
                </div>
                <div className="text-sm mb-1">
                  <span className="opacity-50">full:</span> {term.fullName}
                </div>
                <div className="text-xs opacity-70 mt-2 border-t border-terminal-green/30 pt-2">
                  {term.description}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
