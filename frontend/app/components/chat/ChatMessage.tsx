'use client';

import { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import TypingAnimation from './TypingAnimation';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [typingComplete, setTypingComplete] = useState(!message.isTyping);

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-label={`${message.role === 'user' ? 'Tú' : 'Kery'}: ${message.content}`}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            K
          </div>
        )}
        
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm">
            {message.isTyping && !typingComplete ? (
              <TypingAnimation 
                text={message.content} 
                speed={30}
                onComplete={() => setTypingComplete(true)}
              />
            ) : (
              message.content
            )}
          </p>
          {typingComplete && (
            <time
              className={`text-xs mt-1 block ${
                isUser ? 'text-blue-100' : 'text-gray-500'
              }`}
              dateTime={new Date(message.timestamp).toISOString()}
            >
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}

