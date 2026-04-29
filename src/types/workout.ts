// src/types/workout.ts
export type Exercise = {
  exercise: string;
  muscle: string;
  sets: number;
  repetitions: string;
  weight: number;
  pause: number;
  xp: number;
  enemyName: string;
};

export type WorkoutDay = Exercise[];

export type WorkoutWeek = {
  week: number;
  Push: WorkoutDay;
  Pull: WorkoutDay;
  Legs: WorkoutDay;
  Boss?: WorkoutDay;
};

export type WorkoutData = {
  weeks: WorkoutWeek[];
};