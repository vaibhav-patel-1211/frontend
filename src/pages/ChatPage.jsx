import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    createNewChat,
    loadChats 
  } = useChatStore();

  // Load chats from backend on mount
  useEffect(() => { loadChats(); }, [loadChats]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      
      // Ctrl/Cmd + N = New Chat
      if (isMeta && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewChat]);

  // Adjust sidebar responsive limits
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        useChatStore.getState().setSidebarOpen(false);
      } else {
        useChatStore.getState().setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#09090b] text-neutral-200">
      
      <Sidebar />

      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px] md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Main Chat Feed */}
      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <ChatWindow />
      </div>
    </div>
  );
}
