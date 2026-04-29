import React from "react";
import type { Act } from "../types/types";

interface Props {
  act: Act;
  onFinish?: () => void;
}

export const ActCard: React.FC<Props> = ({ act, onFinish }) => {
  const allDone = act.quests.every((q) => q.completed);

  return (
    <div className={`card ${act.boss ? "boss" : ""}`}>
      <div className="quest-award-title">
        Akt {act.id} - {act.title}
      </div>
      <img
        src="../icons/Line3.png"
        alt="Decorative Line"
        className="decorative-line"
        height={3}
      />
      <div className="quest-award-description">Woche {act.id}</div>

      {act.quests.map((q) => {
        const done = q.completed;

        return (
          <div
            key={q.id}
            className={`quest ${done ? "done" : "locked"}`}
          >
            <div className="quest-title">
              {q.text} {done ? "✅" : ""}
            </div>
            <div className="quest-reward">+{q.reward} XP</div>
          </div>
        );
      })}

      <div className="quest-award-title" style={{ marginTop: 20 }}>
        {act.boss ? "☢️ FINAL BOSS" : allDone ? "🔥 ACT COMPLETE" : "⚡ IN PROGRESS"}
      </div>

      <button className="primary" onClick={onFinish}>
        {allDone ? "Belohnung holen" : "Weiter"}
      </button>
    </div>
  );
};