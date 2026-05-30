import React from 'react';
import { Square } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { motion } from 'framer-motion';

export default function StopButton() {
  const { stopGeneration } = useChatStore();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        stopGeneration();
      }}
      className="relative flex items-center justify-center p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 shadow-sm group cursor-pointer focus:outline-none"
      title="Stop Generating"
    >
      <div className="absolute inset-0 rounded-lg bg-neutral-700/10 animate-ping opacity-75" />
      <motion.div
        animate={{ scale: [1, 0.95, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="relative z-10"
      >
        <Square className="w-3.5 h-3.5 fill-current text-neutral-400 group-hover:text-white" />
      </motion.div>
    </button>
  );
}
