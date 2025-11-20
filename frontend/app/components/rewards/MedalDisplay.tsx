'use client';

import type { Medal } from '@/types/rewards';

interface MedalDisplayProps {
  medals: Medal[];
}

export default function MedalDisplay({ medals }: MedalDisplayProps) {
  const earnedMedals = medals.filter(m => m.earnedAt);
  const inProgressMedals = medals.filter(m => !m.earnedAt);

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏅</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Medallas</h2>
            <p className="text-sm text-gray-600">
              {earnedMedals.length} de {medals.length} desbloqueadas
            </p>
          </div>
        </div>
        
        {/* Progress ring */}
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90" width="64" height="64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#FEF3C7"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#F59E0B"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(earnedMedals.length / medals.length) * 175.93} 175.93`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-700">
              {Math.round((earnedMedals.length / medals.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Earned Medals */}
      {earnedMedals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-xl">✨</span>
            Medallas Ganadas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {earnedMedals.map((medal) => (
              <div
                key={medal.id}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300"
              >
                <div className="text-center">
                  <div className="text-5xl mb-2 animate-bounce">
                    {medal.icon}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">
                    {medal.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {medal.description}
                  </p>
                  {medal.earnedAt && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Desbloqueada
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Medals */}
      {inProgressMedals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            En Progreso
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inProgressMedals.map((medal) => {
              const progress = medal.progress || 0;
              const requirement = medal.requirement || 100;
              const percentage = Math.min((progress / requirement) * 100, 100);

              return (
                <div
                  key={medal.id}
                  className="bg-white/70 rounded-xl p-4 shadow border-2 border-gray-200 hover:border-yellow-300 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl opacity-50 grayscale">
                      {medal.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 text-sm">
                        {medal.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {medal.description}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{progress} / {requirement}</span>
                          <span className="font-semibold">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {earnedMedals.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4 opacity-50">🏆</div>
          <p className="text-gray-600 font-medium mb-2">
            ¡Aún no has ganado medallas!
          </p>
          <p className="text-sm text-gray-500">
            Completa hábitos saludables y visita lugares para desbloquearlas
          </p>
        </div>
      )}
    </div>
  );
}

