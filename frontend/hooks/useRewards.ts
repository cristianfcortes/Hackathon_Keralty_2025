'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  UserRewards,
  Medal,
  HealthyHabit,
  MoodEvaluation,
  MoodLevel,
} from '@/types/rewards';
import { DEFAULT_MEDALS, DEFAULT_HABITS } from '@/types/rewards';

const STORAGE_KEY = 'user_rewards';

const initialRewards: UserRewards = {
  totalEnergy: 100,
  currentEnergy: 75,
  maxEnergy: 100,
  totalScore: 0,
  medals: DEFAULT_MEDALS.map(medal => ({ ...medal })),
  habits: DEFAULT_HABITS.map(habit => ({ ...habit })),
  moodHistory: [],
};

export function useRewards() {
  const [rewards, setRewards] = useState<UserRewards>(initialRewards);
  const [loading, setLoading] = useState(true);

  // Load rewards from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (parsed.lastMoodCheck) {
          parsed.lastMoodCheck = new Date(parsed.lastMoodCheck);
        }
        if (parsed.moodHistory) {
          parsed.moodHistory = parsed.moodHistory.map((mood: MoodEvaluation) => ({
            ...mood,
            date: new Date(mood.date),
          }));
        }
        if (parsed.medals) {
          parsed.medals = parsed.medals.map((medal: Medal) => ({
            ...medal,
            earnedAt: medal.earnedAt ? new Date(medal.earnedAt) : undefined,
          }));
        }
        if (parsed.habits) {
          parsed.habits = parsed.habits.map((habit: HealthyHabit) => ({
            ...habit,
            dueDate: habit.dueDate ? new Date(habit.dueDate) : undefined,
          }));
        }
        setRewards(parsed);
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save rewards to localStorage
  const saveRewards = useCallback((newRewards: UserRewards) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards));
      setRewards(newRewards);
    } catch (error) {
      console.error('Error saving rewards:', error);
    }
  }, []);

  // Update mood evaluation
  const updateMood = useCallback(
    (mood: MoodLevel, notes?: string) => {
      const today = new Date().toISOString().split('T')[0];
      const newEvaluation: MoodEvaluation = {
        date: today,
        mood,
        energy: rewards.currentEnergy,
        activities: [],
        notes,
      };

      const updatedHistory = [
        ...rewards.moodHistory.filter(m => m.date !== today),
        newEvaluation,
      ].slice(-30); // Keep last 30 days

      saveRewards({
        ...rewards,
        moodHistory: updatedHistory,
        lastMoodCheck: new Date(),
      });
    },
    [rewards, saveRewards]
  );

  // Toggle habit completion
  const toggleHabit = useCallback(
    (habitId: string) => {
      const updatedHabits = rewards.habits.map(habit => {
        if (habit.id === habitId) {
          const isCompleting = !habit.completed;
          const newStreak = isCompleting ? (habit.streak || 0) + 1 : 0;
          
          return {
            ...habit,
            completed: isCompleting,
            streak: newStreak,
          };
        }
        return habit;
      });

      const habit = rewards.habits.find(h => h.id === habitId);
      const energyChange = habit && !habit.completed ? habit.energyReward : -(habit?.energyReward || 0);
      const newEnergy = Math.min(
        rewards.maxEnergy,
        Math.max(0, rewards.currentEnergy + energyChange)
      );
      const newScore = Math.max(0, rewards.totalScore + (energyChange > 0 ? 10 : -10));

      // Check for medal unlocks
      const updatedMedals = checkMedalProgress(
        rewards.medals,
        updatedHabits,
        rewards.moodHistory
      );

      saveRewards({
        ...rewards,
        habits: updatedHabits,
        currentEnergy: newEnergy,
        totalEnergy: rewards.totalEnergy + (energyChange > 0 ? energyChange : 0),
        totalScore: newScore,
        medals: updatedMedals,
      });
    },
    [rewards, saveRewards]
  );

  // Add energy
  const addEnergy = useCallback(
    (amount: number) => {
      const newEnergy = Math.min(rewards.maxEnergy, rewards.currentEnergy + amount);
      saveRewards({
        ...rewards,
        currentEnergy: newEnergy,
        totalEnergy: rewards.totalEnergy + amount,
      });
    },
    [rewards, saveRewards]
  );

  // Add score
  const addScore = useCallback(
    (points: number) => {
      saveRewards({
        ...rewards,
        totalScore: rewards.totalScore + points,
      });
    },
    [rewards, saveRewards]
  );

  // Check medal progress and unlock if requirements met
  const checkMedalProgress = (
    medals: Medal[],
    habits: HealthyHabit[],
    moodHistory: MoodEvaluation[]
  ): Medal[] => {
    return medals.map(medal => {
      if (medal.earnedAt) return medal; // Already earned

      let progress = medal.progress || 0;
      let earned = false;

      switch (medal.type) {
        case 'health_champion':
          progress = habits.filter(h => h.completed).length;
          earned = progress >= (medal.requirement || 20);
          break;
        case 'consistency_master':
        case 'week_streak':
          const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);
          progress = maxStreak;
          earned = progress >= (medal.requirement || 7);
          break;
        case 'month_streak':
          const longestStreak = Math.max(...habits.map(h => h.streak || 0), 0);
          progress = longestStreak;
          earned = progress >= (medal.requirement || 30);
          break;
        default:
          break;
      }

      return {
        ...medal,
        progress: Math.min(progress, medal.requirement || 100),
        earnedAt: earned ? new Date() : undefined,
      };
    });
  };

  // Reset daily habits (call this at midnight or on new day)
  const resetDailyHabits = useCallback(() => {
    const updatedHabits = rewards.habits.map(habit => ({
      ...habit,
      completed: false,
    }));

    saveRewards({
      ...rewards,
      habits: updatedHabits,
    });
  }, [rewards, saveRewards]);

  // Get today's mood
  const getTodaysMood = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return rewards.moodHistory.find(m => m.date === today);
  }, [rewards.moodHistory]);

  // Get earned medals
  const getEarnedMedals = useCallback(() => {
    return rewards.medals.filter(m => m.earnedAt);
  }, [rewards.medals]);

  // Get pending habits
  const getPendingHabits = useCallback(() => {
    return rewards.habits.filter(h => !h.completed);
  }, [rewards.habits]);

  return {
    rewards,
    loading,
    updateMood,
    toggleHabit,
    addEnergy,
    addScore,
    resetDailyHabits,
    getTodaysMood,
    getEarnedMedals,
    getPendingHabits,
  };
}

