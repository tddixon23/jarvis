"use client";

import Waveform from "./Waveform";
import HudBorder from "./HudBorder";

type Props = {
  speaking: boolean;
  listening: boolean;
  status: string;
};

export default function VoiceBox({ speaking, listening, status }: Props) {
  const active = speaking || listening;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Arc reactor ring */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-32 h-32 rounded-full border-2 transition-all duration-500 ${
            listening
              ? "border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)]"
              : speaking
              ? "border-cyan-400 shadow-[0_0_30px_rgba(0,212,255,0.7)]"
              : "border-cyan-800 shadow-[0_0_10px_rgba(0,212,255,0.2)]"
          }`}
        />
        <div
          className={`absolute w-20 h-20 rounded-full border transition-all duration-500 ${
            listening
              ? "border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.4)]"
              : speaking
              ? "border-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.4)]"
              : "border-cyan-900"
          }`}
        />
        {/* Pulsing core */}
        <div
          className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
            listening
              ? "bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.9)] scale-110"
              : speaking
              ? "bg-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.9)] animate-pulse"
              : "bg-cyan-900"
          }`}
        />
        {/* J letter */}
        <span
          className={`absolute text-xl font-bold tracking-widest select-none transition-colors duration-300 ${
            active ? "text-slate-900" : "text-cyan-700"
          }`}
        >
          J
        </span>
      </div>

      {/* Status label */}
      <div className="text-xs font-mono tracking-[0.25em] text-cyan-500 uppercase h-4">
        {status}
      </div>

      {/* Waveform */}
      <HudBorder className="w-80 px-3 py-2 bg-slate-900/60">
        <Waveform active={active} />
      </HudBorder>
    </div>
  );
}
