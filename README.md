# 🧠 QuizMaster

A full-featured, responsive Quiz Application built with **React 18** using only functional components and hooks. No Redux. No class components. Questions are fetched live from the **Open Trivia DB API** with a countdown timer, leaderboard, and detailed results review.

---

## 🌍 Live Demo

🔗 **[quizmaster-hruthik.vercel.app](https://quizmaster-hruthik.vercel.app)**

---

## 📸 Screenshots

| Home Screen                 | Quiz Screen               |
| --------------------------- | ------------------------- |
| ![Home](./ops/1%20home.png) | ![Quiz](./ops/2%20qu.png) |

| Results Screen                | Leaderboard                          |
| ----------------------------- | ------------------------------------ |
| ![Results](./ops/4%20res.png) | ![Leaderboard](./ops/3%20leader.png) |

---

## ✨ Features

### 🏠 Home Screen

- Player name input (required to start)
- Select quiz **category** — General Knowledge, Science, Sports, Movies
- Select **difficulty** — Easy, Medium, Hard
- Select **number of questions** — 5, 10, or 15
- Navigate to leaderboard

### 🎯 Quiz Screen

- Live question progress — **Q3 of 10**
- Animated **progress bar** showing completion
- **30-second countdown timer** per question
  - Timer bar shrinks in real time
  - Turns **red** and pulses when ≤ 10 seconds remain
  - **Auto-advances** to next question on timeout
- 4 answer options with **A / B / C / D** badges
  - ✅ **Green** highlight for correct answer
  - ❌ **Red** highlight for wrong answer
  - All options disabled after selection
- **Live score** display

### 🏆 Results Screen

- Animated **SVG score ring** with percentage
- Performance message:
  - 🏆 **Excellent!** — 80% and above
  - 👍 **Good Job!** — 60% to 79%
  - 📚 **Keep Practicing!** — below 60%
- Correct vs Wrong answer stat chips
- **Expandable question review** with correct answers shown
- **Share score** button — copies to clipboard
- Restart Quiz button

### 📋 Leaderboard Screen

- Top 10 scores **persisted via localStorage**
- Filter scores by difficulty — All / Easy / Medium / Hard
- 🥇 🥈 🥉 medals for top 3 positions
- Shows player name, category, difficulty, date, and score
- Clear all scores button

---

## 🛠 Tech Stack

| Technology         | Purpose                                   |
| ------------------ | ----------------------------------------- |
| React 18           | UI framework                              |
| React Hooks        | State and side effect management          |
| CSS Modules        | Scoped component styling                  |
| Open Trivia DB API | Live quiz questions (free, no key needed) |
| localStorage       | Leaderboard persistence                   |
| Vercel             | Deployment                                |

---

## ⚙️ Hooks Used

| Hook          | Where                | Purpose                                |
| ------------- | -------------------- | -------------------------------------- |
| `useState`    | All components       | Local UI state management              |
| `useEffect`   | App, Quiz, useTimer  | Side effects, intervals, API calls     |
| `useCallback` | useQuiz, App, Quiz   | Stable function references             |
| `useMemo`     | useQuiz, Leaderboard | Derived data without recalculation     |
| `useRef`      | useTimer, App        | Interval ID storage, stale-closure fix |

---

## 📁 Folder Structure

```
quiz-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home.jsx                  # Welcome and setup screen
│   │   ├── Home.module.css
│   │   ├── Quiz.jsx                  # Active quiz with timer
│   │   ├── Quiz.module.css
│   │   ├── Results.jsx               # Score, review, share
│   │   ├── Results.module.css
│   │   ├── Leaderboard.jsx           # localStorage top scores
│   │   └── Leaderboard.module.css
│   ├── hooks/
│   │   ├── useTimer.js               # Custom countdown timer hook
│   │   └── useQuiz.js                # Custom quiz state machine hook
│   ├── App.jsx                       # Root component and routing
│   ├── index.css                     # Global styles and CSS variables
│   └── index.js                      # React 18 entry point
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or above
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hruthikvardhan/quiz-app.git

# 2. Go into the project folder
cd quiz-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

App opens at **http://localhost:3000** 🎉

---

## 🌐 API Reference

Questions are fetched from the free **[Open Trivia DB](https://opentdb.com/)** — no API key required.

```
GET https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
```

| Parameter    | Values             | Description          |
| ------------ | ------------------ | -------------------- |
| `amount`     | 5, 10, 15          | Number of questions  |
| `category`   | 9, 11, 17, 21      | Category ID          |
| `difficulty` | easy, medium, hard | Difficulty level     |
| `type`       | multiple           | Multiple choice only |

**Category IDs used:**

```
9  → General Knowledge
11 → Movies
17 → Science
21 → Sports
```

---

## 🧩 Key Technical Concepts

### 1. Custom Hook — useTimer

Manages a 30-second countdown with:

- Auto-reset when question changes (`resetKey` pattern)
- Pause when answer is selected (`isActive` flag)
- Stale-closure fix using `useRef` so the expire callback always reads the latest selected answer

### 2. Custom Hook — useQuiz

A mini state machine with states:

```
idle → loading → ready → (answering) → done
                ↘ error
```

Handles API fetching, answer selection, scoring, and review log.

### 3. Stale Closure Problem — Solved

The timer interval captures `sel = null` at creation. Without a fix, it would never detect a user's answer. Solved by keeping `selRef` updated on every render:

```js
const selRef = useRef(sel);
useEffect(() => {
  selRef.current = sel;
}, [sel]);
```

### 4. CSS Modules

Every component has its own `.module.css` file — zero class name collisions across the app.

---

## 📦 Build for Production

```bash
npm run build
```

Creates an optimized `build/` folder ready for deployment.

---

## 🚢 Deployment — Vercel

This project is deployed on **Vercel** with automatic CI/CD:

```
Push to GitHub → Vercel detects change → Auto builds → Live URL updates
```

**To deploy your own:**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your GitHub repo
4. Click Deploy — done ✅

---

## 📄 Project Documents

| Document             | Description                                |
| -------------------- | ------------------------------------------ |
| `requirements.txt`   | Functional and non-functional requirements |
| `design_notes.txt`   | Color palette, typography, screen layouts  |
| `sprints.txt`        | 4 sprints, 16 tasks, 2 week timeline       |
| `manual_testing.txt` | 65 test cases across all screens           |
| `deployment.txt`     | Step-by-step GitHub and Vercel guide       |

---

## 🔮 Future Enhancements (L2)

- [ ] React Router for URL-based navigation
- [ ] Supabase or Firebase for global leaderboard
- [ ] Sound effects with Howler.js
- [ ] Dark / Light mode toggle
- [ ] Framer Motion page transitions
- [ ] True/False question type support
- [ ] Timer difficulty scaling (Easy = 45s, Hard = 15s)
- [ ] Streak and XP system
- [ ] PWA support for offline play

---

## 👤 Author

**Hruthik Vardhan**

- GitHub — [@hruthikvardhan](https://github.com/hruthikvardhan)
- LinkedIn — [Hruthik Vardhan](https://linkedin.com/in/hruthikvardhan)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by Hruthik Vardhan</p>
