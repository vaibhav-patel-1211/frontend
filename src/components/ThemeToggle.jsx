import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useChatStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 focus:outline-none"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        className="w-5 h-5 flex items-center justify-center"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-violet-400" />
        ) : (
          <Sun className="w-5 h-5 text-neutral-600" />
        )}
      </motion.div>
    </button>
  );
}
