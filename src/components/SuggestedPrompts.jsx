import React from 'react';
import { useChatStore } from '../store/chatStore';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { label: "Explain John 3:16", text: "Explain John 3:16" },
  { label: "What is the Trinity?", text: "What is the Trinity?" },
  { label: "Compare Catholic & Protestant", text: "Compare Catholic and Protestant views" },
  { label: "Generate Noah's Ark Image", text: "Generate image of Noah's Ark" }
];

export default function SuggestedPrompts() {
  const { sendMessage } = useChatStore();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto px-4 mt-8">
      {SUGGESTIONS.map((sug, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => sendMessage(sug.text)}
          className="px-3.5 py-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/40 text-[12.5px] font-normal text-neutral-400 hover:text-neutral-200 transition-all duration-200 cursor-pointer shadow-sm"
        >
          {sug.label}
        </motion.button>
      ))}
    </div>
  );
}
