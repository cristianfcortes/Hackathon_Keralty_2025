'use client';

import { useMemo } from 'react';

interface EnergyBarProps {
  currentEnergy: number;
  maxEnergy: number;
  score: number;
}

export default function EnergyBar({ currentEnergy, maxEnergy, score }: EnergyBarProps) {
  // Calculate how many hearts to show (out of 5)
  const maxHearts = 5;
  const filledHearts = useMemo(() => {
    const percentage = currentEnergy / maxEnergy;
    return Math.ceil(percentage * maxHearts);
  }, [currentEnergy, maxEnergy]);

  // Determine energy level color
  const energyColor = useMemo(() => {
    const percentage = (currentEnergy / maxEnergy) * 100;
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  }, [currentEnergy, maxEnergy]);

  // Determine if energy is low (show animation)
  const isLowEnergy = (currentEnergy / maxEnergy) < 0.3;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 border-2 border-gray-200">
      {/* Hearts display */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex gap-1">
          {Array.from({ length: maxHearts }).map((_, index) => (
            <span
              key={index}
              className={`text-2xl transition-all duration-300 ${
                index < filledHearts 
                  ? 'scale-100 opacity-100' 
                  : 'scale-90 opacity-40 grayscale'
              } ${isLowEnergy && index < filledHearts ? 'animate-pulse' : ''}`}
            >
              {index < filledHearts ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Energy stats */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Energía:</span>
          <span className={`font-bold ${energyColor} transition-colors`}>
            {currentEnergy}/{maxEnergy}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Puntos:</span>
          <span className="font-bold text-blue-600">
            {score}
          </span>
        </div>
      </div>

      {/* Energy bar */}
      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            currentEnergy > 70 ? 'bg-green-500' :
            currentEnergy > 40 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${(currentEnergy / maxEnergy) * 100}%` }}
        />
      </div>

      {/* Low energy warning */}
      {isLowEnergy && (
        <div className="mt-2 text-xs text-red-600 font-medium animate-pulse">
          ⚠️ ¡Energía baja! Visita más lugares
        </div>
      )}
    </div>
  );
}

