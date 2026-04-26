# J.A.R.V.I.S.
**Just A Rather Very Intelligent System**

A personal AI assistant inspired by the Iron Man film series. Built with Next.js, the Claude AI API, and the Web Speech API for free browser-native voice.

## Features

- **Iron Man HUD UI** — dark theme with cyan glow, hex grid, scanlines, and corner-bracket panels
- **JARVIS voice** — British accent via Web Speech API (no cost, no API key needed)
- **Voice input** — speak your directives via microphone
- **Streaming responses** — real-time text as JARVIS thinks
- **Three capability modules:**
  - **Social Media** — draft posts, captions, hashtag strategies, content calendars
  - **Brand Outreach** — cold emails, partnership pitches, sponsorship proposals
  - **Business Organization** — task prioritization, meeting notes, action plans

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Voice Notes

- Voice output uses the browser's built-in Web Speech API — **Chrome** and **Edge** give the best results
- For the most JARVIS-like voice, Chrome on Windows uses "Google UK English Male" automatically
- Microphone input also uses the Web Speech API — allow mic permissions when prompted

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Claude claude-sonnet-4-6 via Anthropic SDK |
| Voice TTS | Web Speech API (browser-native, free) |
| Voice STT | Web Speech API SpeechRecognition |
| Icons | Lucide React |
