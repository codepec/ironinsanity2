import type { Act } from "./types";

export const ACTS: Act[] = [
  {
    id: 1,
    title: "Rising Warrior",
    quests: [
      { id: "act-1-1", text: "3 Workouts abschliessen", reward: 500, completed: false },
      { id: "act-1-2", text: "1 HIIT Training abschliessen", reward: 300, completed: false },
      { id: "act-1-3", text: "1 Workout mit erhoehtem Gewicht", reward: 400, completed: false },
      { id: "act-1-4", text: "3 Tage Streak halten", reward: 600, completed: false },
      { id: "act-1-5", text: "60 Minuten Training", reward: 1800, completed: false }
    ]
  },
  {
    id: 2,
    title: "Iron Discipline",
    quests: [
      { id: "act-2-1", text: "5 Workouts abschliessen", reward: 800, completed: false },
      { id: "act-2-2", text: "2 HIIT Sessions", reward: 500, completed: false },
      { id: "act-2-3", text: "2x Gewicht steigern", reward: 600, completed: false },
      { id: "act-2-4", text: "5 Tage Streak", reward: 900, completed: false },
      { id: "act-2-5", text: "60 Minuten Training", reward: 1800, completed: false }
    ]
  },
  // ... Acts 3–8 analog wie oben
];