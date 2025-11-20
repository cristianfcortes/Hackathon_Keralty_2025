'use client';

import { useEffect } from 'react';
import type { Landmark } from '@/types/landmark';
import FocusTrap from '../accessibility/FocusTrap';
import { handleEscape } from '@/lib/accessibility/keyboard';
import { getAriaProps } from '@/lib/accessibility/aria';

interface LandmarkModalProps {
  landmark: Landmark | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAttendance: (landmarkId: string) => void;
  hasConfirmed?: boolean;
}

export default function LandmarkModal({
  landmark,
  isOpen,
  onClose,
  onConfirmAttendance,
  hasConfirmed = false,
}: LandmarkModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
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

