'use client';

import type { MedicalProfessional } from '@/types/professional';
import ProfessionalCard from './ProfessionalCard';
import { getAriaProps } from '@/lib/accessibility/aria';

interface ProfessionalListProps {
  professionals: MedicalProfessional[];
  onSelect?: (professional: MedicalProfessional) => void;
}

export default function ProfessionalList({
  professionals,
  onSelect,
}: ProfessionalListProps) {
  const listAriaProps = getAriaProps({
    label: 'Medical professionals directory',
    role: 'list',
  });

  if (professionals.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-gray-500">No professionals found.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" {...listAriaProps}>
      {professionals.map((professional) => (
        <li key={professional.id}>
          <ProfessionalCard
            professional={professional}
            onClick={() => onSelect?.(professional)}
          />
        </li>
      ))}
    </ul>
  );
}

