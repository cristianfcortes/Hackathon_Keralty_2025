'use client';

import { useState } from 'react';
import type { MoodLevel } from '@/types/rewards';

interface MoodEvaluationProps {
  currentMood?: MoodLevel;
  onMoodSelect: (mood: MoodLevel, notes?: string) => void;
}

const moods: { level: MoodLevel; emoji: string; label: string; color: string }[] = [
  { level: 'excellent', emoji: '😄', label: 'Excelente', color: 'bg-green-500 hover:bg-green-600' },
  { level: 'good', emoji: '😊', label: 'Bien', color: 'bg-lime-500 hover:bg-lime-600' },
  { level: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { level: 'low', emoji: '😔', label: 'Bajo', color: 'bg-orange-500 hover:bg-orange-600' },
  { level: 'poor', emoji: '😢', label: 'Mal', color: 'bg-red-500 hover:bg-red-600' },
];

export default function MoodEvaluation({ currentMood, onMoodSelect }: MoodEvaluationProps) {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | undefined>(currentMood);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleMoodClick = (mood: MoodLevel) => {
    setSelectedMood(mood);
    setShowNotes(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, notes || undefined);
      setShowNotes(false);
      setNotes('');
    }
  };

  const getMoodMessage = (mood?: MoodLevel) => {
    if (!mood) return '¿Cómo te sientes hoy?';
    
    switch (mood) {
      case 'excellent':
        return '¡Fantástico! Tu energía está en su punto máximo 🌟';
      case 'good':
        return '¡Muy bien! Sigue así 👍';
      case 'neutral':
        return 'Un día normal, pero podemos mejorar 💪';
      case 'low':
        return 'Quizás necesites un descanso o una actividad relajante 🌿';
      case 'poor':
        return 'Tómate tu tiempo. Está bien no estar bien siempre 💙';
      default:
        return '¿Cómo te sientes hoy?';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🌈</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Estado de Ánimo</h2>
          <p className="text-sm text-gray-600">¿Cómo te sientes hoy?</p>
        </div>
      </div>

      {/* Mood message */}
      <div className="mb-6 p-4 bg-white/70 rounded-lg">
        <p className="text-center text-lg font-medium text-gray-700">
          {getMoodMessage(selectedMood)}
        </p>
      </div>

      {/* Mood selector */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => handleMoodClick(mood.level)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl
              transition-all duration-300 transform hover:scale-110
              ${selectedMood === mood.level 
                ? `${mood.color} ring-4 ring-purple-400 scale-110 shadow-lg` 
                : 'bg-white hover:shadow-md'
              }
              focus:outline-none focus:ring-4 focus:ring-purple-300
            `}
            aria-label={`Seleccionar estado de ánimo: ${mood.label}`}
            aria-pressed={selectedMood === mood.level}
          >
            <span className={`text-4xl mb-2 ${selectedMood === mood.level ? 'animate-bounce' : ''}`}>
              {mood.emoji}
            </span>
            <span className={`text-xs font-semibold ${
              selectedMood === mood.level ? 'text-white' : 'text-gray-700'
            }`}>
              {mood.label}
            </span>
            
            {/* Checkmark for selected */}
            {selectedMood === mood.level && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Notes section */}
      {showNotes && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="mood-notes" className="block text-sm font-medium text-gray-700 mb-2">
              ¿Quieres agregar algo más? (opcional)
            </label>
            <textarea
              id="mood-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe cómo te sientes o qué ha influido en tu estado de ánimo..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Guardar Estado de Ánimo
            </button>
            <button
              onClick={() => {
                setShowNotes(false);
                setSelectedMood(currentMood);
                setNotes('');
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Current mood display (when already set) */}
      {!showNotes && selectedMood && (
        <button
          onClick={() => setShowNotes(true)}
          className="w-full py-3 text-sm text-purple-600 hover:text-purple-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
        >
          Actualizar mi estado de ánimo
        </button>
      )}
    </div>
  );
}

