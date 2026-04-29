// src/components/DailyQuests.tsx
import React, { useState } from "react";
import { useApp } from "../store";
import QuestCard from "./QuestCard";
import "./DailyQuests.css";

const DailyQuests: React.FC = () => {
  const { dailyQuests } = useApp();
  const [open, setOpen] = useState(false);

  if (!dailyQuests.length) return null;

  // Calculate completion stats
  const completedCount = dailyQuests.filter(q => q.completed).length;
  const totalReward = dailyQuests.reduce((sum, q) => sum + q.reward, 0);
  const earnedReward = dailyQuests
    .filter(q => q.completed)
    .reduce((sum, q) => sum + q.reward, 0);

  return (
    <div className="daily-wrapper">
      {/* 🔥 HEADER */}
      <div className="daily-header" onClick={() => setOpen(!open)}>
        <span>Daily Quests</span>
        <span className="daily-progress">
          {completedCount}/{dailyQuests.length} • {earnedReward}/{totalReward} XP
        </span>
        <span className="daily-arrow">{open ? "▲" : "▼"}</span>
      </div>

      {/* 📦 COLLAPSED MINI VIEW */}
      {!open && (
        <div className="daily-mini">
          {dailyQuests.map((q) => (
            <div
              key={q.questId}
              className={`daily-mini-item ${q.completed ? "done" : ""}`}
            >
              <div className="mini-left">
                <div className={`mini-status ${q.completed ? "done" : ""}`}>
                  {q.completed ? "✓" : ""}
                </div>
                <div className="mini-text">{q.text}</div>
              </div>
              <div className="mini-right">
                {q.completed ? "DONE" : "+" + q.reward}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📦 EXPANDED VIEW */}
      {open && (
        <div className="daily-content">
          {dailyQuests.map((q) => (
            <QuestCard
              key={q.questId}
              type="daily"
              title={q.text}
              description="Daily Quest"
              xp={q.reward}
              icon="/src/assets/icons/ui/game-icons_burning-sword.svg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyQuests;