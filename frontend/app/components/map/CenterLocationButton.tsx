'use client';

import { useCallback } from 'react';

interface CenterLocationButtonProps {
  onCenter: () => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  isCentered?: boolean;
}

export default function CenterLocationButton({
  onCenter,
  loading = false,
  disabled = false,
  error = null,
  isCentered = false,
}: CenterLocationButtonProps) {
  const handleClick = useCallback(() => {
    if (!disabled && !loading) {
      onCenter();
    }
  }, [onCenter, disabled, loading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
        e.preventDefault();
        onCenter();
      }
    },
    [onCenter, disabled, loading]
  );

  // Button state styling
  const getButtonStyle = () => {
    if (disabled || error) {
      return 'bg-gray-300 cursor-not-allowed opacity-50';
    }
    if (isCentered) {
      return 'bg-green-500 hover:bg-green-600 text-white shadow-lg';
    }
    return 'bg-white hover:bg-blue-50 text-gray-700 shadow-lg hover:shadow-xl';
  };

  // Icon based on state
  const renderIcon = () => {
    if (loading) {
      return (
        <svg
          className="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    }

    if (error) {
      return (
        <svg
          className="h-6 w-6 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }

    if (isCentered) {
      return (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }

    // Default target/location icon
    return (
      <svg
        className="h-6 w-6 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  };

  // Tooltip text
  const getTooltipText = () => {
    if (loading) return 'Obteniendo ubicación...';
    if (error) return 'Click para reintentar';
    if (isCentered) return 'Centrado en tu ubicación';
    if (disabled) return 'Ubicación no disponible';
    return 'Centrar en mi ubicación';
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className={`
          center-location-button
          rounded-full p-4 
          transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${getButtonStyle()}
        `}
        aria-label={getTooltipText()}
        aria-pressed={isCentered}
        aria-disabled={disabled || loading}
        title={getTooltipText()}
      >
        {renderIcon()}
      </button>

      {/* Tooltip */}
      <div
        className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
        role="tooltip"
      >
        {getTooltipText()}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}

