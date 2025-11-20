'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import QuickQuestions from './QuickQuestions';
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

  const handleQuickQuestion = async (question: string) => {
    setInputValue(question);
    await onSendMessage(question);
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
    label: 'Interfaz de chat para hacer preguntas sobre lugares y servicios',
    role: 'log',
    live: 'polite',
    atomic: false,
  });

  // Show quick questions only when there's just the welcome message
  const showQuickQuestions = messages.length === 1 && messages[0].id === 'welcome-msg';

  return (
    <div className="flex flex-col h-full" {...chatAriaProps}>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-lg font-medium">Esperando a Kery...</p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start items-start gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <div className="bg-gray-200 rounded-lg rounded-bl-none px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
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

      <QuickQuestions 
        onSelectQuestion={handleQuickQuestion}
        isVisible={showQuickQuestions}
      />

      <form onSubmit={handleSubmit} className="border-t bg-gray-50 p-4">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta para Kery..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={2}
            aria-label="Campo de entrada de mensaje"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-md hover:shadow-lg disabled:shadow-none"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Enviar</span>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </form>
    </div>
  );
}

