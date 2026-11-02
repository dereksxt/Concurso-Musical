# 🎵 Concurso Musical

![Vue.js](https://img.shields.io/badge/vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/pinia-%23FFD859.svg?style=for-the-badge&logo=pinia&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

An interactive music quiz web app where players identify songs from short audio clips, compete for the highest score and climb the global leaderboard.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Scoring System](#-scoring-system)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Learning Goals](#-learning-goals)
- [Author](#-author)

---

## 📌 Overview

**Concurso Musical** is a single-page application built with Vue 3 and TypeScript. In each game the player listens to a 5-second audio clip and picks the correct song from four options. When the game ends, the final score is saved and the player can see where they rank on the global leaderboard.

The project combines state management, audio playback, data persistence and a fully responsive interface.

---

## ✨ Features

- 🎧 **Audio-based gameplay:** identify songs from 5-second clips.
- 🎲 **Randomized games:** each game picks 10 songs from a catalog of 20.
- 📝 **Multiple choice:** four answer options per question.
- 🏆 **Detailed results:** score and performance summary at the end of every game.
- 📊 **Global leaderboard:** top 10 scores of all time.
- 🥇 **Podium view:** highlights the top three players.
- ⚖️ **Time-based tiebreaker:** players with equal scores are ranked by completion time.
- ☁️ **Persistent storage:** results are saved and retrieved through Supabase.
- 📱 **Responsive design:** works on mobile, tablet and desktop.

---

## 🎮 Scoring System

| Outcome | Points |
|---|---:|
| Correct answer | +10 |
| Wrong answer | -5 |
| Time runs out | 0 |

Each game consists of 10 randomly selected questions.

---

## 💻 Tech Stack

| Technology | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | Frontend framework |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Vite](https://vitejs.dev/) | Dev server and build tool |
| [Vue Router](https://router.vuejs.org/) | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Supabase](https://supabase.com/) | Database and persistence |
| [Howler.js](https://howlerjs.com/) | Audio playback and control |
| CSS | Styling and responsive layout |

---

## 📁 Project Structure

```text
concurso-musical/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── router/
│   ├── stores/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) project for the leaderboard

### 1. Clone the repository

```bash
git clone https://github.com/dereksxt/concurso-musical.git
cd concurso-musical
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your own Supabase credentials:

```bash
cp .env.example .env
```

> ⚠️ Never commit your `.env` file or share private credentials. Make sure `.env` is listed in your `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at the local address shown in your terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

---

## 🎯 Learning Goals

This project was built to practice and consolidate frontend development skills:

- Building a typed Vue 3 application with TypeScript
- Managing global state with Pinia
- Handling navigation with Vue Router
- Controlling audio playback with Howler.js
- Integrating an external backend service (Supabase)
- Designing a responsive, user-friendly interface

---

## 👤 Author

**Derek Serpa** — [@dereksxt](https://github.com/dereksxt)
