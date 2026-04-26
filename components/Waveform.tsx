"use client";

import { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  color?: string;
};

export default function Waveform({ active, color = "#00d4ff" }: Props) {
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
        // Flat idle line
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      offsetRef.current += 0.06;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;

      for (let x = 0; x < w; x++) {
        const freq1 = Math.sin((x / w) * Math.PI * 6 + offsetRef.current) * (h * 0.28);
        const freq2 = Math.sin((x / w) * Math.PI * 12 + offsetRef.current * 1.4) * (h * 0.12);
        const freq3 = Math.sin((x / w) * Math.PI * 20 + offsetRef.current * 0.7) * (h * 0.06);
        const y = h / 2 + freq1 + freq2 + freq3;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, color]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={64}
      className="w-full h-16"
    />
  );
}
