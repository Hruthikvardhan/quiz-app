# 🧠 QuizMaster — React Quiz App

A fully-featured quiz application built with React 18 functional components and hooks only. No Redux. No class components.

---

## 📁 Folder Structure

```
quiz-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home.jsx            # Welcome / setup screen
│   │   ├── Home.module.css
│   │   ├── Quiz.jsx            # Active quiz screen with timer
│   │   ├── Quiz.module.css
│   │   ├── Results.jsx         # Score, review, share
│   │   ├── Results.module.css
│   │   ├── Leaderboard.jsx     # localStorage top scores
│   │   └── Leaderboard.module.css
│   ├── hooks/
│   │   ├── useTimer.js         # Custom countdown timer hook
│   │   └── useQuiz.js          # Custom quiz state-machine hook
│   ├── App.jsx                 # Root — routing + score saving
│   ├── index.css               # Global styles + CSS variables
│   └── index.js                # React 18 entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open in browser
# http://localhost:3000
```

---

## ✨ Features

### Home Screen
- Player name input (required to start)
- Category selection: General Knowledge, Science, Sports, Movies
- Difficulty: Easy, Medium, Hard
- Question count: 5, 10, or 15

### Quiz Screen
- Live progress bar and Q X of N counter
- 30-second countdown timer per question
  - Timer bar shrinks in real time
  - Turns red and pulses when ≤ 10 seconds remain
  - Auto-advances to next question on timeout
- 4 answer options with A/B/C/D badges
  - ✅ Green highlight for correct answer
  - ❌ Red highlight for wrong answer
  - All options disabled after selection
- Live score display

### Results Screen
- Animated SVG score ring with percentage
- Performance message (Excellent / Good Job / Keep Practicing)
- Correct vs Wrong answer counts
- Full question review with your answers and correct answers
- Copy-to-clipboard share button
- Restart button

### Leaderboard Screen
- Persisted via localStorage across browser sessions
- Filter by difficulty
- Top 10 scores with name, category, date
- Gold/Silver/Bronze medals for top 3
- Clear all scores button

---

## 🔧 Hooks Used

| Hook | Where | Purpose |
|------|-------|---------|
| `useState` | Throughout | Local UI state |
| `useEffect` | App, Quiz, useTimer | Side effects, intervals, data fetching |
| `useCallback` | useQuiz, App, Quiz | Stable function references |
| `useMemo` | useQuiz, Leaderboard | Derived data without recalculation |
| `useRef` | useTimer, App | Interval ID, stale-closure fix |

---

## 🌐 API

Questions are fetched from the free [Open Trivia DB](https://opentdb.com/) — no API key required.

Example URL:
```
https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
```

---

## 🧩 Key Concepts Demonstrated

1. **Stale closure problem** — `selRef` in `useTimer` ensures the interval always reads the latest `sel` value
2. **Custom hooks** — `useTimer` and `useQuiz` as reusable logic abstractions
3. **State machine pattern** — `idle → loading → ready → done → idle` in `useQuiz`
4. **CSS Modules** — scoped styles with no class name collisions
5. **Error boundaries** — graceful handling of API failures
6. **localStorage** — persistent leaderboard without a backend

---

## 🔌 L2 Extensions

- Add React Router for proper URL-based navigation
- Replace localStorage with Supabase / Firebase for global leaderboard
- Add sound effects with Howler.js
- Add streak tracking and XP system
- Implement a dark/light mode toggle
- Add question timer difficulty scaling (Easy = 45s, Hard = 15s)
- Add animated transitions with Framer Motion
- Convert to PWA for offline play
