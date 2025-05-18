"use client";
import { motion } from "framer-motion";

export default function TransitionEffect() {
  return (
    <motion.div
      className="fixed inset-0 bg-cyber-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div 
        className="text-terminal-green font-mono text-xl animate-crt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        &gt; LOADING SYSTEM...
      </motion.div>
      <div className="absolute inset-0 scanlines pointer-events-none"></div>
    </motion.div>
  );
}