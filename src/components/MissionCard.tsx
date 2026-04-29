type Props = {
  title: string;
  description: string;
  xp: string;
  icon: string;
  onStart: () => void;
};

function MissionCard({ title, description, xp, icon, onStart }: Props) {
  return (
    <div className="mission-card">
      <div className="card-header">
        <img className="icon" src={icon} />
        <div className="title-block">
          <span className="quest-type mission">Mission</span>
          <h2 className="quest-name">{title}</h2>
        </div>
        <div className="quest-xp">{xp}</div>
      </div>

      <p className="quest-desc">{description}</p>

      <button className="btn-primary" onClick={onStart}>
        🔥 Mission starten
      </button>
    </div>
  );
}

export default MissionCard;