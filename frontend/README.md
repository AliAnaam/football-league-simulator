# 🖥️ LigaSim Pro — React Admin Client

This directory houses the modern, high-fidelity **React + Vite + Tailwind CSS** client application for **LigaSim Pro**. It provides team managers and league administrators with an exquisite, fully animated control panel to simulate matches, oversee club statistics, manage team rosters, and track live tournament metrics.

---

## ✨ Features

- **⚡ Blazing Fast HMR**: Leverages Vite for near-instant developer server starts and sub-millisecond Hot Module Replacement.
- **🎨 Sleek Modern Theme**: Crafted with an emerald/slate palette, tailored shadows, custom card designs, glowing status widgets, and smooth micro-animations.
- **🎮 Built-in Synthesizer Sound Engine**: Uses the browser's native **Web Audio API** to generate pleasant acoustic click and success signals without bloating the bundle with static audio files.
- **🔒 Secured Operations**: Admin auth-guard unlocks advanced features such as database mutation (Team CRUD) and entire season resets.
- **📊 Interactive Visuals**:
  - **Dynamic Logo Fallback**: Automatically requests high-performance club crest assets from `football-data.org` and falls back dynamically to tailored initials with a colored background if blocked or missing.
  - **Live Standings Tracker**: Automatically parses goals, points, goal averages, wins, draws, and losses.
  - **Pichichi Goal Leaderboard**: Real-time listing of top goalscorers.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Tooling**: [Vite 8](https://vite.dev/)
- **Styles**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing & State**: React Hooks (`useState`, `useEffect`, `useRef`) and clean REST wrappers in `src/api.js`.

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have **Node.js** (v18.x or later) and **npm** installed on your workstation.

---

### 📥 1. Installation
Install the necessary package tree using standard npm installation:

```bash
npm install
```

---

### 🏃 2. Launching Developer Server
Run the local Vite server:

```bash
npm run dev
```

The application will launch on:
🔗 **Local Address**: [http://localhost:5173](http://localhost:5173)

---

### 🌐 3. Connecting to the Web API Backend
By default, the client directs all requests to:
- **API Target**: `http://localhost:5000/api`

You can change this endpoint configuration by modifying the `API_BASE` constant located in the top line of [src/api.js](file:///Users/alianaam/Desktop/football-league-simulator/frontend/src/api.js):

```javascript
const API_BASE = 'http://localhost:5000/api';
```

Make sure the C# ASP.NET Core backend is running concurrently so that data (Teams, Fixtures, Simulation results) loads successfully.

---

## 🧱 Key Components Structure

- [App.jsx](file:///Users/alianaam/Desktop/football-league-simulator/frontend/src/App.jsx): The main controller file. Orchestrates tabs, state machinery, modals, simulation ticks, CRUD handlers, and layouts.
- [index.css](file:///Users/alianaam/Desktop/football-league-simulator/frontend/src/index.css): Customized Tailwind directive overrides, glowing indicators, scrollbars, and keyframe animations.
- [api.js](file:///Users/alianaam/Desktop/football-league-simulator/frontend/src/api.js): Encapsulates clean, generic asynchronous fetch wrappers to query all server-side endpoints.

---

## 📦 Production Build

To compile the application bundle for static hosting environments:

```bash
npm run build
```

This compiles a minimized, chunked web application into the `dist/` directory, ready to be served by any CDN or static server.
To preview the compiled assets locally:

```bash
npm run preview
```

---

*Enjoy simulating! ⚽🏆*
