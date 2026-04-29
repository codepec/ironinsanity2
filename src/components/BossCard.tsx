function BossCard() {
  return (
    <div className="mission-card boss">
      <div className="card-header">
        <img className="icon" src="/src/assets/icons/ui/game-icons_daemon-skull.png" />
        <div className="title-block">
          <span className="quest-type mission">Boss</span>
          <h2 className="quest-name">Gesamtkörper</h2>
        </div>
        <div className="quest-xp">+4500 XP</div>
      </div>

      <p className="quest-desc">
        Schließe Push, Pull und Legs ab, um den Bosskampf zu starten.
      </p>

      <button className="btn-locked" disabled>
        🔒 Mission locked
      </button>
    </div>
  );
}

export default BossCard;