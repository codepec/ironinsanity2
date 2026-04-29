import React, { useEffect, useState } from "react";
import RankHeader from "../components/RankHeader";
import "./Settings.css";

export const Settings: React.FC = () => {
  const [totalXp, setTotalXp] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    setTotalXp(Number(localStorage.getItem("totalXp") || 0));
    setCurrentWeek(Number(localStorage.getItem("selectedWeek") || 1));
  }, []);

  const resetProgress = () => {
    if (window.confirm("Willst du wirklich alles zurücksetzen?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const setWeek = (week: number) => {
    localStorage.setItem("selectedWeek", week.toString());
    window.location.reload();
  };

  return (
    <div className="app-wrap">
      <RankHeader />

      <div className="settings-page">
        {/* HERO */}
        <header className="settings-hero">
          <div className="settings-hero-inner">
            <p className="settings-kicker">System</p>
            <h1 className="settings-title">Gildenhalle</h1>
            <p className="settings-lead">
              Verwalte deinen Fortschritt, wähle deine Kampfwoche und kontrolliere dein Schicksal.
            </p>
          </div>
        </header>

        {/* GLORY */}
        <section className="settings-glory">
          <div className="settings-glory-card">
            <div className="settings-glory-value accent">
              {totalXp.toLocaleString()}
            </div>
            <div className="settings-glory-label">Gesamt-XP</div>
          </div>

          <div className="settings-glory-card">
            <div className="settings-glory-value">{currentWeek}</div>
            <div className="settings-glory-label">Aktuelle Woche</div>
          </div>
        </section>

        {/* WEEK SELECT */}
        <section className="settings-section">
          <div className="settings-section-head">
            <h2 className="settings-section-title">Programmwahl</h2>
            <span className="settings-section-sub">Wähle deine Kampfwoche</span>
          </div>

          <div className="settings-week-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
              <button
                key={w}
                onClick={() => setWeek(w)}
                className={`settings-week ${
                  currentWeek === w ? "active" : ""
                }`}
              >
                Woche {w}
              </button>
            ))}
          </div>
        </section>

        {/* RESET */}
        <section className="settings-section">
          <div className="settings-section-head">
            <h2 className="settings-section-title">Speicher</h2>
            <span className="settings-section-sub">
              Vorsicht – irreversible Aktion
            </span>
          </div>

          <button onClick={resetProgress} className="settings-danger">
            🔥 Fortschritt zurücksetzen
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;