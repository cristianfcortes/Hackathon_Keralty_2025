'use client';

import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-label={`${message.role === 'user' ? 'You' : 'Assistant'}: ${message.content}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <time
          className={`text-xs mt-1 block ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
          dateTime={new Date(message.timestamp).toISOString()}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
}

