'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { getAriaProps } from '@/lib/accessibility/aria';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  error = null,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  const chatAriaProps = getAriaProps({
    label: 'Chat interface for asking questions about landmarks',
    role: 'log',
    live: 'polite',
    atomic: false,
  });

  return (
    <div className="flex flex-col h-full" {...chatAriaProps}>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation by asking about landmarks!</p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3">
              <p className="text-gray-600">Thinking...</p>
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            aria-live="assertive"
          >
            <p>{error.message}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about landmarks..."
            className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            aria-label="Message input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

