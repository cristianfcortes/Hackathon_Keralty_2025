import { useState } from "react";

export interface Message {
  text: string;
  type: "user" | "gpt";
}

interface UseChatProps {
  endpoint: string;
}

export function useChat({ endpoint }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Mensaje del usuario
    const userMessage: Message = { text, type: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    try {
      // GET con parámetro en la URL
      const url = `${endpoint}?prompt=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      // Suponiendo que tu endpoint devuelve { text: "respuesta de GPT" }
      const gptMessage: Message = { text: data.text, type: "gpt" };
      setMessages((prev) => [...prev, gptMessage]);
    } catch (err) {
      const errorMessage: Message = { text: "Error al obtener respuesta", type: "gpt" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
}
