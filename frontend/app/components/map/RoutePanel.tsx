'use client';

import { useState } from 'react';
import type { RoutePanelProps } from '@/types/routing';
import { TRANSPORT_MODES, isRoutingError } from '@/types/routing';
import { formatDistance, formatDuration } from '@/lib/routing/osrm';

/**
 * Panel component that displays route information and instructions
 * 
 * Features:
 * - Transport mode selector
 * - Route summary (distance & duration)
 * - Turn-by-turn instructions
 * - Open in native maps button
 * - Expandable/collapsible view
 * - Loading and error states
 */
export default function RoutePanel({
  route,
  loading,
  error,
  currentMode,
  onModeChange,
  onClose,
  onOpenInMaps,
}: RoutePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't render if no route and no loading/error
  if (!route && !loading && !error) {
    return null;
  }

  return (
    <div
      className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-in-left"
      role="complementary"
      aria-label="Panel de información de ruta"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🗺️
          </span>
          <h2 className="text-lg font-semibold text-gray-800">Ruta</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label="Cerrar panel de ruta"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Transport Mode Selector */}
      <div className="p-4 border-b border-gray-200">
        <div
          className="flex gap-2"
          role="group"
          aria-label="Seleccionar modo de transporte"
        >
          {TRANSPORT_MODES.map((mode) => (
            <button
              key={mode.mode}
              onClick={() => onModeChange(mode.mode)}
              disabled={loading}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentMode === mode.mode
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400'
              }`}
              aria-pressed={currentMode === mode.mode}
              aria-label={`Calcular ruta ${mode.label.toLowerCase()}`}
            >
              <span className="text-xl mr-1" aria-hidden="true">
                {mode.icon}
              </span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 text-sm">Calculando ruta...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error al calcular ruta
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {isRoutingError(error) ? error.message : 'Error desconocido'}
              </p>
              {isRoutingError(error) && error.retryable && (
                <button
                  onClick={onClose}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Route Content */}
      {route && !loading && (
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Route Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDistance(route.distance)}
                  </div>
                  <div className="text-xs text-gray-600">Distancia</div>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDuration(route.duration)}
                  </div>
                  <div className="text-xs text-gray-600">Duración</div>
                </div>
              </div>
            </div>

            {/* Open in Maps Button */}
            <button
              onClick={onOpenInMaps}
              className="w-full mt-2 py-2 px-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              aria-label="Abrir en aplicación de mapas"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>Abrir en Mapas</span>
            </button>
          </div>

          {/* Expand/Collapse Instructions */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isExpanded}
            aria-controls="route-instructions"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Instrucciones paso a paso
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Step-by-Step Instructions */}
          {isExpanded && (
            <div
              id="route-instructions"
              className="divide-y divide-gray-100"
              role="list"
              aria-label="Instrucciones de navegación"
            >
              {route.steps.map((step, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  role="listitem"
                >
                  <div className="flex gap-3">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {step.instruction}
                      </p>
                      {step.name && step.name !== 'Carretera sin nombre' && (
                        <p className="text-sm text-gray-600 mb-1">
                          {step.name}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          {formatDistance(step.distance)}
                        </span>
                        {step.duration > 60 && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {formatDuration(step.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

