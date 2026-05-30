import { create } from 'zustand';

let ws = null;
let messageHandler = null;

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-6qyx.onrender.com';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

function getWs() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return ws;
  }
  ws = new WebSocket(`${WS_BASE}/ws/chat`);
  ws.onmessage = (e) => {
    if (messageHandler) messageHandler(JSON.parse(e.data));
  };
  ws.onclose = () => { ws = null; };
  ws.onerror = () => { ws = null; };
  return ws;
}

function waitForOpen(socket) {
  if (socket.readyState === WebSocket.OPEN) return Promise.resolve();
  if (socket.readyState !== WebSocket.CONNECTING) return Promise.reject(new Error('WebSocket closed'));
  return new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
}

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChatId: null,
  theme: 'dark',
  isSidebarOpen: true,
  searchQuery: '',
  isGenerating: false,
  isImageMode: false,

  // Flat streaming state — updated on every token for fast re-renders
  streamingMessageId: null,
  streamingContent: '',

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (v) => set({ isSidebarOpen: v }),
  setSearchQuery: (v) => set({ searchQuery: v }),
  setIsImageMode: (v) => set({ isImageMode: v }),

  loadChats: async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/list`);
      if (res.ok) {
        const chats = await res.json();
        set({ chats });
      }
    } catch (e) {
      console.error('Failed to load chats', e);
    }
  },

  setCurrentChatId: (id) => set({ currentChatId: id }),

  createNewChat: async (initialMsgText = null) => {
    try {
      const res = await fetch(`${API_BASE}/chat/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: initialMsgText ? initialMsgText.substring(0, 30) : 'New Chat' }),
      });
      if (res.ok) {
        const chat = await res.json();
        set((s) => ({ chats: [{ ...chat, messages: chat.messages || [] }, ...s.chats], currentChatId: chat.id }));
        return chat.id;
      }
    } catch (e) {
      console.error('Failed to create chat', e);
    }
    return null;
  },

  deleteChat: async (chatId) => {
    try {
      await fetch(`${API_BASE}/chat/${chatId}`, { method: 'DELETE' });
      set((s) => {
        const chats = s.chats.filter((c) => c.id !== chatId);
        const currentChatId = s.currentChatId === chatId ? (chats[0]?.id || null) : s.currentChatId;
        return { chats, currentChatId };
      });
    } catch (e) {
      console.error('Failed to delete chat', e);
    }
  },

  renameChat: async (chatId, newTitle) => {
    try {
      await fetch(`${API_BASE}/chat/${chatId}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      set((s) => ({
        chats: s.chats.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c)),
      }));
    } catch (e) {
      console.error('Failed to rename chat', e);
    }
  },

  clearCurrentChatMessages: () => {
    const { currentChatId } = get();
    if (!currentChatId) return;
    set((s) => ({
      chats: s.chats.map((c) => (c.id === currentChatId ? { ...c, messages: [] } : c)),
    }));
  },

  stopGeneration: () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }
    messageHandler = null;
    set({ isGenerating: false, streamingMessageId: null, streamingContent: '' });
  },

  sendMessage: async (text) => {
    if (!text.trim()) return;

    let { currentChatId, isImageMode } = get();

    if (!currentChatId) {
      currentChatId = await get().createNewChat(text);
      if (!currentChatId) return;
    }

    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    set((s) => {
      const chat = s.chats.find((c) => c.id === currentChatId);
      const shouldUpdateTitle = chat && (!chat.messages || chat.messages.length === 0);
      return {
        isGenerating: true,
        chats: s.chats.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                title: shouldUpdateTitle ? text.substring(0, 30) : c.title,
                messages: [...(c.messages || []), userMessage],
              }
            : c
        ),
      };
    });

    const isImagePrompt = isImageMode || text.trim().toLowerCase().startsWith('generate image');

    if (isImagePrompt) {
      get()._handleImageGeneration(text, currentChatId);
    } else {
      get()._handleWebSocket(text, currentChatId);
    }
  },

  _handleWebSocket: async (text, chatId) => {
    const assistantMsgId = 'msg_' + Date.now();

    // Add placeholder and set streaming state
    set((s) => ({
      streamingMessageId: assistantMsgId,
      streamingContent: '',
      chats: s.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...(c.messages || []),
                { id: assistantMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true, citations: [] },
              ],
            }
          : c
      ),
    }));

    messageHandler = (data) => {
      const { type } = data;

      if (type === 'token') {
        // Only update the flat streaming key — very cheap, triggers re-render in components that subscribe
        set((s) => ({ streamingContent: s.streamingContent + data.content }));
      } else if (type === 'done') {
        messageHandler = null;
        const finalContent = data.response || get().streamingContent;
        const citations = data.citations || [];
        set((s) => {
          const chat = s.chats.find((c) => c.id === chatId);
          if (!chat) return { isGenerating: false, streamingMessageId: null, streamingContent: '' };
          const msgs = [...(chat.messages || [])];
          const lastIdx = msgs.length - 1;
          if (msgs[lastIdx] && msgs[lastIdx].id === assistantMsgId) {
            msgs[lastIdx] = { ...msgs[lastIdx], content: finalContent, isStreaming: false, citations };
          }
          return {
            chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: msgs } : c)),
            isGenerating: false,
            streamingMessageId: null,
            streamingContent: '',
          };
        });
      } else if (type === 'image') {
        set((s) => {
          const chat = s.chats.find((c) => c.id === chatId);
          if (!chat) return s;
          const msgs = [...(chat.messages || [])];
          const lastIdx = msgs.length - 1;
          if (msgs[lastIdx] && msgs[lastIdx].id === assistantMsgId) {
            msgs[lastIdx] = { ...msgs[lastIdx], imageUrl: data.image_url?.startsWith('/') ? `${API_BASE}${data.image_url}` : data.image_url };
          }
          return { chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: msgs } : c)) };
        });
      } else if (type === 'error') {
        messageHandler = null;
        set((s) => {
          const chat = s.chats.find((c) => c.id === chatId);
          if (!chat) return { isGenerating: false, streamingMessageId: null, streamingContent: '' };
          const msgs = [...(chat.messages || [])];
          const lastIdx = msgs.length - 1;
          if (msgs[lastIdx] && msgs[lastIdx].id === assistantMsgId) {
            msgs[lastIdx] = { ...msgs[lastIdx], content: `Error: ${data.message}`, isStreaming: false };
          }
          return {
            chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: msgs } : c)),
            isGenerating: false,
            streamingMessageId: null,
            streamingContent: '',
          };
        });
      }
    };

    try {
      const socket = getWs();
      await waitForOpen(socket);
      socket.send(JSON.stringify({ chat_id: chatId, message: text }));
    } catch (e) {
      console.error('WebSocket error', e);
      messageHandler = null;
      set({ isGenerating: false, streamingMessageId: null, streamingContent: '' });
    }
  },

  _handleImageGeneration: async (prompt, chatId) => {
    const assistantMsg = {
      id: 'msg_' + Date.now(),
      role: 'assistant',
      content: 'Generating Image...',
      timestamp: new Date().toISOString(),
      isGeneratingImage: true,
      imagePrompt: prompt,
    };

    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...(c.messages || []), assistantMsg] } : c
      ),
    }));

    try {
      const res = await fetch(`${API_BASE}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      set((s) => {
        const chat = s.chats.find((c) => c.id === chatId);
        if (!chat) return s;
        const msgs = [...(chat.messages || [])];
        const last = msgs[msgs.length - 1];
        if (last && last.isGeneratingImage) {
          if (res.ok) {
            const imgUrl = data.image_url?.startsWith('/') ? `${API_BASE}${data.image_url}` : data.image_url;
            msgs[msgs.length - 1] = { ...last, isGeneratingImage: false, imageUrl: imgUrl, content: `Generated artwork for: "${prompt}"` };
          } else {
            msgs[msgs.length - 1] = { ...last, isGeneratingImage: false, content: `Error: ${data.detail || 'Image generation failed'}` };
          }
        }
        return { chats: s.chats.map((c) => (c.id === chatId ? { ...c, messages: msgs } : c)), isGenerating: false };
      });
    } catch (e) {
      console.error('Image generation failed', e);
      set({ isGenerating: false });
    }
  },

  regenerateResponse: (messageId = null) => {
    const { currentChatId, chats } = get();
    if (!currentChatId) return;

    const chat = chats.find((c) => c.id === currentChatId);
    if (!chat || !chat.messages?.length) return;

    let assistantMsgIndex = -1;
    let userPrompt = '';

    if (messageId) {
      assistantMsgIndex = chat.messages.findIndex((m) => m.id === messageId);
      if (assistantMsgIndex > 0 && chat.messages[assistantMsgIndex - 1].role === 'user') {
        userPrompt = chat.messages[assistantMsgIndex - 1].content;
      }
    } else {
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (chat.messages[i].role === 'assistant') {
          assistantMsgIndex = i;
          if (i > 0 && chat.messages[i - 1].role === 'user') userPrompt = chat.messages[i - 1].content;
          break;
        }
      }
    }

    if (assistantMsgIndex === -1 || !userPrompt) return;

    const trimmedMessages = chat.messages.slice(0, assistantMsgIndex);
    set((s) => ({
      chats: s.chats.map((c) => (c.id === currentChatId ? { ...c, messages: trimmedMessages } : c)),
      isGenerating: true,
    }));

    const isImagePrompt = get().isImageMode || userPrompt.trim().toLowerCase().startsWith('generate image');
    if (isImagePrompt) {
      get()._handleImageGeneration(userPrompt, currentChatId);
    } else {
      get()._handleWebSocket(userPrompt, currentChatId);
    }
  },
}));
