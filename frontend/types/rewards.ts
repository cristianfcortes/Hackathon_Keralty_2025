// Types for rewards system

export type MoodLevel = 'excellent' | 'good' | 'neutral' | 'low' | 'poor';

export type MedalType = 
  | 'first_visit' 
  | 'explorer' 
  | 'health_champion' 
  | 'social_butterfly' 
  | 'consistency_master'
  | 'week_streak'
  | 'month_streak';

export interface Medal {
  id: string;
  type: MedalType;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress?: number;  // 0-100 percentage
  requirement?: number;  // Number needed to unlock
}

export interface MoodEvaluation {
  date: string;  // ISO date string
  mood: MoodLevel;
  energy: number;  // 0-100
  activities: string[];  // Activities completed that day
  notes?: string;
}

export type HabitCategory = 'physical' | 'mental' | 'social' | 'nutrition';

export interface HealthyHabit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  completed: boolean;
  dueDate?: Date;
  streak?: number;  // Consecutive days completed
  energyReward: number;  // Energy points earned
  icon: string;
}

export interface UserRewards {
  totalEnergy: number;
  currentEnergy: number;
  maxEnergy: number;
  totalScore: number;
  medals: Medal[];
  habits: HealthyHabit[];
  moodHistory: MoodEvaluation[];
  lastMoodCheck?: Date;
}

// Default medals available in the system
export const DEFAULT_MEDALS: Omit<Medal, 'earnedAt'>[] = [
  {
    id: 'first_visit',
    type: 'first_visit',
    name: 'Primera Visita',
    description: 'Completaste tu primera visita a un lugar saludable',
    icon: '🌟',
    progress: 0,
    requirement: 1,
  },
  {
    id: 'explorer',
    type: 'explorer',
    name: 'Explorador',
    description: 'Visita 10 lugares diferentes',
    icon: '🗺️',
    progress: 0,
    requirement: 10,
  },
  {
    id: 'health_champion',
    type: 'health_champion',
    name: 'Campeón de Salud',
    description: 'Completa 20 hábitos saludables',
    icon: '🏆',
    progress: 0,
    requirement: 20,
  },
  {
    id: 'social_butterfly',
    type: 'social_butterfly',
    name: 'Mariposa Social',
    description: 'Comparte 5 experiencias',
    icon: '🦋',
    progress: 0,
    requirement: 5,
  },
  {
    id: 'consistency_master',
    type: 'consistency_master',
    name: 'Maestro de Consistencia',
    description: 'Mantén una racha de 7 días',
    icon: '⭐',
    progress: 0,
    requirement: 7,
  },
  {
    id: 'week_streak',
    type: 'week_streak',
    name: 'Racha Semanal',
    description: 'Completa actividades 7 días seguidos',
    icon: '📅',
    progress: 0,
    requirement: 7,
  },
  {
    id: 'month_streak',
    type: 'month_streak',
    name: 'Racha Mensual',
    description: 'Completa actividades 30 días seguidos',
    icon: '🎯',
    progress: 0,
    requirement: 30,
  },
];

// Default healthy habits
export const DEFAULT_HABITS: HealthyHabit[] = [
  {
    id: 'habit_1',
    title: 'Caminar 30 minutos',
    description: 'Realiza una caminata de al menos 30 minutos',
    category: 'physical',
    completed: false,
    energyReward: 10,
    icon: '🚶',
    streak: 0,
  },
  {
    id: 'habit_2',
    title: 'Beber 8 vasos de agua',
    description: 'Mantén tu hidratación durante el día',
    category: 'nutrition',
    completed: false,
    energyReward: 5,
    icon: '💧',
    streak: 0,
  },
  {
    id: 'habit_3',
    title: 'Meditar 10 minutos',
    description: 'Toma tiempo para la meditación o mindfulness',
    category: 'mental',
    completed: false,
    energyReward: 8,
    icon: '🧘',
    streak: 0,
  },
  {
    id: 'habit_4',
    title: 'Comer frutas y verduras',
    description: 'Incluye al menos 5 porciones en tu dieta',
    category: 'nutrition',
    completed: false,
    energyReward: 7,
    icon: '🥗',
    streak: 0,
  },
  {
    id: 'habit_5',
    title: 'Conectar con amigos/familia',
    description: 'Llama o reúnete con un ser querido',
    category: 'social',
    completed: false,
    energyReward: 10,
    icon: '👥',
    streak: 0,
  },
  {
    id: 'habit_6',
    title: 'Ejercicio cardiovascular',
    description: 'Realiza 20 minutos de actividad cardio',
    category: 'physical',
    completed: false,
    energyReward: 15,
    icon: '🏃',
    streak: 0,
  },
  {
    id: 'habit_7',
    title: 'Dormir 7-8 horas',
    description: 'Asegúrate de tener un descanso adecuado',
    category: 'mental',
    completed: false,
    energyReward: 12,
    icon: '😴',
    streak: 0,
  },
  {
    id: 'habit_8',
    title: 'Practicar gratitud',
    description: 'Escribe 3 cosas por las que estés agradecido',
    category: 'mental',
    completed: false,
    energyReward: 6,
    icon: '🙏',
    streak: 0,
  },
];

