import { useState, useEffect, useCallback } from 'react';

const ENERGY_STORAGE_KEY = 'keralty_energy';
const SCORE_STORAGE_KEY = 'keralty_score';
const MAX_ENERGY = 100;
const INITIAL_ENERGY = 60;

interface EnergyData {
  energy: number;
  score: number;
  lastUpdate: number;
}

export function useEnergy() {
  const [energy, setEnergy] = useState(INITIAL_ENERGY);
  const [score, setScore] = useState(0);
  const [maxEnergy] = useState(MAX_ENERGY);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEnergy = localStorage.getItem(ENERGY_STORAGE_KEY);
      const storedScore = localStorage.getItem(SCORE_STORAGE_KEY);
      
      if (storedEnergy) {
        const parsedEnergy = parseInt(storedEnergy, 10);
        if (!isNaN(parsedEnergy)) {
          setEnergy(Math.min(Math.max(parsedEnergy, 0), MAX_ENERGY));
        }
      }
      
      if (storedScore) {
        const parsedScore = parseInt(storedScore, 10);
        if (!isNaN(parsedScore)) {
          setScore(Math.max(parsedScore, 0));
        }
      }
    }
  }, []);

  // Save to localStorage whenever energy or score changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ENERGY_STORAGE_KEY, energy.toString());
      localStorage.setItem(SCORE_STORAGE_KEY, score.toString());
    }
  }, [energy, score]);

  const increaseEnergy = useCallback((amount: number, scoreIncrease: number = 0) => {
    setEnergy((prev) => Math.min(prev + amount, MAX_ENERGY));
    if (scoreIncrease > 0) {
      setScore((prev) => prev + scoreIncrease);
    }
  }, []);

  const decreaseEnergy = useCallback((amount: number) => {
    setEnergy((prev) => Math.max(prev - amount, 0));
  }, []);

  const resetEnergy = useCallback(() => {
    setEnergy(INITIAL_ENERGY);
    setScore(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ENERGY_STORAGE_KEY);
      localStorage.removeItem(SCORE_STORAGE_KEY);
    }
  }, []);

  // Calculate energy percentage
  const energyPercentage = Math.round((energy / maxEnergy) * 100);

  return {
    energy,
    maxEnergy,
    score,
    energyPercentage,
    increaseEnergy,
    decreaseEnergy,
    resetEnergy,
  };
}

