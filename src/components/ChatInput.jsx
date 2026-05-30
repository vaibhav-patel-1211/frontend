import React, { useRef, useState, useEffect } from 'react';
import { Send, X, CornerDownLeft, Image as ImageIcon } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import StopButton from './StopButton';

export default function ChatInput() {
  const { 
    sendMessage, 
    isGenerating, 
    isImageMode, 
    setIsImageMode 
  } = useChatStore();

  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearInput = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 select-none">
      {/* Inputs container */}
      <div className="bg-[#0c0c0e] rounded-xl border border-neutral-900 relative shadow-sm focus-within:border-neutral-800 transition-all duration-150">
        
        {/* Monospaced Image Mode banner */}
        {isImageMode && (
          <div className="flex items-center px-4 py-1.5 bg-[#0e0e11] border-b border-neutral-900 text-[10px] text-neutral-500 font-mono tracking-widest uppercase rounded-t-xl select-none">
            <span>Image Generation Active</span>
          </div>
        )}

        <div className="flex flex-col p-2.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isImageMode 
                ? "Describe the artwork to generate..." 
                : "Ask a scripture, history, or theological question..."
            }
            className="w-full resize-none bg-transparent outline-none border-none py-1.5 px-2 text-neutral-200 text-sm max-h-48 overflow-y-auto leading-relaxed placeholder-neutral-600 font-sans"
          />

          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-t border-neutral-900/60 mt-2.5 pt-2 px-1">
            <div className="flex items-center space-x-1">
              {/* Image mode toggle */}
              <button
                onClick={() => setIsImageMode(!isImageMode)}
                className={`p-2 rounded transition cursor-pointer flex items-center ${
                  isImageMode 
                    ? 'text-neutral-200 bg-neutral-900 border border-neutral-800' 
                    : 'text-neutral-500 hover:text-neutral-350 hover:bg-neutral-900'
                }`}
                title="Toggle Image Mode"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>

              {/* Clear Input */}
              {text.length > 0 && (
                <button
                  onClick={clearInput}
                  className="p-2 rounded hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {text.length > 0 && (
                <span className="text-[10px] font-mono text-neutral-600">
                  {text.length} chars
                </span>
              )}

              <span className="hidden md:flex items-center text-[10px] font-mono text-neutral-600 space-x-0.5 select-none">
                <span>Enter to submit</span>
                <CornerDownLeft className="w-2.5 h-2.5" />
              </span>

              {isGenerating ? (
                <StopButton />
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`p-2 rounded transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    text.trim()
                      ? 'bg-neutral-200 hover:bg-white text-black hover:scale-101'
                      : 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-850'
                  }`}
                  title="Submit"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
