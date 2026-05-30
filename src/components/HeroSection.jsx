import React from 'react';
import SuggestedPrompts from './SuggestedPrompts';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 overflow-y-auto">
      <div className="max-w-xl w-full text-center space-y-5 flex flex-col items-center">
        
        {/* Minimalist Typographic Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-3"
        >
          <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-500 uppercase select-none">
            THEOLOGIA SYSTEM
          </div>
          <h1 className="text-2xl md:text-3xl font-normal tracking-tight text-neutral-200 font-sans">
            How can I help you explore today?
          </h1>
          <p className="text-[13px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Enter a prompt below or ask your own question about exegesis, historical theology, and church creeds.
          </p>
        </motion.div>

        {/* Suggested Prompts Block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="w-full"
        >
          <SuggestedPrompts />
        </motion.div>

      </div>
    </div>
  );
}
