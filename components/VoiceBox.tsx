"use client";

import Waveform from "./Waveform";
import HudBorder from "./HudBorder";

type Props = {
  speaking: boolean;
  listening: boolean;
  thinking: boolean;
  status: string;
};

export default function VoiceBox({ speaking, listening, thinking, status }: Props) {
  const active = speaking || listening || thinking;

  // Waveform color per state
  const waveColor = listening ? "#4ade80" : thinking ? "#a855f7" : "#00d4ff";

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* ── Orb ─────────────────────────────── */}
      <div className="relative flex items-center justify-center w-52 h-52">

        {/* LISTENING: three expanding sonar rings */}
        {listening && (
          <>
            <div className="absolute w-52 h-52 rounded-full border border-green-400/70 animate-ripple1" />
            <div className="absolute w-52 h-52 rounded-full border border-green-400/50 animate-ripple2" />
            <div className="absolute w-52 h-52 rounded-full border border-green-300/30 animate-ripple3" />
          </>
        )}

        {/* SPEAKING: faint outer ripples (energetic, faster) */}
        {speaking && (
          <>
            <div className="absolute w-52 h-52 rounded-full border border-cyan-400/40 animate-ripple1" />
            <div className="absolute w-52 h-52 rounded-full border border-purple-500/20 animate-ripple2" />
          </>
        )}

        {/* Outermost dashed ring — spins when active */}
        <div
          className={`absolute w-48 h-48 rounded-full border-2 border-dashed transition-all duration-700 ${
            speaking
              ? "border-cyan-400/70 animate-spin-cw shadow-[0_0_20px_rgba(0,212,255,0.25)]"
              : listening
              ? "border-green-400/60 shadow-[0_0_18px_rgba(74,222,128,0.3)]"
              : thinking
              ? "border-purple-500/60 animate-spin-cw shadow-[0_0_16px_rgba(168,85,247,0.3)]"
              : "border-cyan-900/30"
          }`}
        />

        {/* Counter-rotating segmented ring — speaking only */}
        {(speaking || thinking) && (
          <div
            className={`absolute w-40 h-40 rounded-full border transition-all duration-500 animate-spin-ccw ${
              speaking
                ? "border-cyan-500/50"
                : "border-purple-500/40"
            }`}
            style={{ borderStyle: "dashed", borderWidth: "1px" }}
          />
        )}

        {/* Main solid ring */}
        <div
          className={`absolute w-36 h-36 rounded-full border-2 transition-all duration-500 ${
            listening
              ? "border-green-400 shadow-[0_0_28px_rgba(74,222,128,0.55)]"
              : speaking
              ? "border-cyan-400 shadow-[0_0_28px_rgba(0,212,255,0.65)]"
              : thinking
              ? "border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-thinking-glow"
              : "border-cyan-900/50 shadow-[0_0_8px_rgba(0,212,255,0.08)]"
          }`}
        />

        {/* Inner accent ring */}
        <div
          className={`absolute w-24 h-24 rounded-full border transition-all duration-500 ${
            listening ? "border-green-500/70"
            : speaking ? "border-cyan-500/60 border-dashed"
            : thinking ? "border-purple-500/50"
            : "border-cyan-900/30"
          }`}
        />

        {/* Core orb */}
        <div
          className={`absolute w-14 h-14 rounded-full transition-all duration-300 ${
            listening
              ? "bg-green-400 shadow-[0_0_28px_rgba(74,222,128,0.95)] scale-110 animate-pulse"
              : speaking
              ? "bg-cyan-400 shadow-[0_0_28px_rgba(0,212,255,0.95)] animate-jarvis-pulse"
              : thinking
              ? "bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.85)] animate-thinking-glow"
              : "bg-slate-900 border border-cyan-900/50 animate-breathe"
          }`}
        />

        {/* J glyph */}
        <span
          className={`absolute text-2xl font-bold font-mono tracking-widest select-none transition-all duration-300 ${
            listening ? "text-slate-900"
            : speaking ? "text-slate-900"
            : thinking ? "text-purple-100"
            : "text-cyan-700"
          }`}
        >
          J
        </span>

        {/* Tick marks around the outer ring (decorative) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className={`absolute w-0.5 h-2 rounded-full transition-colors duration-500 ${
              active ? (listening ? "bg-green-500/60" : speaking ? "bg-cyan-500/60" : "bg-purple-500/60") : "bg-cyan-900/40"
            }`}
            style={{
              transform: `rotate(${deg}deg) translateY(-96px)`,
              transformOrigin: "center 96px",
            }}
          />
        ))}
      </div>

      {/* ── Status label ─────────────────────── */}
      <div
        className={`text-xs font-mono tracking-[0.25em] uppercase h-4 transition-colors duration-300 ${
          listening ? "text-green-400"
          : speaking ? "text-cyan-400"
          : thinking ? "text-purple-400"
          : "text-cyan-800"
        }`}
      >
        {status}
      </div>

      {/* ── Waveform ─────────────────────────── */}
      <HudBorder className="w-full px-3 py-2 bg-slate-900/60">
        <Waveform active={active} color={waveColor} mode={listening ? "listen" : "speak"} />
      </HudBorder>
    </div>
  );
}
