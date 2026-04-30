// src/components/WorkoutCard.tsx
import React from "react";
import type { Exercise } from "../types/workout";
import "./WorkoutCard.css";
  
type Props = {
  exercise: Exercise;
  setIndex: number;
  onComplete: () => void;
  isBoss: boolean;
};

export const WorkoutCard: React.FC<Props> = ({
  exercise,
  setIndex,
  onComplete,
  isBoss
}) => {
  const totalHP = exercise.sets * 100;
  const currentHP = Math.max(totalHP - setIndex * 100, 0);

  function getEnemyTier(xp: number) {
    if (xp >= 100) return 3;
    if (xp >= 80) return 2;
    return 1;
  }



  const enemyPools: Record<string, string[]> = {
    Chest: ["goblin1.PNG", "goblin2.PNG", "goblin3.PNG"],
    Back: ["skeleton1.PNG", "skeleton2.PNG", "skeleton3.PNG"],
    Legs: ["orc1.PNG", "orc2.PNG", "orc3.PNG"],
    Shoulders: ["imp1.PNG", "imp2.PNG", "imp3.PNG"],
    Biceps: ["ghost1.PNG", "ghost2.PNG", "ghost3.PNG"],
    Triceps: ["ghost_orc1.PNG", "ghost_orc2.PNG", "ghost_orc3.PNG"]
  };

  function getEnemyImage(muscle: string, xp: number) {
    const pool = enemyPools[muscle];
    if (!pool) return "default.svg";

    const tier = getEnemyTier(xp);

   
    const variation = Math.random() < 0.3 ? 1 : 0;

    const index = Math.min(tier - 1 + variation, pool.length - 1);
    return pool[index];
  }


  const enemyImage = getEnemyImage(exercise.muscle, exercise.xp);
  const imageSrc = `${import.meta.env.BASE_URL}assets/images/enemies/${enemyImage}`;

  return (
    <div className={`card ${isBoss ? "boss" : ""} workout-card`}>
      
      {/* Meta Info */}
      <div className="meta">Muskel: {exercise.muscle}</div>

      {/* Exercise Name */}
      <div className="exercise">{exercise.exercise}</div>

      {/* Enemy Image */}
      <img
        src={imageSrc}
        alt={exercise.enemyName}
        className="muscle-icon"
        loading="eager"
        decoding="async"
      />

      {/* Enemy Name */}
      <div className="enemy-info">
        {isBoss && "🔥 BOSS: "} {exercise.enemyName}
      </div>

      {/* HP Bar */}
      <div className="set-box">
        HP {currentHP}/{totalHP}
      </div>

      <div className="set-progress">
        <div
          className="set-hp-fill"
          style={{ width: `${(currentHP / totalHP) * 100}%` }}
        />
      </div>

      {/* Info Grid */}
      <div className="info-grid">
        <div className="badge">
          <div className="badge-label">Wdh</div>
          <div className="badge-value">{exercise.repetitions}</div>
        </div>

        <div className="badge">
          <div className="badge-label">Gewicht</div>
          <div className="badge-value">{exercise.weight}</div>
        </div>

        <div className="badge">
          <div className="badge-label">Pause</div>
          <div className="badge-value">{exercise.pause}s</div>
        </div>

        <div className="badge">
          <div className="badge-label">XP</div>
          <div className="badge-value">{exercise.xp}</div>
        </div>
      </div>

      {/* Button */}
      <button className="primary" onClick={onComplete}>
        SATZ ERLEDIGT
      </button>
    </div>
  );
};