import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, X, Keyboard, Command, CornerDownLeft
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import ChatHistory from './ChatHistory';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    createNewChat, 
    searchQuery, 
    setSearchQuery
  } = useChatStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen layout changes dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = () => {
    createNewChat();
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear ALL chat history? This cannot be undone.')) {
      localStorage.removeItem('premium_chats');
      localStorage.removeItem('premium_current_chat_id');
      window.location.reload();
    }
  };

  return (
    <>
      {/* Smooth Spring Width/Translate Sidebar Element */}
      <motion.div
        initial={false}
        animate={{ 
          x: isMobile ? (isSidebarOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : (isSidebarOpen ? 280 : 0),
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className={`fixed md:static inset-y-0 left-0 z-40 h-full flex flex-col border-r border-neutral-900 bg-[#09090b] shrink-0 overflow-hidden`}
      >
        {/* Inner container to prevent content shrinking during transition */}
        <div className="w-[280px] h-full flex flex-col select-none">
          
          {/* Header / Typographic Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-900/60">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-medium text-xs tracking-[0.2em] text-neutral-350 select-none">
                THEOLOGIA
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded text-[9px] font-mono select-none">
                v1.0.0
              </span>
            </div>

            {/* Close Sidebar (Mobile only) */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1 rounded hover:bg-neutral-900 text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0c0e] hover:bg-[#121214] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-normal text-xs cursor-pointer active:scale-[0.99] transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="px-4 py-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-neutral-600" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-neutral-900 focus:border-neutral-850 rounded-lg py-1.5 pl-8.5 pr-4 text-xs outline-none text-neutral-300 placeholder-neutral-600 transition-all font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-neutral-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Chat History Panel */}
          <ChatHistory />

          {/* User Profile Area */}
          <div className="p-3 border-t border-neutral-900/60 bg-[#09090b] relative">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-neutral-900 cursor-pointer flex-1 min-w-0 transition-colors duration-150"
              >
                <div className="w-6.5 h-6.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-xs select-none">
                  V
                  {/* Active Indicator Light */}
                  <div className="absolute top-[18px] left-[25px] w-1.5 h-1.5 rounded-full bg-emerald-500 border border-[#09090b]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-xs text-neutral-350 leading-tight truncate">
                    Vaibhav
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono truncate leading-none mt-0.5">
                    vaibhav@theologia.ai
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                    className="absolute bottom-14 left-3 right-3 z-20 p-1.5 rounded-xl border border-neutral-800 bg-[#0e0e11] shadow-xl flex flex-col space-y-0.5"
                  >
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowShortcutsModal(true);
                      }}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] text-neutral-450 hover:text-neutral-200 hover:bg-neutral-900 transition cursor-pointer"
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      <span>Shortcuts</span>
                    </button>
                    
                    <button
                      onClick={handleClearHistory}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] text-red-500 hover:text-red-400 hover:bg-red-900/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Conversations</span>
                    </button>

                    <div className="h-[1px] bg-neutral-900 my-1" />
                    
                    <div className="px-2.5 py-1 text-[9px] font-mono text-neutral-500 flex items-center justify-between">
                      <span>Theologia Pro v1.0</span>
                      <span className="bg-neutral-900 text-neutral-400 px-1 py-0.5 rounded border border-neutral-850">
                        BETA
                      </span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* KEYBOARD SHORTCUTS MODAL */}
      <AnimatePresence>
        {showShortcutsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-sm rounded-xl border border-neutral-850 bg-[#0e0e11] p-5 shadow-2xl relative"
            >
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-900 text-neutral-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  KEYBOARD SHORTCUTS
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-[11px] text-neutral-400">Submit prompt</span>
                  <kbd className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                    <CornerDownLeft className="w-2.5 h-2.5" />
                    <span>Enter</span>
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-[11px] text-neutral-400">New line</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                    Shift + Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-[11px] text-neutral-400">New chat</span>
                  <kbd className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                    <Command className="w-2.5 h-2.5" />
                    <span>N</span>
                  </kbd>
                </div>
              </div>

              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full mt-5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-neutral-300 hover:text-white text-xs font-normal py-2 rounded-lg cursor-pointer transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
