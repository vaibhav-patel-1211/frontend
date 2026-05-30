import React, { useEffect, useRef } from 'react';
import { Menu, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import HeroSection from './HeroSection';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow() {
  const { 
    chats, 
    currentChatId, 
    toggleSidebar, 
    isGenerating,
    clearCurrentChatMessages
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const activeChat = chats.find(c => c.id === currentChatId);
  const messages = activeChat?.messages || [];
  const streamingContent = useChatStore((s) => s.streamingContent);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    if (isGenerating) {
      const container = scrollContainerRef.current;
      if (container) {
        const threshold = 150;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        if (isNearBottom) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'auto'
          });
        }
      }
    }
  }, [streamingContent, isGenerating]);

  const handleClearChat = () => {
    if (confirm('Clear all messages in this conversation?')) {
      clearCurrentChatMessages();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] overflow-hidden relative">
      
      {/* Header bar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-neutral-900 bg-[#09090b]/80 backdrop-blur-md z-10 select-none">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 cursor-pointer transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {activeChat && (
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-mono text-xs text-neutral-350 truncate">
                {activeChat.title}
              </span>
              <span className="text-[10px] text-neutral-600 font-mono select-none">
                ({messages.length} msg)
              </span>
            </div>
          )}
        </div>

        {activeChat && messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-900 cursor-pointer transition-colors"
            title="Clear Messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Messages Scroll Feed */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin flex flex-col"
      >
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-between">
          {messages.length === 0 ? (
            <HeroSection />
          ) : (
            <div className="flex-1 flex flex-col justify-end">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isGenerating && messages.length > 0 && messages[messages.length - 1].content === '' && (
                <div className="flex justify-start items-center space-x-2 mb-8 pl-1">
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Inputs area */}
      <div className="w-full bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pt-4">
        <ChatInput />
      </div>
    </div>
  );
}
