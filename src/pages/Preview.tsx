import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp, getExercisesForDay } from "../store";
import RankHeader from "../components/RankHeader";
import type { Exercise } from "../types/workout";
import "./Preview.css";

const enemyImageForMuscle = (muscle?: string): string => {
  switch (muscle) {
    case "Chest": return "goblins.png";
    case "Back": return "skeletons.png";
    case "Legs": return "orcs.png";
    case "Shoulders": return "imps.png";
    case "Biceps": return "ghosts.png";
    case "Triceps": return "ghosts_orcs.png";
    default: return "default.svg";
  }
};

const inferEquipment = (exerciseName: string): string => {
  const name = exerciseName.toLowerCase();
  const equipment = new Set<string>();

  if (name.includes("kh") || name.includes("dumbbell")) equipment.add("KH");
  if (name.includes("bank")) equipment.add("Hantelbank");
  if (name.includes("bw")) equipment.add("Körpergewicht");

  if (equipment.size === 0) equipment.add("KH");

  return Array.from(equipment).join(", ");
};

export const Preview: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();

  const sessionRaw = localStorage.getItem("workoutSession");
  const session = sessionRaw ? JSON.parse(sessionRaw) : null;

  if (!session) {
    return (
      <div className="app-wrap">
        <RankHeader />
        <div className="history-empty">Keine Vorschau verfügbar</div>
      </div>
    );
  }

  const week = Number(session.week || userProgress.currentWeek);
  const day = session.day as "Push" | "Pull" | "Legs" | "Boss";

  const exercises: Exercise[] = getExercisesForDay(week, day);
  const totalXP = exercises.reduce((s, e) => s + (e.xp || 0), 0);

  return (
    <div className="app-wrap">
      <RankHeader />

      <div className="preview-page">
        {/* HERO */}
        <header className="preview-hero">
          <div className="preview-hero-inner">
            <p className="preview-kicker">Mission</p>
            <h1 className="preview-title">Briefing</h1>
            <p className="preview-lead">
              Bereite dich vor. Jede Entscheidung bringt dich näher zur Legende.
            </p>

            <div className="preview-badges">
              <span>Woche {week}</span>
              <span>Tag: {day}</span>
              <span>XP: {totalXP}</span>
              <span>Gegner: {exercises.length}</span>
            </div>
          </div>
        </header>

        {/* EXERCISES */}
        <section className="preview-section">
          <div className="preview-grid">
            {exercises.map((ex, i) => {
              const art = enemyImageForMuscle(ex.muscle);

              return (
                <article
                  key={i}
                  className="preview-card"
                  style={
                    {
                      "--enemy": `url(/src/assets/images/enemies/${art})`,
                    } as React.CSSProperties
                  }
                >
                  <div className="preview-card-body">
                    <h3>{ex.exercise}</h3>
                    <p className="enemy">{ex.enemyName}</p>

                    <p className="equip">
                      {inferEquipment(ex.exercise)}
                    </p>

                    <div className="chips">
                      <span>{ex.sets} × {ex.repetitions}</span>
                      {ex.muscle && <span>{ex.muscle}</span>}
                      {ex.pause && <span>{ex.pause}s</span>}
                      <span className="xp">+{ex.xp} XP</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <button
          className="preview-start"
          onClick={() => navigate("/workout")}
        >
          ⚔️ Mission starten
        </button>
      </div>
    </div>
  );
};

export default Preview;