import { useState, useCallback, useEffect } from 'react';
import { getKeryResponse, getWelcomeMessage } from '@/lib/keryBot';
import type { ChatMessage } from '@/types/chat';

export function useKeryChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Show welcome message on initialization
  useEffect(() => {
    if (!hasShownWelcome) {
      const timer = setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: 'welcome-msg',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: Date.now(),
          isTyping: true,
        };
        setMessages([welcomeMessage]);
        setHasShownWelcome(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Get simulated bot response
    const botResponse = getKeryResponse(content);

    // Simulate thinking delay before responding
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: botResponse.message,
        timestamp: Date.now(),
        isTyping: true, // Enable typing animation
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, botResponse.delay);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHasShownWelcome(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
}

