import React, { useEffect } from 'react';
import ChatPage from './pages/ChatPage';
import { useChatStore } from './store/chatStore';

function App() {
  const theme = useChatStore((state) => state.theme);

  useEffect(() => {
    // Sync theme class to document element on mount and theme state change
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <ChatPage />;
}

export default App;
