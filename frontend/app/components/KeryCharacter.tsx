'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface KeryCharacterProps {
  message?: string;
  typingSpeed?: number; // milliseconds per character
}

export default function KeryCharacter({ 
  message = '¡Hola! soy Kery, ¿Cómo puedo ayudarte hoy? Recuerda que puedes buscar la información sobre los activos en salud directamente en el mapa. ¡Estoy aquí para ayudarte!',
  typingSpeed = 30
}: KeryCharacterProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typing animation effect
  useEffect(() => {
    // Cleanup any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isVisible) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Reset and start typing animation
    setDisplayedText('');
    setIsTyping(true);

    const fullMessage = message;
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < fullMessage.length) {
        setDisplayedText(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
        timeoutRef.current = null;
      }
    };

    // Small delay before starting to type
    timeoutRef.current = setTimeout(() => {
      typeNextChar();
    }, 300);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isVisible, message, typingSpeed]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 flex items-end gap-3"
      role="complementary"
      aria-label="Kery character assistant"
    >
      {/* Kery GIF */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src="/kery.gif"
          alt="Kery character"
          width={96}
          height={96}
          className="object-contain"
          unoptimized
          priority={false}
        />
      </div>

      {/* Speech Bubble */}
      <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-xs animate-fade-in">
        {/* Speech bubble tail pointing to the character (left side) */}
        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-b border-gray-200"></div>
        
        <p className="text-sm text-gray-800 relative z-10 min-h-[1.5rem]">
          {displayedText}
          {isTyping && (
            <span 
              className="inline-block w-0.5 h-4 bg-gray-800 ml-1 animate-blink"
              aria-hidden="true"
            />
          )}
        </p>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Cerrar mensaje"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
}

