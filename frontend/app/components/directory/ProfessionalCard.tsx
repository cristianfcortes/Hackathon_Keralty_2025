'use client';

import { useState } from 'react';
import type { MedicalProfessional } from '@/types/professional';
import { handleActivation } from '@/lib/accessibility/keyboard';

interface ProfessionalCardProps {
  professional: MedicalProfessional;
  onClick?: () => void;
}

export default function ProfessionalCard({ professional, onClick }: ProfessionalCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick) {
      handleActivation(e.nativeEvent, onClick);
    } else {
      handleActivation(e.nativeEvent, () => setShowDetails(!showDetails));
    }
  };

  return (
    <div
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick || (() => setShowDetails(!showDetails))}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${professional.title} ${professional.name}, ${professional.specialty}`}
    >
      <h3 className="font-semibold text-lg">
        {professional.title} {professional.name}
      </h3>
      <p className="text-gray-600">{professional.specialty}</p>
      {professional.organization && (
        <p className="text-sm text-gray-500 mt-1">{professional.organization}</p>
      )}

      {showDetails && (
        <div className="mt-4 space-y-2 text-sm">
          {professional.contact.email && (
            <p>
              <span className="font-semibold">Email:</span>{' '}
              <a
                href={`mailto:${professional.contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {professional.contact.email}
              </a>
            </p>
          )}
          {professional.contact.phone && (
            <p>
              <span className="font-semibold">Phone:</span>{' '}
              <a
                href={`tel:${professional.contact.phone}`}
                className="text-blue-600 hover:underline"
              >
                {professional.contact.phone}
              </a>
            </p>
          )}
          {professional.languages && professional.languages.length > 0 && (
            <p>
              <span className="font-semibold">Languages:</span>{' '}
              {professional.languages.join(', ')}
            </p>
          )}
          {professional.accessibilityServices && (
            <div>
              <span className="font-semibold">Accessibility:</span>
              <ul className="list-disc list-inside ml-2">
                {professional.accessibilityServices.signLanguage && <li>Sign language</li>}
                {professional.accessibilityServices.wheelchairAccessible && (
                  <li>Wheelchair accessible</li>
                )}
                {professional.accessibilityServices.hearingAssistance && (
                  <li>Hearing assistance</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

