# 🎵 SongVoca — FE

[![CI](https://github.com/AyeongKwon/songvoca-fe/actions/workflows/ci.yml/badge.svg)](https://github.com/AyeongKwon/songvoca-fe/actions/workflows/ci.yml)

Learn Korean vocabulary through the songs you love🤍

SongVoca is a Korean vocabulary learning web app. Search for a K-pop or Korean song, load its lyrics, and let AI extract useful vocabulary into flashcards. Study words in context — the way language is actually used.

🌐 **Live Demo**: https://songvoca-fe.vercel.app/
📦 **Backend Repository**: [songvoca-backend](https://github.com/Kimhyewon0621/songvoca-backend)

## ✨ Features

- **Song Search** — Search songs by title or artist via LRCLIB API
- **AI Vocabulary Extraction** — Gemini AI extracts Korean words with definitions and grammar notes
- **Flashcard Study** — Flip cards with "I know" / "I don't know" tracking
- **My Library** — Save and manage songs with learning progress status

## 🖥️ Tech Stack

| Category | Technology |
| --- | --- |
| Framework | React + Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v7 |
| Deployment | Vercel |

## 📁 Project Structure

```
songvoca-fe/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow
├── src/
│   ├── api/
│   │   └── client.js           # Axios client with JWT interceptor
│   ├── components/
│   │   ├── ui/                 # Reusable UI (Button, Card, etc.)
│   │   ├── Layout.jsx          # Shared layout (sidebar + main)
│   │   ├── PrivateRoute.jsx    # Auth route guard
│   │   └── Sidebar.jsx         # Sidebar navigation
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state
│   ├── pages/
│   │   ├── Home.jsx            # Shared song pool
│   │   ├── Library.jsx         # Personal study library
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Search.jsx          # LRCLIB song search
│   │   ├── Signup.jsx
│   │   ├── Songs.jsx           # Lyrics + vocabulary extraction
│   │   └── Study.jsx           # Flashcard study mode
│   ├── styles/
│   │   └── tokens.css          # Design tokens (colors, fonts, etc.)
│   ├── utils/
│   │   └── songStatus.js       # Learning status label utility
│   ├── App.jsx                 # Route definitions
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── .env.example                # Environment variable template
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json                 # Vercel deployment config
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/AyeongKwon/songvoca-fe.git
cd songvoca-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`.

### Environment Variables

Create a `.env` file at the project root.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `https://songvoca-backend.onrender.com` |

### Build & Test

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Lint check
npm run lint
```

## 📝 AI Usage

This project uses the **Google Gemini API** for Korean vocabulary extraction from song lyrics.

AI tools such as **GitHub Copilot** and **Claude** were used during development.

## 📄 License

This project is for academic purposes — ITM519 Web Programming, SeoulTech, 2026.