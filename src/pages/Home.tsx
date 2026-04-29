// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useApp, getTotalXpForDay, getBossData, getMainQuestline } from "../store";
import WeekProgress from "../components/WeekProgress";
import QuestCard from "../components/QuestCard";
import RankHeader from "../components/RankHeader";
import WeeklyQuests from "../components/WeeklyQuests";
import DailyQuests from "../components/DailyQuests";
import Progress from "../components/Progress";
import Title from "../components/Title";

function Home() {
  const navigate = useNavigate();
  const { 
    userProgress, 
    missionProgress, 
    mainQuests,
    startWorkout 
  } = useApp();

  const week = userProgress.currentWeek;
  const weekProgress = missionProgress[week] || {};

  const isPushDone = weekProgress.Push;
  const isPullDone = weekProgress.Pull;
  const isLegsDone = weekProgress.Legs;

  const isLocked = (type: string) => {
    if (type === "Push") return false;
    if (type === "Pull") return !isPushDone;
    if (type === "Legs") return !isPullDone;
    return false;
  };

  const isBossLocked = !(isPushDone && isPullDone && isLegsDone);

  // =============================
  // 🏋️ Workout Start
  // =============================
  const startMission = (type: string) => {
    if (type === "Boss") {
      startWorkout(week, "Boss");
    } else {
      startWorkout(week, type as "Push" | "Pull" | "Legs");
    }
    navigate("/workout");
  };

  // =============================
  // 📦 Current Week Data
  // =============================
  const mainQuestline = getMainQuestline();
  const currentMainQuest = mainQuests.find(q => q.week === week);
  
  // =============================
  // ⚔️ Missions Config
  // =============================
  const missions = [
    {
      type: "Push",
      title: "Push: Brust & Trizeps",
      description: "Zerstöre deine Brust und Trizeps",
      icon: "/src/assets/icons/ui/game-icons_burning-sword.svg",
    },
    {
      type: "Pull",
      title: "Pull: Rücken & Bizeps",
      description: "Stärke Rücken & Bizeps",
      icon: "/src/assets/icons/ui/game-icons_burning-axe.svg",
    },
    {
      type: "Legs",
      title: "Legs: Beine & Po",
      description: "Trainiere Beine & Po",
      icon: "/src/assets/icons/ui/game-icons_burning-axe.svg",
    },
  ];

  // =============================
  // 🏆 Render
  // =============================
  const bossData = getBossData(week);

  return (
    <div className="app-wrap">
      <RankHeader />
      <Title />
      <Progress />

      {/* 🏆 MAIN QUEST */}
      <QuestCard
        type="main"
        title={mainQuestline.title}
        xp={currentMainQuest?.reward || 0}
        description={currentMainQuest?.story || mainQuestline.description}
        icon="/src/assets/icons/ui/game-icons_daemon-skull.png"
      />

      <WeekProgress 
        currentWeek={week} 
        currentDay={Object.values(weekProgress).filter(Boolean).length + 1}
        progressPercent={(Object.values(weekProgress).filter(Boolean).length / 3) * 100}
      />

      {/* ⚔️ MISSIONS */}
      {missions.map((m) => {
        const totalXP = getTotalXpForDay(week, m.type as "Push" | "Pull" | "Legs");
        
        return (
          <QuestCard
            key={m.type}
            type="mission"
            title={m.title}
            description={m.description}
            xp={totalXP}
            icon={m.icon}
            onStart={() => startMission(m.type)}
            disabled={isLocked(m.type)}
          />
        );
      })}

      {/* 👹 BOSS */}
      {bossData && (
        <QuestCard
          type="boss"
          title={`Boss: ${bossData.name}`}
          description="Besiege den Boss in einem epischen Kampf!"
          xp={getTotalXpForDay(week, "Boss")}
          icon="/src/assets/icons/ui/game-icons_daemon-skull.png"
          onStart={() => startMission("Boss")}
          disabled={isBossLocked}
        />
      )}

      {/* 🔹 Daily Quests */}
      <DailyQuests />

      {/* 🔹 Weekly Quests */}
      <WeeklyQuests />
    </div>
  );
}

export default Home;