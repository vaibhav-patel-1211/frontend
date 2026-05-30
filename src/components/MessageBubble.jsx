import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import ImageCard from './ImageCard';
import { motion } from 'framer-motion';

// Custom Markdown Parser to render semantic styles
function parseMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentBlock = null; 
  let codeLang = '';
  let accumulator = [];

  const flushBlock = (key) => {
    if (!currentBlock || accumulator.length === 0) return;

    if (currentBlock === 'code') {
      const codeText = accumulator.join('\n');
      elements.push(
        <CodeBlock key={key} language={codeLang} code={codeText} />
      );
    } else if (currentBlock === 'quote') {
      elements.push(
        <blockquote key={key} className="border-l-2 border-neutral-600 pl-4 py-0.5 my-3 text-neutral-400 italic">
          {accumulator.map((line, idx) => (
            <p key={idx}>{parseInlineStyles(line.substring(2))}</p>
          ))}
        </blockquote>
      );
    } else if (currentBlock === 'list') {
      elements.push(
        <ul key={key} className="list-disc pl-5 mb-3 space-y-1 text-neutral-300">
          {accumulator.map((item, idx) => (
            <li key={idx}>{parseInlineStyles(item)}</li>
          ))}
        </ul>
      );
    } else if (currentBlock === 'num-list') {
      elements.push(
        <ol key={key} className="list-decimal pl-5 mb-3 space-y-1 text-neutral-300">
          {accumulator.map((item, idx) => (
            <li key={idx}>{parseInlineStyles(item)}</li>
          ))}
        </ol>
      );
    } else if (currentBlock === 'table') {
      elements.push(
        <TableBlock key={key} rows={accumulator} />
      );
    }
    accumulator = [];
    currentBlock = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (currentBlock === 'code') {
        flushBlock(`block_${i}`);
      } else {
        flushBlock(`block_${i}_pre`);
        currentBlock = 'code';
        codeLang = line.trim().substring(3) || 'javascript';
      }
      continue;
    }

    if (currentBlock === 'code') {
      accumulator.push(line);
      continue;
    }

    if (line.startsWith('>')) {
      if (currentBlock !== 'quote') {
        flushBlock(`block_${i}`);
        currentBlock = 'quote';
      }
      accumulator.push(line);
      continue;
    }

    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      if (currentBlock !== 'list') {
        flushBlock(`block_${i}`);
        currentBlock = 'list';
      }
      accumulator.push(line.trim().substring(2));
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      if (currentBlock !== 'num-list') {
        flushBlock(`block_${i}`);
        currentBlock = 'num-list';
      }
      const match = line.trim().match(/^\d+\.\s(.*)/);
      accumulator.push(match ? match[1] : line.trim());
      continue;
    }

    if (line.trim().startsWith('|')) {
      if (currentBlock !== 'table') {
        flushBlock(`block_${i}`);
        currentBlock = 'table';
      }
      accumulator.push(line);
      continue;
    }

    if (currentBlock) {
      if (currentBlock === 'table' && line.trim().includes('---')) {
        continue;
      }
      flushBlock(`block_${i}`);
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1_${i}`} className="text-lg md:text-xl font-medium text-neutral-100 mt-5 mb-2.5 tracking-tight">{parseInlineStyles(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2_${i}`} className="text-base md:text-lg font-medium text-neutral-200 mt-4 mb-2 tracking-tight">{parseInlineStyles(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3_${i}`} className="text-sm md:text-base font-medium text-neutral-300 mt-3 mb-1.5">{parseInlineStyles(line.substring(4))}</h3>);
    } else if (line.trim() === '') {
      elements.push(<div key={`br_${i}`} className="h-2" />);
    } else {
      elements.push(<p key={`p_${i}`} className="mb-3 text-[14px] leading-relaxed text-neutral-300">{parseInlineStyles(line)}</p>);
    }
  }

  flushBlock('final_block');
  return elements;
}

function parseInlineStyles(text) {
  if (!text) return '';

  let tokens = [{ type: 'text', text }];

  const boldRegex = /\*\*(.*?)\*\?/g; // Wait, correct bold regex is /\*\*(.*?)\*\*/g
  const boldRegexFixed = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const codeRegex = /`(.*?)`/g;

  const processTokens = (regex, type) => {
    let newTokens = [];
    for (let token of tokens) {
      if (token.type !== 'text') {
        newTokens.push(token);
        continue;
      }

      let lastIndex = 0;
      let match;
      regex.lastIndex = 0;

      while ((match = regex.exec(token.text)) !== null) {
        if (match.index > lastIndex) {
          newTokens.push({ type: 'text', text: token.text.substring(lastIndex, match.index) });
        }
        newTokens.push({ type, text: match[1] });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < token.text.length) {
        newTokens.push({ type: 'text', text: token.text.substring(lastIndex) });
      }
    }
    tokens = newTokens;
  };

  processTokens(codeRegex, 'code');
  processTokens(boldRegexFixed, 'bold');
  processTokens(italicRegex, 'italic');

  return tokens.map((t, idx) => {
    if (t.type === 'bold') {
      return <strong key={idx} className="font-semibold text-neutral-100">{t.text}</strong>;
    }
    if (t.type === 'italic') {
      return <em key={idx} className="italic text-neutral-300">{t.text}</em>;
    }
    if (t.type === 'code') {
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[12.5px] border border-neutral-700/35">{t.text}</code>;
    }
    return t.text;
  });
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-neutral-800/80 bg-[#0c0c0e] text-neutral-300 font-mono text-sm max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-850/80 text-[11px] font-sans text-neutral-400">
        <span className="uppercase tracking-wider font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <span>Copy</span>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed scrollbar-thin">
        <code className="text-xs md:text-[13px] block text-neutral-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

function TableBlock({ rows }) {
  if (rows.length === 0) return null;

  const parseRow = (rowStr) => {
    return rowStr
      .split('|')
      .map(cell => cell.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  };

  const headers = parseRow(rows[0]);
  const dataRows = rows.slice(1).map(row => parseRow(row));

  return (
    <div className="my-4 overflow-x-auto border border-neutral-800 rounded-xl max-w-full">
      <table className="min-w-full border-collapse text-left text-[13px]">
        <thead className="bg-[#0e0e11] border-b border-neutral-800">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 font-medium text-neutral-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900">
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-neutral-900/20">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5 text-neutral-350">
                  {parseInlineStyles(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MessageBubble({ message }) {
  const { role, content, timestamp, isStreaming, isGeneratingImage, imageUrl, id, citations } = message;
  const { regenerateResponse } = useChatStore();
  const streamingContent = useChatStore((s) => s.streamingMessageId === id ? s.streamingContent : null);
  const [copied, setCopied] = useState(false);

  const isAssistant = role === 'assistant';
  const displayContent = streamingContent !== null ? streamingContent : content;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex w-full mb-8 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div className="w-full max-w-3xl">
        <div className="flex flex-col">
          {/* Subtle Monospaced Name Tag for Assistant */}
          {isAssistant && (
            <div className="flex items-center space-x-2 mb-2 select-none">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                THEOLOGIA
              </span>
              <span className="text-[9px] text-neutral-600 font-mono">
                System
              </span>
            </div>
          )}

          {isAssistant ? (
            /* ASSISTANT COMPACT BLOCK */
            <div className="group relative pr-4">
              {isGeneratingImage || imageUrl ? (
                <ImageCard message={message} />
              ) : (
                <>
                  <div className="markdown-content text-neutral-300">
                    {streamingContent !== null ? (
                      <span style={{ whiteSpace: 'pre-wrap' }}>{displayContent}<span className="typing-cursor" /></span>
                    ) : (
                      parseMarkdown(displayContent)
                    )}
                    {isStreaming && streamingContent === null && <span className="typing-cursor" />}
                  </div>
                  {!isStreaming && citations && citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-neutral-800/50">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Citations</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {citations.map((cite, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[11px] font-mono rounded bg-neutral-800/80 text-neutral-400 border border-neutral-700/40">
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Minimal inline tools */}
              {!isStreaming && !isGeneratingImage && (
                <div className="flex items-center space-x-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-1">
                  <button
                    onClick={handleCopyMessage}
                    className="p-1.5 rounded hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer focus:outline-none"
                    title={copied ? "Copied" : "Copy Message"}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => regenerateResponse(id)}
                    className="p-1.5 rounded hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer focus:outline-none"
                    title="Regenerate Response"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* USER MONOCHROME CARD */
            <div className="flex flex-col items-end">
              <div className="px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-[14px] leading-relaxed shadow-sm">
                {content}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
