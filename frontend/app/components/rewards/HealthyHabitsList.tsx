'use client';

import type { HealthyHabit, HabitCategory } from '@/types/rewards';

interface HealthyHabitsListProps {
  habits: HealthyHabit[];
  onToggleHabit: (habitId: string) => void;
}

const categoryColors: Record<HabitCategory, { bg: string; border: string; text: string }> = {
  physical: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  mental: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  social: { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
  nutrition: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
};

const categoryLabels: Record<HabitCategory, string> = {
  physical: 'Físico',
  mental: 'Mental',
  social: 'Social',
  nutrition: 'Nutrición',
};

export default function HealthyHabitsList({ habits, onToggleHabit }: HealthyHabitsListProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const totalEnergy = habits.reduce((sum, h) => sum + (h.completed ? h.energyReward : 0), 0);

  // Group habits by category
  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<HabitCategory, HealthyHabit[]>);

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Hábitos Saludables</h2>
            <p className="text-sm text-gray-600">
              {completedCount} de {habits.length} completados hoy
            </p>
          </div>
        </div>
        
        {/* Energy earned today */}
        <div className="bg-white rounded-lg px-4 py-2 shadow-md">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Energía ganada</p>
            <p className="text-2xl font-bold text-green-600">+{totalEnergy}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-white/70 rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className="font-medium">Progreso del día</span>
          <span className="font-bold">{Math.round((completedCount / habits.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / habits.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Habits grouped by category */}
      <div className="space-y-6">
        {Object.entries(groupedHabits).map(([category, categoryHabits]) => {
          const catKey = category as HabitCategory;
          const colors = categoryColors[catKey];
          const categoryCompleted = categoryHabits.filter(h => h.completed).length;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
                  {categoryLabels[catKey]}
                </h3>
                <span className="text-xs text-gray-600 font-medium">
                  {categoryCompleted}/{categoryHabits.length}
                </span>
              </div>

              <div className="space-y-2">
                {categoryHabits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`
                      w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                      ${habit.completed
                        ? `${colors.bg} ${colors.border} shadow-md`
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow'
                      }
                      focus:outline-none focus:ring-2 focus:ring-green-500
                    `}
                    aria-pressed={habit.completed}
                    aria-label={`${habit.completed ? 'Marcar como no completado' : 'Marcar como completado'}: ${habit.title}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className={`
                        flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                        ${habit.completed
                          ? `${colors.border} ${colors.bg}`
                          : 'border-gray-300 bg-white'
                        }
                      `}>
                        {habit.completed && (
                          <svg className={`w-4 h-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Icon and content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <h4 className={`font-semibold ${habit.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {habit.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">⚡</span>
                            <span className={`font-bold ${habit.completed ? colors.text : 'text-gray-600'}`}>
                              +{habit.energyReward}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${habit.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                          {habit.description}
                        </p>

                        {/* Streak indicator */}
                        {habit.streak && habit.streak > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-orange-500">🔥</span>
                            <span className="font-semibold text-orange-600">
                              Racha de {habit.streak} {habit.streak === 1 ? 'día' : 'días'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational message */}
      {completedCount === habits.length ? (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl text-center text-white shadow-lg animate-pulse">
          <p className="text-lg font-bold mb-1">🎉 ¡Increíble trabajo!</p>
          <p className="text-sm">Has completado todos los hábitos saludables de hoy</p>
        </div>
      ) : completedCount > habits.length / 2 ? (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center border-2 border-blue-200">
          <p className="text-blue-700 font-semibold">💪 ¡Vas muy bien! Continúa así</p>
        </div>
      ) : null}
    </div>
  );
}

