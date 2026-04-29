function ActiveQuests() {
  return (
    <div className="active-quests">
      <h3 className="section-title">Aktive Quests</h3>

      <div className="quest-card daily">
        <div className="quest-header">
          <div className="quest-type day">Tag</div>
          <h4 className="quest-name">Klauen der Nacht</h4>
        </div>
        <div className="quest-xp">+50 XP</div>
        <p className="quest-desc">
          Schließe 1 Workout ohne lange Pause.
        </p>
      </div>

      <div className="quest-card weekly">
        <div className="quest-header">
          <div className="title-block">
            <div className="quest-type weekly">Woche</div>
            <h4 className="quest-name">Klauen der Nacht</h4>
          </div>
          <div className="quest-progress">OPEN</div>
          <div className="quest-xp">+250 XP</div>
        </div>

        <p className="quest-desc">
          Schließe 5 Workouts ohne lange Pause.
        </p>
      </div>
    </div>
  );
}

export default ActiveQuests;