"use client";

import { useEffect, useRef } from "react";
import HudBorder from "./HudBorder";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: ChatMessage[];
  streaming: string;
};

export default function ChatDialog({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  return (
    <HudBorder className="flex flex-col h-full bg-slate-950/80 backdrop-blur">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-900/50">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono tracking-widest text-cyan-500 uppercase">
          J.A.R.V.I.S. — Communication Log
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[10px] font-mono tracking-widest text-cyan-700 uppercase">
              {msg.role === "user" ? "You" : "J.A.R.V.I.S."}
            </span>
            <div
              className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap rounded ${
                msg.role === "user"
                  ? "bg-slate-800 text-slate-200 border border-slate-700"
                  : "bg-cyan-950/60 text-cyan-100 border border-cyan-900/60 shadow-[0_0_8px_rgba(0,212,255,0.1)]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming bubble */}
        {streaming && (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] font-mono tracking-widest text-cyan-700 uppercase">
              J.A.R.V.I.S.
            </span>
            <div className="max-w-[85%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap rounded bg-cyan-950/60 text-cyan-100 border border-cyan-900/60 shadow-[0_0_8px_rgba(0,212,255,0.15)]">
              {streaming}
              <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </HudBorder>
  );
}
