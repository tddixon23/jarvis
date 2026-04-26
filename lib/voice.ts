"use client";

let selectedVoice: SpeechSynthesisVoice | null = null;

export function initVoice(): void {
  const load = () => {
    const voices = window.speechSynthesis.getVoices();
    // Priority: Google UK English Male > any en-GB male > any en-GB > fallback
    selectedVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("google uk english male") ||
          v.name.toLowerCase().includes("daniel")
      ) ||
      voices.find(
        (v) =>
          v.lang === "en-GB" &&
          (v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("james") ||
            v.name.toLowerCase().includes("george"))
      ) ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    load();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", load, {
      once: true,
    });
  }
}

export function speak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  window.speechSynthesis.cancel();

  // Strip markdown for cleaner speech
  const clean = text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.lang = "en-GB";
  utterance.pitch = 0.88;  // Slightly lower — JARVIS baritone
  utterance.rate = 0.92;   // Measured, deliberate pace
  utterance.volume = 1;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
}

export function startListening(
  onResult: (transcript: string) => void,
  onEnd: () => void
): SpeechRecognition | null {
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  recognition.onend = onEnd;
  recognition.onerror = onEnd;
  recognition.start();

  return recognition;
}
