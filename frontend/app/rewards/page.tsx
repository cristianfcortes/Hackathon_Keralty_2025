'use client';

import { useEffect } from 'react';
import { useRewards } from '@/hooks/useRewards';
import EnergyBar from '@/app/components/energy/EnergyBar';
import MoodEvaluation from '@/app/components/rewards/MoodEvaluation';
import MedalDisplay from '@/app/components/rewards/MedalDisplay';
import HealthyHabitsList from '@/app/components/rewards/HealthyHabitsList';

export default function RewardsPage() {
  const {
    rewards,
    loading,
    updateMood,
    toggleHabit,
    getTodaysMood,
  } = useRewards();

  const todaysMood = getTodaysMood();

  // Check if we need to reset habits (new day)
  useEffect(() => {
    const lastCheck = localStorage.getItem('last_habit_check');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastCheck !== today) {
      localStorage.setItem('last_habit_check', today);
      // Note: We could call resetDailyHabits() here if we want to auto-reset
      // For now, habits persist until manually toggled
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Cargando recompensas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            🎁 Mis Recompensas
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Sigue tu progreso y mantén tu bienestar
          </p>
        </div>

        {/* Energy Bar - Fixed at top */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <EnergyBar
              currentEnergy={rewards.currentEnergy}
              maxEnergy={rewards.maxEnergy}
              score={rewards.totalScore}
            />
          </div>
        </div>

        {/* Main content grid */}
        <div className="space-y-8">
          {/* Mood Evaluation */}
          <div className="animate-fade-in">
            <MoodEvaluation
              currentMood={todaysMood?.mood}
              onMoodSelect={updateMood}
            />
          </div>

          {/* Two column layout for desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Medals */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <MedalDisplay medals={rewards.medals} />
            </div>

            {/* Right column - Healthy Habits */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <HealthyHabitsList
                habits={rewards.habits}
                onToggleHabit={toggleHabit}
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-purple-200 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {rewards.totalEnergy}
            </p>
            <p className="text-sm text-gray-600 font-medium">Energía Total Acumulada</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-blue-200 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {rewards.totalScore}
            </p>
            <p className="text-sm text-gray-600 font-medium">Puntos Totales</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-green-200 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {Math.max(...rewards.habits.map(h => h.streak || 0), 0)}
            </p>
            <p className="text-sm text-gray-600 font-medium">Mejor Racha (días)</p>
          </div>
        </div>

        {/* Motivational quote */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-2xl mx-auto">
            <p className="text-lg font-semibold text-gray-700 italic mb-2">
              &ldquo;El cuidado de tu salud es una inversión, no un gasto.&rdquo;
            </p>
            <p className="text-sm text-gray-600">
              Cada pequeño hábito saludable cuenta para tu bienestar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

