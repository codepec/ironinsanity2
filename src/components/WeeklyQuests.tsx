import React, { useState } from "react";
import { useApp, getWeeklyQuestsForWeek } from "../store";
import QuestCard from "./QuestCard";
import "./WeeklyQuests.css";

const WeeklyQuests: React.FC = () => {
  const { weeklyQuests, userProgress } = useApp();
  const [activeWeek] = useState(userProgress.currentWeek - 1);
  const [open, setOpen] = useState(false);

  if (!weeklyQuests.length) return null;

  // Get the weekly quest block for current active week
  const weeklyBlock = getWeeklyQuestsForWeek(activeWeek);
  if (!weeklyBlock) return null;

  // Merge with completed status from global state
  const mergedQuests = weeklyBlock.quests.map(q => ({
    ...q,
    completed: weeklyQuests.some(wq => wq.questId === q.questId && wq.completed),
  }));

  // Calculate stats
  const completedCount = mergedQuests.filter(q => q.completed).length;
  const totalReward = mergedQuests.reduce((sum, q) => sum + q.reward, 0);
  const earnedReward = mergedQuests
    .filter(q => q.completed)
    .reduce((sum, q) => sum + q.reward, 0);

  return (
    <div className="weekly-wrapper">
      {/* 🔥 HEADER */}
      <div className="weekly-header" onClick={() => setOpen(!open)}>
        <span>Weekly Quests</span>
        <span className="weekly-progress">
          {completedCount}/{mergedQuests.length} • {earnedReward}/{totalReward} XP
        </span>
        <span>{open ? "▲" : "▼"}</span>
      </div>

      {/* 🧠 WEEK TITLE */}
      <div className="weekly-title">
        Woche {activeWeek + 1} – {weeklyBlock.title}
      </div>

      {/* 📦 COLLAPSED VIEW */}
      {!open && (
        <div className="weekly-mini">
          {mergedQuests.map((q) => {
            const isDone = q.completed;
            return (
              <div key={q.questId} className={`weekly-mini-item ${isDone ? "done" : ""}`}>
                <div className="mini-left">
                  <div className={`mini-status ${isDone ? "done" : ""}`}>
                    {isDone ? "✓" : ""}
                  </div>
                  <span className="mini-text">{q.text}</span>
                </div>
                <div className="day-mini-right">
                  {isDone ? "DONE" : "+" + q.reward}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 📦 EXPANDED VIEW */}
      {open && (
        <div className="weekly-content">
          {mergedQuests.map((quest) => (
            <QuestCard
              key={quest.questId}
              type="weekly"
              title={quest.text}
              description="Weekly Quest"
              xp={quest.reward}
              icon="/src/assets/icons/ui/game-icons_burning-axe.svg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyQuests;