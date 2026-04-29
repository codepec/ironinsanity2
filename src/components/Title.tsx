import { useEffect, useState } from "react";
import "./Title.css";
import workouts from "../data/workouts.json";
import { countAllExercises } from "../utils/missionUtils";

export default function Title() {
  const [subtitle, setSubtitle] = useState("");
  const [survivalRate, setSurvivalRate] = useState("");

  useEffect(() => {
    updateTitle();
  }, []);

  const updateTitle = () => {
    const week = parseInt(localStorage.getItem("selectedWeek") || "1");
    const progress = JSON.parse(
      localStorage.getItem("missionProgress") || "{}"
    );

    const weekProgress = progress[week] || {};
    const completed = Object.values(weekProgress).filter(Boolean).length;

    const totalMissions = countAllExercises(workouts);

    setSubtitle(`8 Wochen Hölle | ${totalMissions} Missionen | 8 Todesbringer`);

    // 💀 SURVIVAL RATE (steigend mit Progress)
    const progressRatio = completed / totalMissions;

    const minRate = 5;   // Start bei 5%
    const maxRate = 100; // Max 100%

    const rate = minRate + (maxRate - minRate) * progressRatio;

    setSurvivalRate(`ÜBERLEBENSRATE: ${rate.toFixed(1)}%`);
  };

  return (
    <div className="title-container">
      <h1 className="title-glitch" data-text="IRON INSANITY">
        IRON INSANITY
      </h1>

      <img
        src="/src/assets/icons/Line3.png"
        alt="Decorative Line"
        className="decorative-line"
      />

      <p className="subtitle">{subtitle}</p>

      <div className="alert-container">
        <p className="alert">{survivalRate}</p>
      </div>
    </div>
  );
}