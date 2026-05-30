import React, { useState } from 'react';
import { Download, Maximize2, RotateCcw, Copy, Check, X, Loader } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageCard({ message }) {
  const { isGeneratingImage, imageProgress, imageUrl, imagePrompt, id } = message;
  const { regenerateResponse } = useChatStore();
  
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(imagePrompt || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logos-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="my-4 w-full max-w-lg">
      <AnimatePresence mode="wait">
        {isGeneratingImage ? (
          /* MINIMALIST MONOCHROME SKELETON CARD */
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#0c0c0e] border border-neutral-800/80 flex flex-col items-center justify-center p-6"
          >
            {/* Dark background loading pulse */}
            <div className="absolute inset-0 shimmer-bg opacity-30" />
            
            <div className="z-10 flex flex-col items-center text-center space-y-4 w-full max-w-xs">
              <Loader className="w-5 h-5 text-neutral-500 animate-spin" />
              <div>
                <h4 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  GENERATING ARTWORK
                </h4>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1 italic max-w-[240px] mx-auto">
                  "{imagePrompt}"
                </p>
              </div>

              {/* Progress bar container */}
              <div className="w-40 bg-neutral-900 h-1 rounded-full overflow-hidden relative">
                <motion.div
                  className="bg-neutral-400 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${imageProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                {imageProgress}%
              </span>
            </div>
          </motion.div>
        ) : (
          /* FINAL GENERATED IMAGE */
          <motion.div
            key="resolved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative aspect-video w-full rounded-xl overflow-hidden border border-neutral-800/60 bg-[#0c0c0e]"
          >
            <img
              src={imageUrl}
              alt={imagePrompt || 'Generated Artwork'}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Subtle bottom shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

            {/* Image Overlay Tools */}
            <div className="absolute inset-0 flex flex-col justify-between p-3.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <div className="flex justify-start">
                <span className="px-2 py-1 text-[10px] font-mono text-neutral-300 bg-neutral-900/80 backdrop-blur-md rounded border border-white/5 max-w-[280px] truncate">
                  {imagePrompt}
                </span>
              </div>

              {/* Action tools */}
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  onClick={handleCopyPrompt}
                  className="p-2 rounded bg-neutral-900/80 hover:bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Prompt"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => regenerateResponse(id)}
                  className="p-2 rounded bg-neutral-900/80 hover:bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Regenerate"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded bg-neutral-900/80 hover:bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded bg-[#09090b]/80 hover:bg-[#09090b] border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="p-2 rounded bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
              >
                <span className="text-xs font-mono">Download</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
              >
                <span className="text-xs font-mono">Close</span>
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              className="relative max-w-5xl max-h-[85vh] rounded-lg overflow-hidden border border-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt={imagePrompt}
                className="max-w-full max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <p className="text-neutral-300 text-xs font-mono text-center">
                  {imagePrompt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
