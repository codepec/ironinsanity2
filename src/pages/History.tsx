import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../store";
import RankHeader from "../components/RankHeader";
import "./History.css";

interface QuestSnapshot {
  questId: string;
  text: string;
  reward: number;
}

interface Session {
  date: number;
  day: string;
  xp: number;
  week: number;
  questClear?: {
    daily: QuestSnapshot[];
    weekly: QuestSnapshot[];
  };
}

interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: (ctx: StatsContext) => boolean;
}

interface StatsContext {
  missions: number;
  totalXp: number;
  longestStreak: number;
  maxWeek: number;
  uniqueWeeks: number;
  maxSingleXp: number;
}

function startOfLocalDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function longestConsecutiveDayStreak(timestamps: number[]): number {
  const days = [...new Set(timestamps.map(startOfLocalDay))].sort((a, b) => a - b);
  if (days.length === 0) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = (days[i] - days[i - 1]) / 86400000;
    if (gap === 1) cur++;
    else cur = 1;
    best = Math.max(best, cur);
  }
  return best;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_steel",
    name: "Erster Stahl",
    description: "Schließe deine erste Mission ab.",
    icon: "⚔️",
    unlocked: (c) => c.missions >= 1,
  },
  {
    id: "blood_rain",
    name: "Blutregen",
    description: "10 Feldzüge überstanden.",
    icon: "🩸",
    unlocked: (c) => c.missions >= 10,
  },
  {
    id: "endless_war",
    name: "Endloser Krieg",
    description: "25 Missionen gemeistert.",
    icon: "🔥",
    unlocked: (c) => c.missions >= 25,
  },
  {
    id: "xp_tide",
    name: "XP-Flut",
    description: "10.000 Gesamt-XP erreicht.",
    icon: "✨",
    unlocked: (c) => c.totalXp >= 10000,
  },
  {
    id: "xp_apocalypse",
    name: "XP-Apokalypse",
    description: "50.000 Gesamt-XP — du bist eine Waffe.",
    icon: "💀",
    unlocked: (c) => c.totalXp >= 50000,
  },
  {
    id: "ember_chain",
    name: "Glut-Kette",
    description: "3 Trainingstage in Folge.",
    icon: "⛓️",
    unlocked: (c) => c.longestStreak >= 3,
  },
  {
    id: "eternal_flame",
    name: "Ewige Flamme",
    description: "7 Tage am Stück trainiert.",
    icon: "🜂",
    unlocked: (c) => c.longestStreak >= 7,
  },
  {
    id: "week_collector",
    name: "Wochenjäger",
    description: "Missionen in 4 verschiedenen Programmwochen.",
    icon: "📅",
    unlocked: (c) => c.uniqueWeeks >= 4,
  },
  {
    id: "titan_week",
    name: "Woche des Titans",
    description: "Programmwoche 8 oder höher erreicht.",
    icon: "🗿",
    unlocked: (c) => c.maxWeek >= 8,
  },
  {
    id: "overkill",
    name: "Overkill",
    description: "Eine Mission mit 800+ XP beendet.",
    icon: "⚡",
    unlocked: (c) => c.maxSingleXp >= 800,
  },
];

function loadHistory(): Session[] {
  try {
    const saved = localStorage.getItem("workoutHistory");
    if (!saved) return [];
    const parsed = JSON.parse(saved) as unknown;
    return Array.isArray(parsed) ? (parsed as Session[]) : [];
  } catch {
    return [];
  }
}

function questRewards(clear: NonNullable<Session["questClear"]>) {
  const dailySum = clear.daily.reduce((s, q) => s + q.reward, 0);
  const weeklySum = clear.weekly.reduce((s, q) => s + q.reward, 0);
  return { dailySum, weeklySum, total: dailySum + weeklySum };
}

const QUEST_LIST_CAP = 5;

function QuestClearSection({
  qc,
  qr,
}: {
  qc: NonNullable<Session["questClear"]>;
  qr: ReturnType<typeof questRewards>;
}) {
  const { daily, weekly } = qc;

  const renderQuestList = (items: QuestSnapshot[], cap: number) => (
    <ul className="history-quest-list">
      {items.slice(0, cap).map((q) => (
        <li key={q.questId}>
          <span>{q.text}</span>
          <span>+{q.reward}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="history-quest-block">
      <div className="history-quest-head">Quest-Abschluss</div>
      <div className="history-quest-columns">
        {daily.length > 0 && (
          <div>
            <div className="history-quest-col-title">Tagesquests ({daily.length})</div>
            {daily.length <= QUEST_LIST_CAP ? (
              renderQuestList(daily, daily.length)
            ) : (
              <>
                {renderQuestList(daily, QUEST_LIST_CAP)}
                <details className="history-quest-details">
                  <summary>Weitere {daily.length - QUEST_LIST_CAP} Tagesquests</summary>
                  <ul className="history-quest-list history-quest-list--extra">
                    {daily.slice(QUEST_LIST_CAP).map((q) => (
                      <li key={q.questId}>
                        <span>{q.text}</span>
                        <span>+{q.reward}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </div>
        )}
        {weekly.length > 0 && (
          <div>
            <div className="history-quest-col-title">
              Wochenquests ({weekly.length}) · +{qr.weeklySum} XP
            </div>
            {weekly.length <= QUEST_LIST_CAP ? (
              renderQuestList(weekly, weekly.length)
            ) : (
              <>
                {renderQuestList(weekly, QUEST_LIST_CAP)}
                <details className="history-quest-details">
                  <summary>
                    Alle {weekly.length} Wochenquests anzeigen (Pool über alle Programmwochen)
                  </summary>
                  <ul className="history-quest-list history-quest-list--extra">
                    {weekly.slice(QUEST_LIST_CAP).map((q) => (
                      <li key={q.questId}>
                        <span>{q.text}</span>
                        <span>+{q.reward}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </div>
        )}
      </div>
      <p className="history-quest-summary">
        Quest-Belohnungen (freigeschaltete Pools): Tagesquests +{qr.dailySum} XP · Wochenquests +
        {qr.weeklySum} XP · Gesamt {qr.total} XP
      </p>
    </div>
  );
}

export const History: React.FC = () => {
  const { userProgress } = useApp();
  const [history, setHistory] = useState<Session[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const stats = useMemo(() => {
    const missions = history.length;
    const timestamps = history.map((e) => e.date);
    const longestStreak = longestConsecutiveDayStreak(timestamps);
    const maxWeek = history.reduce((m, e) => Math.max(m, Number(e.week || 0)), 0);
    const uniqueWeeks = new Set(history.map((e) => e.week)).size;
    const maxSingleXp = history.reduce((m, e) => Math.max(m, Number(e.xp || 0)), 0);

    const ctx: StatsContext = {
      missions,
      totalXp: userProgress.totalXp,
      longestStreak,
      maxWeek,
      uniqueWeeks,
      maxSingleXp,
    };
    return ctx;
  }, [history, userProgress.totalXp]);

  const unlockedCount = useMemo(
    () => ACHIEVEMENTS.filter((a) => a.unlocked(stats)).length,
    [stats]
  );

  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => b.date - a.date),
    [history]
  );

  const formatWhen = (ts: number) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="app-wrap">
      <RankHeader />

      <div className="history-page">
        <header className="history-hero">
          <div className="history-hero-inner">
            <p className="history-kicker">Chronik</p>
            <h1 className="history-title">Feldzüge & Ehren</h1>
            <p className="history-lead">
              Jede abgeschlossene Mission schreibt Geschichte: XP, Quests und Erfolge — dein Name
              steht in Flammen.
            </p>
          </div>
        </header>

        <section className="history-glory" aria-label="Gesamtstatistik">
          <div className="history-glory-card">
            <div className="history-glory-value">{stats.missions}</div>
            <div className="history-glory-label">Schlachten</div>
          </div>
          <div className="history-glory-card">
            <div className="history-glory-value accent">{stats.totalXp.toLocaleString()}</div>
            <div className="history-glory-label">Gesamt-XP</div>
          </div>
          <div className="history-glory-card">
            <div className="history-glory-value">{stats.longestStreak}</div>
            <div className="history-glory-label">Beste Serie (Tage)</div>
          </div>
          <div className="history-glory-card">
            <div className="history-glory-value">{unlockedCount}/{ACHIEVEMENTS.length}</div>
            <div className="history-glory-label">Erfolge</div>
          </div>
        </section>

        <section className="history-section" aria-labelledby="ach-heading">
          <div className="history-section-head">
            <h2 id="ach-heading" className="history-section-title">
              Erfolge
            </h2>
            <span className="history-section-sub">
              {unlockedCount} von {ACHIEVEMENTS.length} freigeschaltet
            </span>
          </div>
          <div className="history-ach-grid">
            {ACHIEVEMENTS.map((a) => {
              const ok = a.unlocked(stats);
              return (
                <div
                  key={a.id}
                  className={`history-ach ${ok ? "unlocked" : "locked"}`}
                  title={a.description}
                >
                  <span className="history-ach-badge">{ok ? "Frei" : "Gesperrt"}</span>
                  <div className="history-ach-icon" aria-hidden>
                    {a.icon}
                  </div>
                  <p className="history-ach-name">{a.name}</p>
                  <p className="history-ach-desc">{a.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="history-section" aria-labelledby="runs-heading">
          <div className="history-section-head">
            <h2 id="runs-heading" className="history-section-title">
              Letzte Missionen
            </h2>
            <span className="history-section-sub">Neueste oben</span>
          </div>

          {sortedHistory.length === 0 ? (
            <div className="history-empty">
              <strong>Noch keine Chronik</strong>
              Starte eine Mission, besiege die Gegner und kehre hierher zurück — dann lodert dein
              Eintrag.
            </div>
          ) : (
            <div className="history-runs">
              {sortedHistory.map((entry, i) => {
                const when = formatWhen(entry.date);
                const qc = entry.questClear;
                const qr = qc ? questRewards(qc) : null;

                return (
                  <article key={`${entry.date}-${i}`} className="history-run">
                    <div className="history-run-glow" aria-hidden />
                    <div className="history-run-body">
                      <div className="history-run-top">
                        <div>
                          <h3 className="history-run-title">
                            {entry.day} · Woche {entry.week}
                          </h3>
                          <p className="history-run-meta">
                            {when.date} · {when.time}
                          </p>
                        </div>
                        <div className="history-run-xp">+{entry.xp} XP</div>
                      </div>

                      {qc && qr && (qc.daily.length > 0 || qc.weekly.length > 0) && (
                        <QuestClearSection qc={qc} qr={qr} />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default History;
