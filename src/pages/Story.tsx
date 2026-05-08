import { useState } from "react";
import "./story.css";
import storyData from "../data/story.json";

type Screen =
  | "intro"
  | "chapters"
  | "chapterDetail"
  | "missions"
  | "missionDetail";

type Objective = {
  type: string;
  target: number;
  workoutType?: string;
};

type Chapter = {
  id: number;
  title: string;
  week: number;
  description: string;
  boss: {
    name: string;
    hp: number;
  };
  objectives: Objective[];
  rewards: {
    xp?: number;
    gold?: number;
    item?: string;
    skill?: string;
  };
};

export default function Story() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const chapters: Chapter[] = storyData.chapters;

  const renderObjective = (obj: Objective, index: number) => {
    switch (obj.type) {
      case "complete_workouts":
        return <div key={index}>☐ {obj.target} Workouts abschließen</div>;
      case "total_xp":
        return <div key={index}>☐ {obj.target} XP sammeln</div>;
      case "total_volume":
        return <div key={index}>☐ {obj.target} kg Volumen erreichen</div>;
      case "complete_type":
        return (
          <div key={index}>
            ☐ {obj.workoutType} Workout abschließen
          </div>
        );
      case "weekly_streak":
        return <div key={index}>☐ {obj.target} Tage Streak</div>;
      default:
        return <div key={index}>☐ Ziel erfüllen</div>;
    }
  };

  return (


    <div className="story-wrapper">
    
    {screen !== "intro" && (
      <>
        <div className="story-header">Story</div>

        <div className="story-nav">
          <button onClick={() => setScreen("intro")}>Intro</button>
          <button onClick={() => setScreen("chapters")}>Kapitel</button>
          <button onClick={() => setScreen("chapterDetail")}>Detail</button>
          <button onClick={() => setScreen("missions")}>Missionen</button>
          <button onClick={() => setScreen("missionDetail")}>Mission</button>
        </div>
      </>
    )}

      <div className="story-screen">


        {/* INTRO */}
        {screen === "intro" && (
          <div className="screen">
            <div className="title">
              <h1>Story Modus</h1>
            </div>
            <div className="title">
            <h2>Deine Reise. Dein Vermächtnis.</h2>
            </div>
           
   

           <div className="intro-text">
                  <p>
              Die Welt wird vom Infernal Demon verschlungen. Nur durch Disziplin,
              Stärke und Training kannst du ihn besiegen und das Land retten.
            </p>
            </div>

            <div className="intro-image">
              <img className="setting-image"
                src="src\assets\images\enemies\setting3.PNG"
                alt="Settings"
              />
            </div>

            <div className="intro-container">

              <div className="intro-text-h2">
              <h2>Kapitel & Missionen</h2>
              </div>

              <div className="intro-text">
              <p>
                Erlebe eine epische Geschichte in mehreren Kapiteln.
                Trainiere, um stärker zu werden und die Herausforderungen zu meistern.
              </p>
              </div>

            </div>

            <div className="intro-container">

              <div className="intro-text-h2">
              <h2>Bosse</h2>
              </div>

              <div className="intro-text">
              <p>
                Besiege mächtige Bosse und befreie die Welt von der Dunkelheit. 
                Jeder Boss hat einzigartige Angriffe und Schwächen, die du lernen musst, um zu gewinnen.
              </p>
              </div>

            </div>

            <div className="intro-container">

              <div className="intro-text-h2">
              <h2>Belohnungen</h2>
              </div>

              <div className="intro-text">
              <p>
                Erhalte legendäre Belohnungen für das Besiegen von Bossen.
                Steigere deine Fähigkeiten, sammle mächtige Gegenstände und werde zum ultimativen Helden.
              </p>
              </div>

            </div>

            <div className="intro-container">

              <div className="intro-text-h2">
              <h2>Entscheidungen</h2>
              </div>

              <div className="intro-text">
              <p>
                Treffe entscheidende Entscheidungen, die dein Schicksal prägen.
                Jede Wahl hat Konsequenzen, die sich auf die Geschichte auswirken.
              </p>
              </div>

            </div>

            <button
              className="primary"
              onClick={() => setScreen("chapters")}
            >
              Start
            </button>
          </div>
        )}

        {/* CHAPTER LIST */}
        {screen === "chapters" && (
          <div className="screen">
            <h2>Kampagne</h2>

            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="chapter"
                onClick={() => {
                  setSelectedChapter(chapter);
                  setScreen("chapterDetail");
                }}
              >
                Kapitel {chapter.id} – {chapter.title}
              </div>
            ))}
          </div>
        )}

        {/* CHAPTER DETAIL */}
        {screen === "chapterDetail" && selectedChapter && (
          <div className="screen">
            <h2>KAPITEL {selectedChapter.id}</h2>
            <h1>{selectedChapter.title}</h1>

            <p>{selectedChapter.description}</p>

            <div className="boss">
              👹 Boss: {selectedChapter.boss.name} (HP:{" "}
              {selectedChapter.boss.hp})
            </div>

            <button
              className="primary"
              onClick={() => setScreen("missions")}
            >
              Missionen anzeigen
            </button>
          </div>
        )}

        {/* MISSIONS */}
        {screen === "missions" && selectedChapter && (
          <div className="screen">
            <h2>Missionen</h2>

            {selectedChapter.objectives.map((obj, i) =>
              renderObjective(obj, i)
            )}

            <button
              className="primary"
              onClick={() => setScreen("missionDetail")}
            >
              Details
            </button>
          </div>
        )}

        {/* MISSION DETAIL */}
        {screen === "missionDetail" && selectedChapter && (
          <div className="screen">
            <h2>Mission Detail</h2>

            <h3>{selectedChapter.title}</h3>
            <p>{selectedChapter.description}</p>

            <div className="objectives">
              {selectedChapter.objectives.map((obj, i) =>
                renderObjective(obj, i)
              )}
            </div>

            <div className="rewards">
              {selectedChapter.rewards.xp && (
                <span>XP {selectedChapter.rewards.xp}</span>
              )}
              {selectedChapter.rewards.gold && (
                <span>Gold {selectedChapter.rewards.gold}</span>
              )}
              {selectedChapter.rewards.item && (
                <span>{selectedChapter.rewards.item}</span>
              )}
              {selectedChapter.rewards.skill && (
                <span>{selectedChapter.rewards.skill}</span>
              )}
            </div>

            <button className="primary">Zur Mission</button>
          </div>
        )}
      </div>
    </div>
  );
}