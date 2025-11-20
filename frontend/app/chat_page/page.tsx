'use client';

import ChatInterface from '../components/chat/ChatInterface';
import { useKeryChat } from '@/hooks/useKeryChat';

export default function ChatPage() {
  const { messages, isLoading, sendMessage } = useKeryChat();

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
              <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Chat con Kery</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <p className="text-gray-600 text-sm">En línea • Listo para ayudarte</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl flex-1 flex flex-col overflow-hidden border border-gray-200">
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          error={null}
        />
      </div>
      {/* Footer info */}
      <div className="mt-3 text-center text-xs text-gray-500">
        <p>💬 Kery utiliza inteligencia artificial para brindarte respuestas personalizadas</p>
      </div>
    </div>
  );
}
