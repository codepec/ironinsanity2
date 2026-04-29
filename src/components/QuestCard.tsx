import React from "react";
import "./QuestCard.css";

export type QuestType = "main" | "boss" | "mission" | "daily" | "weekly";

interface QuestCardProps {
  type: QuestType;
  title: string;
  xp: number;
  description: string;
  icon: string;
  onStart?: () => void;
  disabled?: boolean;
}

const typeLabels: Record<QuestType, string> = {
  main: "Hauptquest",
  boss: "Boss",
  mission: "Mission",
  daily: "Tagesquest",
  weekly: "Wochenquest",
};

const QuestCard: React.FC<QuestCardProps> = ({
  type,
  title,
  xp,
  description,
  icon,
  onStart,
  disabled = false,
}) => {
  const isInteractive = type === "mission" || type === "boss";

  return (
    <div className={`card ${type}`}>
      <div className="card-header">
        <div className="left">
          <img className="icon" src={icon} alt="icon" />

          <div className="title-block">
            <div className="top-row">
              <span className={`quest-type ${type}`}>
                {typeLabels[type]}
              </span>

            </div>

            <h2 className="quest-name">{title}</h2>
          </div>
        </div>

        <div className="quest-xp">+{xp} XP</div>
      </div>

      <p className="quest-desc">{description}</p>

      {isInteractive && (
        <button
          className="btn-primary"
          disabled={disabled}
          onClick={onStart}
        >
          🔥 Starten
        </button>
      )}
    </div>
  );
};

export default QuestCard;