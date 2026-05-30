import React, { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatHistory() {
  const { 
    chats, 
    currentChatId, 
    setCurrentChatId, 
    deleteChat, 
    renameChat, 
    searchQuery 
  } = useChatStore();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChats = (chatList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      'Previous 30 Days': [],
      'Older': []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    chatList.forEach((chat) => {
      const createdDate = new Date(chat.createdAt);
      const chatDay = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());

      if (chatDay.getTime() === today.getTime()) {
        groups['Today'].push(chat);
      } else if (chatDay.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(chat);
      } else if (chatDay.getTime() >= sevenDaysAgo.getTime()) {
        groups['Previous 7 Days'].push(chat);
      } else if (chatDay.getTime() >= thirtyDaysAgo.getTime()) {
        groups['Previous 30 Days'].push(chat);
      } else {
        groups['Older'].push(chat);
      }
    });

    return groups;
  };

  const grouped = groupChats(filteredChats);

  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveRename = (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteChat(chatId);
    }
  };

  const handleKeyDown = (chatId, e) => {
    if (e.key === 'Enter') {
      saveRename(chatId, e);
    } else if (e.key === 'Escape') {
      cancelRename(e);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 space-y-4 py-2 scrollbar-thin">
      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4">
          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
            {searchQuery ? 'No results found' : 'History Empty'}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([groupName, groupItems]) => {
          if (groupItems.length === 0) return null;

          return (
            <div key={groupName} className="space-y-1">
              {/* Monospaced Group Label */}
              <h5 className="px-2.5 py-1 text-[9px] font-mono tracking-widest text-neutral-600 uppercase select-none">
                {groupName}
              </h5>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-0.5"
              >
                {groupItems.map((chat) => {
                  const isActive = chat.id === currentChatId;
                  const isEditing = chat.id === editingId;

                  return (
                    <motion.div
                      key={chat.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => !isEditing && setCurrentChatId(chat.id)}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150 relative select-none ${
                        isActive
                          ? 'bg-[#0c0c0e] border border-neutral-900 text-neutral-200 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-350 hover:bg-neutral-950/20 border border-transparent'
                      }`}
                    >
                      {/* Quiet active dot instead of vertical purple lines */}
                      {isActive && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-neutral-500" />
                      )}

                      <div className="flex items-center space-x-2 min-w-0 flex-1 pl-2">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-neutral-600 stroke-[1.5]" />
                        
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(chat.id, e)}
                            onBlur={(e) => saveRename(chat.id, e)}
                            className="bg-neutral-950 text-neutral-200 px-1 py-0.5 rounded border border-neutral-850 outline-none text-[11px] w-full font-sans focus:border-neutral-700"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate text-[12px] font-sans font-normal">
                            {chat.title}
                          </span>
                        )}
                      </div>

                      {/* Controls on hover */}
                      {!isEditing && (
                        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                          <button
                            onClick={(e) => startEditing(chat, e)}
                            className="p-1 rounded hover:bg-neutral-900 text-neutral-500 hover:text-neutral-350 transition cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3 stroke-[1.8]" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(chat.id, e)}
                            className="p-1 rounded hover:bg-neutral-900 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 stroke-[1.8]" />
                          </button>
                        </div>
                      )}

                      {/* Inline Rename save/cancel indicators */}
                      {isEditing && (
                        <div className="flex items-center space-x-0.5 shrink-0 z-10">
                          <button
                            onMouseDown={(e) => saveRename(chat.id, e)}
                            className="p-1 rounded hover:bg-neutral-900 text-emerald-500 hover:text-emerald-400 transition cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onMouseDown={cancelRename}
                            className="p-1 rounded hover:bg-neutral-900 text-neutral-500 hover:text-white transition cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          );
        })
      )}
    </div>
  );
}
