'use client';

import { useState, useCallback } from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { sendChatMessage } from '@/lib/api/chat';
import { useLandmarks } from '@/hooks/useLandmarks';
import type { ChatMessage } from '@/types/chat';

export default function ChatPage() {
  const { landmarks } = useLandmarks();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Prepare landmark context
        const landmarkContext = landmarks.map((l) => l.id);

        const response = await sendChatMessage(content, {
          landmarks: landmarkContext,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send message');
        setError(error);
        console.error('Chat error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [landmarks, messages]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat About Landmarks</h1>
      <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
