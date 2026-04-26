"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VoiceBox from "@/components/VoiceBox";
import ChatDialog from "@/components/ChatDialog";
import InputBar from "@/components/InputBar";
import HudBorder from "@/components/HudBorder";
import { initVoice, speak, stopSpeaking, startListening } from "@/lib/voice";
import type { ChatMessage } from "@/components/ChatDialog";

type Status = "idle" | "thinking" | "speaking" | "listening";

const MODULE_TAGS = [
  { label: "Social Media", color: "text-purple-400 border-purple-800", hint: "Draft a post for Instagram about my brand." },
  { label: "Brand Outreach", color: "text-amber-400 border-amber-800", hint: "Write a cold email to a potential sponsor for my brand." },
  { label: "Business Org", color: "text-green-400 border-green-800", hint: "Help me organize my business tasks and build a priority list." },
];

const QUICK_ACTIONS = [
  "Draft this week's content calendar",
  "Write a LinkedIn post about my brand",
  "Prioritize my top 3 tasks today",
  "Draft a partnership pitch email",
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const bootedRef = useRef(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMouse({
      x: ((e.clientX - cx) / cx) * 7,
      y: ((e.clientY - cy) / cy) * 7,
    });
  }, []);

  const orbStyle = useMemo(() => ({
    transform: `translate(${mouse.x}px, ${mouse.y}px)`,
    transition: "transform 0.25s ease-out",
  }), [mouse]);

  const sendMessage = useCallback(async (text: string, history?: ChatMessage[]) => {
    if (status === "thinking" || status === "speaking") return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const current = history ?? messages;
    const next = [...current, userMsg];

    setMessages(next);
    setStreaming("");
    setStatus("thinking");
    stopSpeaking();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreaming(full);
      }

      const assistantMsg: ChatMessage = { role: "assistant", content: full };
      setMessages([...next, assistantMsg]);
      setStreaming("");

      setStatus("speaking");
      speak(full, () => setStatus("speaking"), () => setStatus("idle"));
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }, [messages, status]);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    initVoice();
    sendMessage("Hello. Introduce yourself briefly and tell me the three things you can help me with today.", []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = useCallback(() => {
    if (status === "listening") {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setStatus("idle");
      return;
    }

    stopSpeaking();
    setStatus("listening");

    const rec = startListening(
      (transcript) => {
        recognitionRef.current = null;
        sendMessage(transcript);
      },
      () => {
        recognitionRef.current = null;
        setStatus((s) => s === "listening" ? "idle" : s);
      }
    );

    if (!rec) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      setStatus("idle");
      return;
    }
    recognitionRef.current = rec;
  }, [status, sendMessage]);

  const statusLabel =
    status === "thinking" ? "Processing…"
    : status === "speaking" ? "J.A.R.V.I.S. Online"
    : status === "listening" ? "Listening…"
    : "Standby";

  const busy = status === "thinking" || status === "speaking";

  return (
    <main onMouseMove={handleMouseMove} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.15) 2px, rgba(0,212,255,0.15) 4px)",
        }}
      />
      {/* Hex grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V17L28 0l28 17v33z' fill='none' stroke='%2300d4ff' stroke-width='0.5'/%3E%3Cpath d='M28 100L0 83V50l28-17 28 17v33z' fill='none' stroke='%2300d4ff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-cyan-900/40"
        style={{ background: "linear-gradient(90deg, rgba(2,8,23,0.95) 0%, rgba(15,5,30,0.95) 50%, rgba(2,8,23,0.95) 100%)" }}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_6px] transition-colors duration-500 ${
            status === "listening" ? "bg-green-400 shadow-green-400/80"
            : status === "thinking" ? "bg-purple-400 shadow-purple-400/80"
            : status === "speaking" ? "bg-cyan-400 shadow-cyan-400/80"
            : "bg-cyan-800 shadow-cyan-800/50"
          }`} />
          <span className="font-mono text-sm tracking-[0.3em] uppercase"
            style={{ background: "linear-gradient(90deg, #00d4ff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            J.A.R.V.I.S.
          </span>
          <span className="hidden sm:block text-[10px] font-mono tracking-widest text-cyan-900 uppercase ml-2">
            Just A Rather Very Intelligent System
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
          <span className={`transition-colors duration-300 ${
            status === "listening" ? "text-green-400"
            : status === "thinking" ? "text-purple-400"
            : status === "speaking" ? "text-cyan-400"
            : "text-cyan-900"
          }`}>{statusLabel}</span>
          <span className="text-cyan-900">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short", day: "2-digit", month: "short", year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="relative z-20 flex flex-1 gap-4 p-4 overflow-hidden" style={{ height: "calc(100vh - 53px)" }}>
        {/* Left panel */}
        <div className="flex flex-col gap-4 w-72 shrink-0 overflow-y-auto">
          <HudBorder className="bg-slate-950/70 p-6 flex flex-col items-center gap-4" style={orbStyle}>
            <VoiceBox
              speaking={status === "speaking"}
              listening={status === "listening"}
              thinking={status === "thinking"}
              status={statusLabel}
            />
          </HudBorder>

          <HudBorder className="bg-slate-950/70 p-4">
            <p className="text-[10px] font-mono tracking-widest text-cyan-800 uppercase mb-3">Active Modules</p>
            <div className="flex flex-col gap-2">
              {MODULE_TAGS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => sendMessage(m.hint)}
                  disabled={busy}
                  className={`text-left px-3 py-1.5 rounded border text-xs font-mono tracking-wide ${m.color} bg-slate-900/60 hover:bg-slate-800/60 transition-colors disabled:opacity-40`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </HudBorder>

          <HudBorder className="bg-slate-950/70 p-4">
            <p className="text-[10px] font-mono tracking-widest text-cyan-800 uppercase mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  disabled={busy}
                  className="text-left text-[11px] font-mono text-cyan-700 hover:text-cyan-400 transition-colors disabled:opacity-40"
                >
                  › {action}
                </button>
              ))}
            </div>
          </HudBorder>
        </div>

        {/* Right panel — chat */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden min-w-0">
          <div className="flex-1 overflow-hidden">
            <ChatDialog messages={messages} streaming={streaming} />
          </div>
          <HudBorder className="bg-slate-950/70 shrink-0">
            <InputBar onSend={sendMessage} onMicToggle={toggleMic} listening={status === "listening"} disabled={busy} />
          </HudBorder>
        </div>
      </div>
    </main>
  );
}
