export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  landmarkContext?: string[];
  isTyping?: boolean;
}

export interface ChatHistory {
  messages: ChatMessage[];
  sessionId: string;
}

