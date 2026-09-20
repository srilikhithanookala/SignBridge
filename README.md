# 🤟 SignBridge AI – Breaking Communication Barriers

> **“From Hands to Voice. From Silence to Conversation.”**

SignBridge AI is an AI-powered web platform designed to bridge communication between sign language users and non-signers in real time using device camera computer vision, MediaPipe hand landmark tracking, context-aware sentence synthesis, Web Speech API (TTS & STT), two-way conversation mode, sign learning with live practice feedback, user dashboard analytics, and Supabase integration with offline fallback.

---

## 🌟 Key Features

1. **Live Main Translator**:
   - Camera feed with MediaPipe 21-point 3D hand landmark tracking & HTML5 canvas skeleton overlay.
   - 22 Core Sign Vocabulary (`HELLO`, `THANK YOU`, `YES`, `NO`, `PLEASE`, `SORRY`, `HELP`, `WATER`, `FOOD`, `HOME`, `HOSPITAL`, `SCHOOL`, `STOP`, `COME`, `GO`, `I`, `YOU`, `NEED`, `WANT`, `GOOD`, `BAD`).
   - Context-aware sentence generation (e.g. `I` + `WANT` + `WATER` $\rightarrow$ *"I want some water."*).
   - Text-to-speech audio synthesis.
   - Demo simulation bar for testing without camera hardware.
   - Recognition correctness feedback system (log to Supabase).

2. **Two-Way Conversation Mode**:
   - Split-screen interface for Sign Language User (gestures $\rightarrow$ text/audio) and Other Person (microphone STT $\rightarrow$ text).
   - Real-time chat bubbles timeline with audio playback and instant saving to history.

3. **Sign Learning & Live Practice**:
   - Interactive flashcard dictionary with positioning instructions.
   - Live Practice Mode using webcam tracking with landmark matching progress score and confetti celebration.

4. **Analytics Dashboard**:
   - Real-time metrics for *Translations Today*, *Total Conversations*, *Most Used Sign*, and *AI Accuracy Rating*.
   - Recent activity feed and feedback logs.

5. **Universal Accessibility Suite**:
   - High Contrast Mode toggle.
   - Large Text scaling (+15%).
   - Dyslexic-friendly font option.
   - Custom speech rate slider (0.5x to 2.0x).
   - Full keyboard navigation shortcuts (`Space`, `Enter`, `Backspace`, `Esc`).

6. **Supabase & Offline Demo Fallback**:
   - User authentication (Login, Sign Up, Guest Mode).
   - Database tables for Users, Conversations, Messages, and Feedback.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Computer Vision**: MediaPipe Hands, HTML5 Video & Canvas API
- **Speech**: Web Speech API (`SpeechSynthesis`, `webkitSpeechRecognition`)
- **Backend & Storage**: Supabase SDK + LocalStorage fallback engine

---

## 🛠️ Getting Started

### 1. Installation

```bash
git clone https://github.com/YOUR_USERNAME/signbridge-ai.git
cd signbridge-ai
npm install
```

### 2. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
```

---

## 📜 License

MIT License © SignBridge AI
