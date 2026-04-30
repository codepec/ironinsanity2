import React from "react";
import { useApp } from "../store";
import "./RankHeader.css";
import tridemEmblem from "../assets/icons/ui/emojione-monotone_trident-emblem.png";

const RankHeader: React.FC = () => {
  const { userProgress } = useApp();
  
  const { totalXp, rank, rankProgress, streak, level, nextRankXp } = userProgress;

  return (
    <div className="rank-header">
      <div className="rank-box">
        <img
          src={tridemEmblem}
          width={25}
          height={25}
          alt="Rank Icon"
          className="rank-icon"
        />

        <div className="rank">
          <div className="rank-title">
            Rang: <span>{rank}</span>
          </div>

          <div className="xp-text">
            {nextRankXp > totalXp
              ? `${totalXp.toLocaleString()} / ${nextRankXp.toLocaleString()} XP`
              : "Max Rang erreicht"}
          </div>

          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${rankProgress}%` }} />
          </div>
        </div>

        <div className="divider" />

        <div className="stat">
          <div className="stat-title">STREAK</div>
          <div className="stat-value">{streak}</div>
        </div>

        <div className="divider" />

        <div className="stat">
          <div className="stat-title">LVL</div>
          <div className="stat-value">{level}</div>
        </div>
      </div>
    </div>
  );
};

export default RankHeader;