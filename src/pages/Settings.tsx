import React, { useEffect, useState } from "react";
import RankHeader from "../components/RankHeader";
import "./Settings.css";

type Units = "metric" | "imperial";

type Profile = {
  goal: "Muskelaufbau" | "Abnehmen" | "Fitness";
  weight: number;
  height: number;
  birthdate: string;
  gender: "Männlich" | "Weiblich" | "Divers";
};

export const Settings: React.FC = () => {

  const [currentWeek, setCurrentWeek] = useState<number>(1);

  const [units, setUnits] = useState<Units>("metric");

  const [profile, setProfile] = useState<Profile>({
    goal: "Muskelaufbau",
    weight: 85.2,
    height: 1.8,
    birthdate: "1990-03-15",
    gender: "Männlich",
  });

  const [editField, setEditField] = useState<null | keyof Profile>(null);
  const [tempValue, setTempValue] = useState<any>("");

  const [showConfirm, setShowConfirm] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
   
    const week = localStorage.getItem("selectedWeek");
    const savedProfile = localStorage.getItem("profile");
    const savedUnits = localStorage.getItem("units");

  
    setCurrentWeek(week ? Number(week) : 1);

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedUnits) setUnits(savedUnits as Units);
  }, []);

  /* SAVE FIELD */
  const saveField = () => {
    const updated = { ...profile, [editField!]: tempValue };
    setProfile(updated);
    localStorage.setItem("profile", JSON.stringify(updated));
    setEditField(null);
  };

  /* UNITS TOGGLE */
  const toggleUnits = () => {
    const newUnits: Units = units === "metric" ? "imperial" : "metric";

    let weight = profile.weight;
    let height = profile.height;

    if (newUnits === "imperial") {
      weight = +(weight * 2.20462).toFixed(1);
      height = +(height * 100).toFixed(0);
    } else {
      weight = +(weight / 2.20462).toFixed(1);
      height = +(height / 100).toFixed(2);
    }

    const updated = { ...profile, weight, height };

    setUnits(newUnits);
    setProfile(updated);

    localStorage.setItem("units", newUnits);
    localStorage.setItem("profile", JSON.stringify(updated));
  };

  const resetProgress = () => {
    localStorage.clear();
    window.location.reload();
  };

  const weightUnit = units === "metric" ? "kg" : "lbs";
  const heightUnit = units === "metric" ? "m" : "cm";

  return (
      <div className="app-wrap">
        <RankHeader />

    <div className="settings-root">
      <div className="settings-container">
     



      {/* AVATAR HEADER */}
      <div className="profile-header">
        <img
          className="avatar"
          src="src\assets\images\chars\chartest.png"
          alt="avatar"
        />

        <div>
          <div className="name">Krieger</div>
          <div className="sub">ID: #IN2-87-LEG</div>
        </div>
      </div>

      {/* STATS (XP + WEEK FIX) */}

 

        <div className="row">
          <span>Aktuelle Woche</span>
          <span>{currentWeek}</span>
        </div>
    
      {/* PROFILE */}
      <div className="group">

        <div className="row clickable" onClick={() => {
          setEditField("goal");
          setTempValue(profile.goal);
        }}>
          <span>Ziel</span>
          <div className="right">
            <span>{profile.goal}</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable" onClick={() => {
          setEditField("weight");
          setTempValue(profile.weight);
        }}>
          <span>Gewicht</span>
          <div className="right">
            <span>{profile.weight} {weightUnit}</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable" onClick={() => {
          setEditField("height");
          setTempValue(profile.height);
        }}>
          <span>Größe</span>
          <div className="right">
            <span>{profile.height} {heightUnit}</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable" onClick={() => {
          setEditField("birthdate");
          setTempValue(profile.birthdate);
        }}>
          <span>Geburtsdatum</span>
          <div className="right">
            <span>{profile.birthdate}</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable" onClick={() => {
          setEditField("gender");
          setTempValue(profile.gender);
        }}>
          <span>Geschlecht</span>
          <div className="right">
            <span>{profile.gender}</span>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="group">
        <div className="row clickable" onClick={toggleUnits}>
          <span>Einheiten</span>
          <div className="right">
            <span>{units === "metric" ? "kg / m" : "lbs / cm"}</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable">
          <span>Erinnerungen</span>
          <div className="right">
            <span>Ein</span>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable">
          <span>Sprache</span>
          <div className="right">
            <span>Deutsch</span>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {/* SUPPORT */}
      <div className="group">
        <div className="row clickable">
          <span>Hilfe & Support</span>
          <div className="right">
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable">
          <span>Datenschutz</span>
          <div className="right">
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="row clickable">
          <span>Über die App</span>
          <div className="right">
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {/* DANGER */}
      <div className="group danger">
        <button onClick={() => setShowConfirm(true)}>
          Fortschritt löschen
        </button>
      </div>

      {/* RESET MODAL */}
      {showConfirm && (
        <div className="modal">
          <div className="modal-box">
            <h3>Fortschritt löschen?</h3>

            <button className="danger-btn" onClick={resetProgress}>
              Löschen
            </button>

            <button onClick={() => setShowConfirm(false)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editField && (
        <div className="modal">
          <div className="modal-box">
            <h3>{editField} bearbeiten</h3>

            {(editField === "weight" || editField === "height") && (
              <input
                type="number"
                step="0.1"
                className="input"
                value={tempValue}
                onChange={(e) => setTempValue(Number(e.target.value))}
              />
            )}

            {editField === "birthdate" && (
              <input
                type="date"
                className="input"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            )}

            {editField === "gender" && (
              <select
                className="input"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              >
                <option>Männlich</option>
                <option>Weiblich</option>
                <option>Divers</option>
              </select>
            )}

                        {editField === "goal" && (
              <select
                className="input"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              >
                <option>Muskelaufbau</option>
                <option>Abnehmen</option>
                <option>Fitness</option>
              </select>
            )}

            <button className="save-btn" onClick={saveField}>
              Speichern
            </button>

            <button onClick={() => setEditField(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  </div>

</div>
  );
};

export default Settings;