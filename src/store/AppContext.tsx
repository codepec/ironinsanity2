// src/store/AppContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import workoutData from '../data/workouts.json';
import dailyData from '../data/dailyquests.json';
import weeklyData from '../data/weeklyquests.json';
import mainQuestData from '../data/mainquests.json';
import bossData from '../data/bossWorkouts.json';
import type { Exercise, WorkoutWeek, WorkoutData } from '../types/workout';
import type { Quest, Act } from '../types/types';

// =============================
// 📦 Type Definitions
// =============================

export interface DailyQuest {
  questId: string;
  text: string;
  reward: number;
  completed: boolean;
}

export interface WeeklyQuest {
  questId: string;
  text: string;
  reward: number;
  completed: boolean;
}

export interface MainQuest {
  week: number;
  questId: string;
  title: string;
  reward: number;
  completed: boolean;
  story: string;
}

export interface WorkoutSession {
  week: number;
  day: 'Push' | 'Pull' | 'Legs' | 'Boss';
  startedAt: number;
  finished: boolean;
  difficultyFactor: number;
}

export interface HistoryEntry {
  date: number;
  day: string;
  xp: number;
  week: number;
  questClear?: {
    daily: { questId: string; text: string; reward: number }[];
    weekly: { questId: string; text: string; reward: number }[];
  };
}

export interface UserProgress {
  totalXp: number;
  currentWeek: number;
  currentDay: number;
  streak: number;
  level: number;
  rank: string;
  rankProgress: number; // 0-100
  nextRankXp: number;
}

interface AppState {
  // User data
  userProgress: UserProgress;
  
  // Quests
  dailyQuests: DailyQuest[];
  weeklyQuests: WeeklyQuest[];
  mainQuests: MainQuest[];
  
  // Workout data
  currentSession: WorkoutSession | null;
  missionProgress: Record<number, { Push?: boolean; Pull?: boolean; Legs?: boolean }>;
  
  // History
  workoutHistory: HistoryEntry[];
  
  // Computed
  totalWorkouts: number;
  currentWeekData: WorkoutWeek | undefined;
}

interface AppContextType extends AppState {
  // Actions
  addXp: (amount: number) => void;
  completeDailyQuest: (questId: string) => void;
  completeWeeklyQuest: (questId: string) => void;
  completeMainQuest: (week: number) => void;
  startWorkout: (week: number, day: 'Push' | 'Pull' | 'Legs' | 'Boss') => void;
  finishWorkout: (xpEarned: number, dailyQuests: DailyQuest[], weeklyQuests: WeeklyQuest[]) => void;
  setCurrentWeek: (week: number) => void;
  refreshData: () => void;
}

// =============================
// 🏆 Rank System
// =============================

const RANK_THRESHOLDS = [
  { name: 'Rekrut', xp: 0 },
  { name: 'Krieger', xp: 1200 },
  { name: 'Zerstörer', xp: 4800 },
  { name: 'Titan', xp: 10800 },
  { name: 'Warlord', xp: 19200 },
  { name: 'Champion', xp: 30000 },
  { name: 'Legende', xp: 43200 },
  { name: 'Brutalizer', xp: 58800 },
  { name: 'Kriegsherr', xp: 76800 },
  { name: 'Eroberer', xp: 97200 },
  { name: 'Phönix', xp: 120000 },
  { name: 'Schattenlord', xp: 145200 },
  { name: 'Apokalypt', xp: 172800 },
  { name: 'Unsterblicher', xp: 202800 },
  { name: 'Gottkrieger', xp: 235200 },
  { name: 'Mythos', xp: 270000 },
  { name: 'Kosmokrat', xp: 307200 },
  { name: 'Ewiger', xp: 346800 },
];

function calculateRank(xp: number): { rank: string; progress: number; nextXp: number } {
  let currentRank = RANK_THRESHOLDS[0];
  let nextRank = RANK_THRESHOLDS[1] || null;
  
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (xp >= RANK_THRESHOLDS[i].xp) {
      currentRank = RANK_THRESHOLDS[i];
      nextRank = RANK_THRESHOLDS[i + 1] || null;
    }
  }
  
  const progress = nextRank 
    ? Math.min(100, ((xp - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100)
    : 100;
    
  return {
    rank: currentRank.name,
    progress,
    nextXp: nextRank?.xp || currentRank.xp,
  };
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

function calculateStreak(history: HistoryEntry[]): number {
  if (!history || history.length === 0) return 0;
  
  const sorted = [...history].sort((a, b) => b.date - a.date);
  let streak = 1;
  let prevDate = new Date(sorted[0].date).setHours(0, 0, 0, 0);
  
  for (let i = 1; i < sorted.length; i++) {
    const currentDate = new Date(sorted[i].date).setHours(0, 0, 0, 0);
    const diff = (prevDate - currentDate) / (24 * 60 * 60 * 1000);
    
    if (diff <= 1) {
      streak++;
      prevDate = currentDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// =============================
// 🔧 Helper Functions
// =============================

function normalizeDailyQuest(q: { questId?: string; text?: string; reward?: number; completed?: boolean }, index: number): DailyQuest {
  return {
    questId: q.questId || `dq-${index}`,
    text: q.text || 'Quest',
    reward: Number(q.reward || 0),
    completed: Boolean(q.completed),
  };
}

function normalizeWeeklyQuest(q: { questId?: string; text?: string; reward?: number; completed?: boolean }, weekIndex: number, questIndex: number): WeeklyQuest {
  return {
    questId: q.questId || `wq-${weekIndex}-${questIndex}`,
    text: q.text || 'Quest',
    reward: Number(q.reward || 0),
    completed: Boolean(q.completed),
  };
}

function normalizeMainQuest(q: { week?: number; questId?: string; title?: string; reward?: number; completed?: boolean; story?: string }): MainQuest {
  return {
    week: q.week || 1,
    questId: q.questId || `main-${q.week}`,
    title: q.title || 'Unknown Quest',
    reward: Number(q.reward || 0),
    completed: Boolean(q.completed),
    story: q.story || '',
  };
}

// =============================
// 🌍 Context Creation
// =============================

const AppContext = createContext<AppContextType | undefined>(undefined);

// =============================
// 📦 Provider Component
// =============================

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const totalXp = Number(localStorage.getItem('totalXp') || 0);
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const { rank, progress, nextXp } = calculateRank(totalXp);
    
    return {
      totalXp,
      currentWeek: Number(localStorage.getItem('selectedWeek') || 1),
      currentDay: 1,
      streak: calculateStreak(history),
      level: calculateLevel(totalXp),
      rank,
      rankProgress: progress,
      nextRankXp: nextXp,
    };
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('dailyQuests');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today && Array.isArray(parsed.quests)) {
          return parsed.quests.map((q: DailyQuest, i: number) => normalizeDailyQuest(q, i));
        }
      } catch {
        // Invalid data, regenerate
      }
    }
    
    // Generate new daily quests
    const pool = dailyData.dailyQuestSystem.questPool;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, dailyData.dailyQuestSystem.selectionCount);
    
    const quests = selected.map((q, i) => normalizeDailyQuest(q, i));
    localStorage.setItem('dailyQuests', JSON.stringify({ date: today, quests }));
    
    return quests;
  });

  const [weeklyQuests, setWeeklyQuests] = useState<WeeklyQuest[]>(() => {
    const saved = localStorage.getItem('weeklyQuests');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((q: WeeklyQuest, i: number) => normalizeWeeklyQuest(q, 0, i));
        }
      } catch {
        // Invalid data
      }
    }
    
    // Flatten all weekly quests
    const quests = weeklyData.weeklyQuests.flatMap((week, weekIndex) =>
      week.quests.map((q, questIndex) => normalizeWeeklyQuest(q, weekIndex, questIndex))
    );
    
    localStorage.setItem('weeklyQuests', JSON.stringify(quests));
    return quests;
  });

  const [mainQuests, setMainQuests] = useState<MainQuest[]>(() => {
    return mainQuestData.mainQuestline.quests.map(normalizeMainQuest);
  });

  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(() => {
    const saved = localStorage.getItem('workoutSession');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          week: parsed.week,
          day: parsed.day,
          startedAt: parsed.startedAt,
          finished: parsed.finished,
          difficultyFactor: parsed.difficultyFactor,
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const [missionProgress, setMissionProgress] = useState<Record<number, { Push?: boolean; Pull?: boolean; Legs?: boolean }>>(() => {
    return JSON.parse(localStorage.getItem('missionProgress') || '{}');
  });

  const [workoutHistory, setWorkoutHistory] = useState<HistoryEntry[]>(() => {
    return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  });

  // Computed values
  const totalWorkouts = workoutHistory.length;
  const currentWeekData = workoutData.weeks.find(w => w.week === userProgress.currentWeek);

  // =============================
  // 🔄 Actions
  // =============================

  const addXp = useCallback((amount: number) => {
    setUserProgress(prev => {
      const newXp = prev.totalXp + amount;
      const { rank, progress, nextXp } = calculateRank(newXp);
      
      localStorage.setItem('totalXp', newXp.toString());
      
      return {
        ...prev,
        totalXp: newXp,
        level: calculateLevel(newXp),
        rank,
        rankProgress: progress,
        nextRankXp: nextXp,
      };
    });
  }, []);

  const completeDailyQuest = useCallback((questId: string) => {
    setDailyQuests(prev => {
      const updated = prev.map(q => 
        q.questId === questId ? { ...q, completed: true } : q
      );
      
      const today = new Date().toDateString();
      localStorage.setItem('dailyQuests', JSON.stringify({ date: today, quests: updated }));
      
      return updated;
    });
  }, []);

  const completeWeeklyQuest = useCallback((questId: string) => {
    setWeeklyQuests(prev => {
      const updated = prev.map(q => 
        q.questId === questId ? { ...q, completed: true } : q
      );
      
      localStorage.setItem('weeklyQuests', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeMainQuest = useCallback((week: number) => {
    setMainQuests(prev => {
      const updated = prev.map(q => 
        q.week === week ? { ...q, completed: true } : q
      );
      return updated;
    });
  }, []);

  const startWorkout = useCallback((week: number, day: 'Push' | 'Pull' | 'Legs' | 'Boss') => {
    const session: WorkoutSession = {
      week,
      day,
      startedAt: Date.now(),
      finished: false,
      difficultyFactor: 1,
    };
    
    setCurrentSession(session);
    localStorage.setItem('workoutSession', JSON.stringify(session));
  }, []);

  const finishWorkout = useCallback((xpEarned: number, completedDailyQuests: DailyQuest[], completedWeeklyQuests: WeeklyQuest[]) => {
    // Add XP
    addXp(xpEarned);
    
    // Mark quests as completed
    completedDailyQuests.forEach(q => completeDailyQuest(q.questId));
    completedWeeklyQuests.forEach(q => completeWeeklyQuest(q.questId));
    
    // Update mission progress
    if (currentSession) {
      setMissionProgress(prev => {
        const week = currentSession.week;
        const day = currentSession.day;
        
        if (day === 'Push' || day === 'Pull' || day === 'Legs') {
          const updated = {
            ...prev,
            [week]: {
              ...(prev[week] || {}),
              [day]: true,
            },
          };
          localStorage.setItem('missionProgress', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
    
    // Add to history
    const historyEntry: HistoryEntry = {
      date: Date.now(),
      day: currentSession?.day || 'Unknown',
      xp: xpEarned,
      week: currentSession?.week || 1,
    };
    
    setWorkoutHistory(prev => {
      const updated = [...prev, historyEntry];
      localStorage.setItem('workoutHistory', JSON.stringify(updated));
      return updated;
    });
    
    // Clear session
    setCurrentSession(null);
    localStorage.removeItem('workoutSession');
  }, [addXp, completeDailyQuest, completeWeeklyQuest, currentSession]);

  const setCurrentWeek = useCallback((week: number) => {
    setUserProgress(prev => ({ ...prev, currentWeek: week }));
    localStorage.setItem('selectedWeek', week.toString());
  }, []);

  const refreshData = useCallback(() => {
    // Force refresh from localStorage
    const totalXp = Number(localStorage.getItem('totalXp') || 0);
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const { rank, progress, nextXp } = calculateRank(totalXp);
    
    setUserProgress(prev => ({
      ...prev,
      totalXp,
      streak: calculateStreak(history),
      level: calculateLevel(totalXp),
      rank,
      rankProgress: progress,
      nextRankXp: nextXp,
    }));
    
    setWorkoutHistory(history);
  }, []);

  // Persist mission progress
  useEffect(() => {
    localStorage.setItem('missionProgress', JSON.stringify(missionProgress));
  }, [missionProgress]);

  const value: AppContextType = {
    userProgress,
    dailyQuests,
    weeklyQuests,
    mainQuests,
    currentSession,
    missionProgress,
    workoutHistory,
    totalWorkouts,
    currentWeekData,
    addXp,
    completeDailyQuest,
    completeWeeklyQuest,
    completeMainQuest,
    startWorkout,
    finishWorkout,
    setCurrentWeek,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// =============================
// 🎣 Custom Hook
// =============================

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// =============================
// 📊 Data Access Helpers
// =============================

export function getExercisesForDay(week: number, day: 'Push' | 'Pull' | 'Legs' | 'Boss'): Exercise[] {
  if (day === 'Boss') {
    const bossWeek = bossData.bossWeeks.find(b => b.week === week);
    return bossWeek?.workout || [];
  }
  
  const weekData = workoutData.weeks.find(w => w.week === week);
  return weekData?.[day] || [];
}

export function getTotalXpForDay(week: number, day: 'Push' | 'Pull' | 'Legs' | 'Boss'): number {
  const exercises = getExercisesForDay(week, day);
  return exercises.reduce((sum, ex) => sum + ex.xp, 0);
}

export function getBossData(week: number) {
  return bossData.bossWeeks.find(b => b.week === week);
}

export function getMainQuestline() {
  return mainQuestData.mainQuestline;
}

export function getWeeklyQuestsForWeek(weekIndex: number) {
  return weeklyData.weeklyQuests[weekIndex];
}