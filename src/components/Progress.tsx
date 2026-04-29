import { useApp } from "../store";
import "./Progress.css";

export default function Progress() {
  const { workoutHistory, totalWorkouts, userProgress } = useApp();
  
  const isEmpty = workoutHistory.length === 0;
  
  // Calculate total volume from history
  //const _totalVolume = isEmpty? 0: workoutHistory.reduce((s, x) => s + (x.xp || 0), 0);
  
  // Calculate week comparison
  const last7 = workoutHistory.slice(-7);
  const prev7 = workoutHistory.slice(-14, -7);
  
  const lastSum = last7.reduce((s, x) => s + (x.xp || 0), 0);
  const prevSum = prev7.reduce((s, x) => s + (x.xp || 0), 0);
  
  const weekDiff = lastSum - prevSum;
  
  // Strength score based on total XP
  //const score = isEmpty ? 0 : Math.floor(userProgress.totalXp / 1000);

  return (
    <div className="power-panel">
      <div className="power-grid">
        {/* TOTAL XP */}
        <div className="power-card">
          <div className="power-value">
            {userProgress.totalXp.toLocaleString()}
          </div>
          <div className="power-label">GESAMT XP</div>
        </div>

        {/* WEEK DIFF */}
        <div className="power-card">
          <div
            className={`power-value ${
              weekDiff >= 0 || isEmpty ? "positive" : "negative"
            }`}
          >
            {isEmpty
              ? "START"
              : `${weekDiff >= 0 ? "+" : ""}${weekDiff.toLocaleString()}`}
          </div>
          <div className="power-label">VS LETZTE WOCHE</div>
        </div>

        {/* WORKOUTS */}
        <div className="power-card">
          <div className="power-value">{totalWorkouts}</div>
          <div className="power-label">TRAININGS</div>
        </div>
      </div>
    </div>
  );
}