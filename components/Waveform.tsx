"use client";

import { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  color?: string;
  /** "listen" = wide slow arcs (mic input), "speak" = tight fast bursts (voice output) */
  mode?: "listen" | "speak";
};

export default function Waveform({ active, color = "#00d4ff", mode = "speak" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!active) {
        // Subtle idle heartbeat — single low sine
        offsetRef.current += 0.018;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 2 + offsetRef.current) * (h * 0.06);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      if (mode === "listen") {
        // Wide, slow concentric arcs — like a mic picking up sound
        offsetRef.current += 0.04;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const a1 = Math.sin((x / w) * Math.PI * 3 + offsetRef.current) * (h * 0.30);
          const a2 = Math.sin((x / w) * Math.PI * 5 + offsetRef.current * 0.8) * (h * 0.10);
          const y = h / 2 + a1 + a2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Tight, energetic multi-frequency bursts — JARVIS speaking
        offsetRef.current += 0.07;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const f1 = Math.sin((x / w) * Math.PI * 7  + offsetRef.current)        * (h * 0.26);
          const f2 = Math.sin((x / w) * Math.PI * 14 + offsetRef.current * 1.5)  * (h * 0.11);
          const f3 = Math.sin((x / w) * Math.PI * 22 + offsetRef.current * 0.65) * (h * 0.05);
          const y = h / 2 + f1 + f2 + f3;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, color, mode]);

  return (
    <canvas ref={canvasRef} width={320} height={64} className="w-full h-16" />
  );
}
