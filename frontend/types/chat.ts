export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  landmarkContext?: string[];
}

export interface ChatHistory {
  messages: ChatMessage[];
  sessionId: string;
}

