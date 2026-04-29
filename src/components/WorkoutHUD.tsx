import React, { useEffect, useState } from "react";
import "./WorkoutHUD.css";

interface WorkoutHUDProps {
  sessionXp: number;
  totalXp: number;
  combo: number;
}

export const WorkoutHUD: React.FC<WorkoutHUDProps> = ({
  sessionXp,
  totalXp,
  combo,
}) => {
  const [level, setLevel] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const newLevel = Math.floor(totalXp / 500) + 1;

    // Detect level up
    if (newLevel > level) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 2000); // 2 Sekunden Einblenden
    }

    setLevel(newLevel);
    setFillPercent((totalXp % 500) / 5); // 0-100%
  }, [totalXp]);

  return (
    <div className="hero-bar">
      <div className="hero-inner">
        <div className="hud-row">
          <div className="level">Rang {level}</div>
          <div className="session-xp">Beute {sessionXp} XP</div>
        </div>

        <div className="xp-bar">
          <div
            className={`xp-fill ${fillPercent >= 100 ? "explode" : ""}`}
            style={{ width: `${Math.min(fillPercent, 100)}%` }}
          />
        </div>

        {levelUp && <div className="level-up-text">MACHT STEIGT!</div>}

        <div className="combo">Kombo ×{combo}</div>
      </div>
    </div>
  );
};