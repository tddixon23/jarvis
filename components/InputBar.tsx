"use client";

import { useState, KeyboardEvent } from "react";
import { Mic, MicOff, Send } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  onMicToggle: () => void;
  listening: boolean;
  disabled: boolean;
};

export default function InputBar({ onSend, onMicToggle, listening, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 p-1">
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          placeholder="Issue a directive, sir…"
          rows={1}
          className="w-full resize-none bg-slate-900/80 border border-cyan-900/60 rounded px-3 py-2 text-sm text-slate-200 placeholder-cyan-900 font-mono focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_8px_rgba(0,212,255,0.3)] transition-all disabled:opacity-40 leading-relaxed max-h-32 overflow-y-auto"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
      </div>

      <button
        onClick={onMicToggle}
        disabled={disabled}
        title={listening ? "Stop listening" : "Speak"}
        className={`p-2 rounded border transition-all duration-200 ${
          listening
            ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)] animate-pulse"
            : "bg-slate-900/80 border-cyan-900/60 text-cyan-600 hover:border-cyan-500 hover:text-cyan-400"
        } disabled:opacity-40`}
      >
        {listening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        title="Send"
        className="p-2 rounded border border-cyan-900/60 bg-slate-900/80 text-cyan-600 hover:border-cyan-500 hover:text-cyan-400 hover:shadow-[0_0_8px_rgba(0,212,255,0.3)] transition-all duration-200 disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
