import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  const dotVariants = {
    start: { y: '0%' },
    end: { y: '50%' }
  };

  const dotTransition = (delay) => ({
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
    delay: delay
  });

  return (
    <div className="flex items-center space-x-1.5 px-1 py-2">
      <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase mr-1 select-none">
        THINKING
      </div>
      <div className="flex space-x-1 items-center h-4">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={dotTransition(index * 0.12)}
            className="w-1 h-1 rounded-full bg-neutral-600"
          />
        ))}
      </div>
    </div>
  );
}
