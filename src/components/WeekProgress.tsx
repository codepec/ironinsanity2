import React from "react";
import "./WeekProgress.css";

interface WeekProgressProps {
  currentWeek?: number;
  currentDay?: number;
  progressPercent?: number; // 0-100
}

const WeekProgress: React.FC<WeekProgressProps> = ({
  currentWeek = 1,
  currentDay = 1,
  progressPercent = 0,
}) => {
  return (
    <div className="week-progress">
      <h3 className="section-title">Wochenfortschritt</h3>
      <span className="week-text">Woche {currentWeek} / Tag {currentDay}</span>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default WeekProgress;