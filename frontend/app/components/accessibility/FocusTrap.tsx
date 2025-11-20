'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

export default function FocusTrap({ children, active = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) {
      return;
    }

    // Store the previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [active, onEscape]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
}

