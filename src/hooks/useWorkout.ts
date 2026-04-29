// src/hooks/useWorkout.ts
import { useState } from "react";
import type { Exercise } from "../types/workout";

export const useWorkout = (exercises: Exercise[]) => {
  const [exIndex, setExIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(1);
  const [pause, setPause] = useState<number | null>(null);

  const current = exercises[exIndex];

  const completeSet = () => {
    if (!current) return;

    const multi = 1 + (combo - 1) * 0.15;
    const gained = Math.round(current.xp * multi);

    setXp(prev => prev + gained);
    setCombo(prev => prev + 1);

    const nextSet = setIndex + 1;

    if (nextSet >= current.sets) {
      setExIndex(prev => prev + 1);
      setSetIndex(0);

      if (current.pause > 0) setPause(current.pause);
    } else {
      setSetIndex(nextSet);
      if (current.pause > 0) setPause(current.pause);
    }
  };

  return {
    current,
    exIndex,
    setIndex,
    xp,
    combo,
    pause,
    setPause,
    completeSet
  };
};