'use client';

import { useEffect, useState } from 'react';
import type { Landmark } from '@/types/landmark';
import FocusTrap from '../accessibility/FocusTrap';
import { handleEscape } from '@/lib/accessibility/keyboard';
import { getAriaProps } from '@/lib/accessibility/aria';
import type { Route, TransportMode } from '@/types/routing';
import { TRANSPORT_MODES, isRoutingError } from '@/types/routing';
import { formatDistance, formatDuration } from '@/lib/routing/osrm';

interface LandmarkModalProps {
  landmark: Landmark | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAttendance: (landmarkId: string) => void;
  hasConfirmed?: boolean;
  route?: Route | null;
  routeLoading?: boolean;
  routeError?: Error | null;
  currentMode?: TransportMode;
  onModeChange?: (mode: TransportMode) => void;
  onOpenInMaps?: () => void;
}

export default function LandmarkModal({
  landmark,
  isOpen,
  onClose,
  onConfirmAttendance,
  hasConfirmed = false,
  route = null,
  routeLoading = false,
  routeError = null,
  currentMode = 'foot',
  onModeChange,
  onOpenInMaps,
}: LandmarkModalProps) {
  const [isRouteExpanded, setIsRouteExpanded] = useState(true);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleEscape(event.nativeEvent, onClose);
  };

  if (!isOpen || !landmark) {
    return null;
  }

  const modalAriaProps = getAriaProps({
    label: `Detalles de ${landmark.name}`,
    role: 'dialog',
  });

  return (
    <div
      className="modal__point fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
          onKeyDown={handleKeyDown}
          {...modalAriaProps}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 id="modal-title" className="text-2xl font-bold">
              {landmark.name}
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {landmark.description && (
              <p className="text-gray-700">{landmark.description}</p>
            )}

            {landmark.address && (
              <div>
                <h3 className="font-semibold mb-1">Dirección</h3>
                <p className="text-gray-600">{landmark.address}</p>
              </div>
            )}

            {landmark.category && (
              <div>
                <h3 className="font-semibold mb-1">Categoría</h3>
                <p className="text-gray-600 capitalize">{landmark.category}</p>
              </div>
            )}

            {landmark.accessibilityInfo && (
              <div>
                <h3 className="font-semibold mb-2">Información de Accesibilidad</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {landmark.accessibilityInfo.wheelchairAccessible && (
                    <li>Accesible en silla de ruedas</li>
                  )}
                  {landmark.accessibilityInfo.hearingAssistance && (
                    <li>Asistencia auditiva disponible</li>
                  )}
                  {landmark.accessibilityInfo.visualAssistance && (
                    <li>Asistencia visual disponible</li>
                  )}
                  {landmark.accessibilityInfo.notes && (
                    <li className="mt-2">{landmark.accessibilityInfo.notes}</li>
                  )}
                </ul>
              </div>
            )}

            {/* Sección de Ruta */}
            {(route || routeLoading || routeError) && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">🗺️</span>
                    Cómo llegar
                  </h3>
                </div>

                {/* Transport Mode Selector */}
                {onModeChange && (
                  <div className="mb-4">
                    <div
                      className="flex gap-2"
                      role="group"
                      aria-label="Seleccionar modo de transporte"
                    >
                      {TRANSPORT_MODES.map((mode) => (
                        <button
                          key={mode.mode}
                          onClick={() => onModeChange(mode.mode)}
                          disabled={routeLoading}
                          className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            currentMode === mode.mode
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400'
                          }`}
                          aria-pressed={currentMode === mode.mode}
                          aria-label={`Calcular ruta ${mode.label.toLowerCase()}`}
                        >
                          <span className="text-lg mr-1" aria-hidden="true">
                            {mode.icon}
                          </span>
                          <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {routeLoading && (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-gray-600 text-sm">Calculando ruta...</p>
                  </div>
                )}

                {/* Error State */}
                {routeError && !routeLoading && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-2">
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
                        <p className="text-sm text-red-700">
                          {isRoutingError(routeError) ? routeError.message : 'Error al calcular ruta'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Route Summary and Instructions */}
                {route && !routeLoading && (
                  <div>
                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">
                              {formatDistance(route.distance)}
                            </div>
                            <div className="text-xs text-gray-600">Distancia</div>
                          </div>
                          <div className="w-px h-10 bg-gray-300"></div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">
                              {formatDuration(route.duration)}
                            </div>
                            <div className="text-xs text-gray-600">Duración</div>
                          </div>
                        </div>
                      </div>

                      {/* Open in Maps Button */}
                      {onOpenInMaps && (
                        <button
                          onClick={onOpenInMaps}
                          className="w-full py-2 px-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 text-sm"
                          aria-label="Abrir en aplicación de mapas"
                        >
                          <svg
                            className="w-4 h-4"
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
                      )}
                    </div>

                    {/* Expand/Collapse Instructions */}
                    <button
                      onClick={() => setIsRouteExpanded(!isRouteExpanded)}
                      className="w-full p-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mb-2"
                      aria-expanded={isRouteExpanded}
                      aria-controls="route-instructions"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
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
                          isRouteExpanded ? 'rotate-180' : ''
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
                    {isRouteExpanded && (
                      <div
                        id="route-instructions"
                        className="max-h-64 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg"
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
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                                {index + 1}
                              </div>

                              {/* Step Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                  {step.instruction}
                                </p>
                                {step.name && step.name !== 'Carretera sin nombre' && (
                                  <p className="text-xs text-gray-600 mb-1">
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
            )}

            <div className="pt-4 border-t">
              <button
                onClick={() => onConfirmAttendance(landmark.id)}
                disabled={hasConfirmed}
                className={`w-full py-2 px-4 rounded font-semibold ${
                  hasConfirmed
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
                aria-label={hasConfirmed ? 'Asistencia ya confirmada' : 'Confirmar asistencia'}
              >
                {hasConfirmed ? 'Asistencia Confirmada' : 'Confirmar Asistencia'}
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}

