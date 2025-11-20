'use client';

import { useState } from 'react';
import ProfessionalList from '../components/directory/ProfessionalList';
import professionalsData from '@/data/professionals.json';
import type { MedicalProfessional } from '@/types/professional';

export default function DirectoryPage() {
  const [professionals] = useState<MedicalProfessional[]>(
    professionalsData as MedicalProfessional[]
  );
  const [selectedProfessional, setSelectedProfessional] = useState<MedicalProfessional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessionals = professionals.filter((prof) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      prof.name.toLowerCase().includes(term) ||
      prof.specialty.toLowerCase().includes(term) ||
      prof.organization?.toLowerCase().includes(term) ||
      false
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Directorio de Profesionales Médicos</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar profesionales..."
          className="w-full md:w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Buscar profesionales médicos"
        />
      </div>

      <ProfessionalList
        professionals={filteredProfessionals}
        onSelect={setSelectedProfessional}
      />

      {selectedProfessional && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedProfessional(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="professional-details-title"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="professional-details-title" className="text-2xl font-bold mb-4">
              {selectedProfessional.title} {selectedProfessional.name}
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">{selectedProfessional.specialty}</p>
              {selectedProfessional.organization && (
                <p className="text-gray-600">{selectedProfessional.organization}</p>
              )}
              {selectedProfessional.bio && <p className="text-gray-700">{selectedProfessional.bio}</p>}
              <div>
                <h3 className="font-semibold mb-2">Información de Contacto</h3>
                {selectedProfessional.contact.email && (
                  <p>
                    <span className="font-semibold">Email:</span>{' '}
                    <a
                      href={`mailto:${selectedProfessional.contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedProfessional.contact.email}
                    </a>
                  </p>
                )}
                {selectedProfessional.contact.phone && (
                  <p>
                    <span className="font-semibold">Teléfono:</span>{' '}
                    <a
                      href={`tel:${selectedProfessional.contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedProfessional.contact.phone}
                    </a>
                  </p>
                )}
                {selectedProfessional.contact.address && (
                  <p>
                    <span className="font-semibold">Dirección:</span>{' '}
                    {selectedProfessional.contact.address}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedProfessional(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cerrar detalles del profesional"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

