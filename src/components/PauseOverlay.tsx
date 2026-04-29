// src/components/PauseOverlay.tsx
import React, { useEffect, useRef } from "react";
import "./PauseOverlay.css";

type Props = {
  seconds: number;
  onDone: () => void;
  title?: string;
  subtitle?: string;
};

export const PauseOverlay: React.FC<Props> = ({
  seconds,
  onDone,
  title = "Atempause",
  subtitle = "Nächster Hieb kommt.",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let r = seconds;
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    const rad = 80;
    const c = 90;

    const draw = () => {
      if (!ctx) return;

      const p = (seconds - r) / seconds;

      ctx.clearRect(0, 0, 180, 180);

      ctx.beginPath();
      ctx.arc(c, c, rad, 0, 2 * Math.PI);
      ctx.strokeStyle = "#3f1218";
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c, c, rad, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * p);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 12;
      ctx.shadowColor = "rgba(239,68,68,0.6)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#fecaca";
      ctx.font = "bold 36px Orbitron, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.max(r, 0).toString(), c, c);
    };

    draw();

    const interval = setInterval(() => {
      r--;
      if (r < 0) {
        clearInterval(interval);
        onDone();
      } else {
        draw();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onDone]);

  return (
    <div className="pause-overlay pause-overlay--battle">
      <div className="pause-overlay-text">
        <p className="pause-overlay-title">{title}</p>
        <p className="pause-overlay-sub">{subtitle}</p>
      </div>
      <canvas ref={canvasRef} width={180} height={180} />
      <button type="button" className="skip-button" onClick={onDone}>
        Überspringen
      </button>
    </div>
  );
};
