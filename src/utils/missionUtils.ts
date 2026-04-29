type Exercise = {
  title: string;
  exercise: string;
  sets: number;
  repetitions: string;
  weight: number;
  pause: number;
  muscle: string;
  xp: number;
  enemyName: string;
};

type Week = {
  week: number;
  Push: Exercise[];
  Pull: Exercise[];
  Legs: Exercise[];
};

type WorkoutData = {
  weeks: Week[];
};

// Gesamtanzahl aller Übungen
export function countAllExercises(data: WorkoutData): number {
  return data.weeks.reduce((total, week) => {
    return (
      total +
      week.Push.length +
      week.Pull.length +
      week.Legs.length
    );
  }, 0);
}

// Optional: Übungen pro Woche
export function countExercisesPerWeek(data: WorkoutData) {
  return data.weeks.map((week) => ({
    week: week.week,
    total:
      week.Push.length +
      week.Pull.length +
      week.Legs.length,
  }));
}