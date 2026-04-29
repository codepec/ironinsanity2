// src/pages/Workout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, getExercisesForDay } from "../store";
import { WorkoutCard } from "../components/WorkoutCard";
import { PauseOverlay } from "../components/PauseOverlay";
import { useWorkout } from "../hooks/useWorkout";
import RankHeader from "../components/RankHeader";
import { WorkoutHUD } from "../components/WorkoutHUD";
import type { Exercise } from "../types/workout";
import "./Workout.css";

const QUEST_PREVIEW = 6;

export const Workout: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userProgress, 
    dailyQuests: globalDailyQuests, 
    weeklyQuests: globalWeeklyQuests,
    finishWorkout,
    missionProgress,
    setCurrentWeek
  } = useApp();

  const [xpTotal, setXpTotal] = useState(0);
  const [combo, setCombo] = useState(1);
  const [showPause, setShowPause] = useState<number | null>(null);
  const [showFinishScreen, setShowFinishScreen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Get session from localStorage (or global state)
  const sessionRaw = localStorage.getItem("workoutSession");
  let session: { week?: number; day?: string } | null = null;
  if (sessionRaw) {
    try {
      session = JSON.parse(sessionRaw) as { week?: number; day?: string };
    } catch {
      session = null;
    }
  }

  const week = session?.week ?? userProgress.currentWeek;
  const day = session?.day ?? "";

  // Get exercises from global store
  const exercises: Exercise[] = useMemo(() => {
    if (!session || !day) return [];
    return getExercisesForDay(week, day as "Push" | "Pull" | "Legs" | "Boss");
  }, [session, week, day]);

  const workout = useWorkout(exercises);

  // Check if workout is complete
  useEffect(() => {
    if (
      exercises.length > 0 &&
      workout.exIndex >= exercises.length &&
      !showFinishScreen
    ) {
      setShowFinishScreen(true);
    }
  }, [workout.exIndex, exercises.length, showFinishScreen]);

  // Calculate progress
  const totalSetsInWorkout = exercises.reduce((s, e) => s + e.sets, 0);
  const setsCompleted =
    exercises.slice(0, workout.exIndex).reduce((s, e) => s + e.sets, 0) + workout.setIndex;
  const battleProgressPct =
    totalSetsInWorkout > 0 ? Math.min(100, (setsCompleted / totalSetsInWorkout) * 100) : 0;

  // Calculate XP
  const exerciseXp = exercises.reduce((s, e) => s + e.xp, 0);
  const dailyQuestXp = globalDailyQuests.reduce((s, q) => s + q.reward, 0);
  const weeklyQuestXp = globalWeeklyQuests.reduce((s, q) => s + q.reward, 0);
  const newXpTotal = xpTotal + exerciseXp + dailyQuestXp + weeklyQuestXp;

  const totalXpLive = userProgress.totalXp + xpTotal;

  const finishSession = () => {
    // Mark all quests as completed
    const completedDaily = globalDailyQuests.map(q => ({ ...q, completed: true }));
    const completedWeekly = globalWeeklyQuests.map(q => ({ ...q, completed: true }));
    
    // Update mission progress
    if (day === "Push" || day === "Pull" || day === "Legs") {
      const updatedProgress = {
        ...missionProgress,
        [week]: {
          ...(missionProgress[week] || {}),
          [day]: true,
        },
      };
      localStorage.setItem("missionProgress", JSON.stringify(updatedProgress));
      
      // Advance to next week if all done
      const weekProg = updatedProgress[week] || {};
      if (weekProg.Push && weekProg.Pull && weekProg.Legs) {
        setCurrentWeek(week + 1);
      }
    }
    
    finishWorkout(newXpTotal, completedDaily, completedWeekly);
    navigate("/");
  };

  // No session - show empty state
  if (!session) {
    return (
      <div id="cardContainer" className="workout-arena">
        <RankHeader />
        <div className="workout-void">
          <span className="workout-void-icon" aria-hidden>☠️</span>
          <h1 className="workout-void-title">Keine Schlacht offen</h1>
          <p className="workout-void-text">
            Starte eine Mission vom Lager aus — ohne Befehl gibt es kein Schlachtfeld.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate("/")}>
            Zurück zum Lager
          </button>
        </div>
      </div>
    );
  }

  // No exercises - show error
  if (exercises.length === 0) {
    return (
      <div id="cardContainer" className="workout-arena">
        <RankHeader />
        <div className="workout-void">
          <span className="workout-void-icon" aria-hidden>⚔️</span>
          <h1 className="workout-void-title">Keine Gegner geladen</h1>
          <p className="workout-void-text">
            Für Woche {week} / {String(day)} liegen keine Übungen vor.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate("/")}>
            Mission wählen
          </button>
        </div>
      </div>
    );
  }

  const currentEx = workout.current;
  const isBossFight = currentEx ? workout.exIndex === exercises.length - 1 : false;

  return (
    <div id="cardContainer" className="workout-arena">
      <RankHeader />

      {showPause !== null && (
        <PauseOverlay
          seconds={showPause}
          onDone={() => setShowPause(null)}
          title="Atempause"
          subtitle="Sammle dich. Der nächste Treffer zählt."
        />
      )}

      <WorkoutHUD sessionXp={xpTotal} totalXp={totalXpLive} combo={combo} />

      {!showFinishScreen && currentEx && (
        <>
          {/* Compact Battle Banner - Mobile First */}
          <header className="workout-battle-banner compact">
            <div className="battle-banner-main">
              <span className="battle-day">Woche {week} · {String(day)}</span>
              <span className="battle-progress">
                {workout.exIndex + 1}/{exercises.length} · Satz {workout.setIndex + 1}/{currentEx.sets}
              </span>
            </div>
            <div className="battle-progress-bar">
              <div className="battle-progress-fill" style={{ width: `${battleProgressPct}%` }} />
            </div>
            {isBossFight && <span className="boss-tag">🔥 BOSS</span>}
          </header>

          {/* Main Workout Card */}
          <WorkoutCard
            exercise={currentEx}
            setIndex={workout.setIndex}
            onComplete={() => {
              const multi = 1 + (combo - 1) * 0.15;
              const gained = Math.round(currentEx.xp * multi);
              setXpTotal((prev) => prev + gained);
              setCombo((prev) => prev + 1);
              workout.completeSet();
              if (currentEx.pause > 0) setShowPause(currentEx.pause);
            }}
            isBoss={isBossFight}
          />

          {/* Collapsible Details Section */}
          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "▼ Details ausblenden" : "▶ Details anzeigen"}
          </button>

          {showDetails && (
            <div className="workout-details">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Übung</span>
                  <span className="detail-value">{currentEx.exercise}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Muskel</span>
                  <span className="detail-value">{currentEx.muscle}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gewicht</span>
                  <span className="detail-value">{currentEx.weight}kg</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pause</span>
                  <span className="detail-value">{currentEx.pause}s</span>
                </div>
              </div>
              <div className="details-xp">
                <span>+{currentEx.xp} XP pro Satz</span>
                <span>Kombo ×{combo} = +{Math.round(currentEx.xp * (1 + (combo - 1) * 0.15))} XP</span>
              </div>
            </div>
          )}
        </>
      )}

      {showFinishScreen && (
        <section className="workout-victory" aria-label="Mission abgeschlossen">
          <div className="workout-victory-card">
            <div className="workout-victory-glow" aria-hidden />
            <div className="workout-victory-inner">
              <p className="workout-victory-kicker">Schlachtbeendet</p>
              <h2 className="workout-victory-title">Das Feld ist deins</h2>

              <div className="workout-victory-xp-block">
                <span className="workout-victory-xp-label">Gesamtplünderung</span>
                <span className="workout-victory-xp-value">
                  {newXpTotal.toLocaleString()}
                  <span className="workout-victory-xp-unit"> XP</span>
                </span>
              </div>

              <div className="workout-victory-grid">
                <div className="workout-victory-panel">
                  <div className="workout-victory-panel-head">
                    <h3 className="workout-victory-panel-title">Tagesbefehle</h3>
                    <span className="workout-victory-panel-meta">
                      +{dailyQuestXp} XP
                    </span>
                  </div>
                  <ul className="workout-victory-list">
                    {globalDailyQuests.slice(0, QUEST_PREVIEW).map((q) => (
                      <li key={q.questId}>
                        <span>{q.text}</span>
                        <span>+{q.reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="workout-victory-panel">
                  <div className="workout-victory-panel-head">
                    <h3 className="workout-victory-panel-title">Wochenfeldzug</h3>
                    <span className="workout-victory-panel-meta">
                      +{weeklyQuestXp} XP
                    </span>
                  </div>
                  <ul className="workout-victory-list">
                    {globalWeeklyQuests.slice(0, QUEST_PREVIEW).map((q) => (
                      <li key={q.questId}>
                        <span>{q.text}</span>
                        <span>+{q.reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button type="button" className="workout-btn-finish" onClick={finishSession}>
                Beute einstreichen & Lager
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
