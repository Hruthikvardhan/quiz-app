// ============================================================
// App.jsx — Root Component
//
// Manages top-level screen routing:
//   home → fetching → quiz → results → home
//                                 ↘ leaderboard ↗
//
// Responsibilities:
//  - Holds the config (playerName, category, difficulty, amount)
//  - Calls quiz.fetchQuestions() and transitions to 'fetching'
//  - Listens for quiz.status changes to trigger screen transitions
//  - Saves score to localStorage after each completed quiz
//  - Renders the correct screen component based on current route
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

import Home        from './components/Home';
import Quiz        from './components/Quiz';
import Results     from './components/Results';
import Leaderboard from './components/Leaderboard';
import useQuiz     from './hooks/useQuiz';

// localStorage key — shared with Leaderboard.jsx
const STORAGE_KEY = 'quizmaster_scores';

// Screens: 'home' | 'fetching' | 'quiz' | 'results' | 'leaderboard' | 'error'
function App() {
  const [screen, setScreen] = useState('home');
  const [config, setConfig] = useState(null);
  const scoreSaved = useRef(false); // prevent double-save on re-render

  const quiz = useQuiz();

  // ── Start quiz: store config, begin fetching ─────────────
  const handleStart = useCallback(async (cfg) => {
    scoreSaved.current = false;
    setConfig(cfg);
    setScreen('fetching');
    await quiz.fetchQuestions(cfg);
  }, [quiz]);

  // ── React to quiz status changes ─────────────────────────
  useEffect(() => {
    if (quiz.status === 'ready') setScreen('quiz');
    if (quiz.status === 'error') setScreen('error');
  }, [quiz.status]);

  // ── Save score when quiz completes ───────────────────────
  useEffect(() => {
    if (quiz.status === 'done' && config && !scoreSaved.current) {
      scoreSaved.current = true;
      const pct  = Math.round((quiz.score / quiz.total) * 100);
      const entry = {
        name:       config.playerName,
        score:      quiz.score,
        total:      quiz.total,
        pct,
        category:   config.category,
        difficulty: config.difficulty,
        date:       new Date().toLocaleDateString(),
      };
      try {
        const raw   = localStorage.getItem(STORAGE_KEY);
        const list  = raw ? JSON.parse(raw) : [];
        const updated = [...list, entry]
          .sort((a, b) => b.pct - a.pct || b.score - a.score)
          .slice(0, 20); // keep max 20 entries
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage may be unavailable (private browsing, storage full, etc.)
        console.warn('QuizMaster: could not save score to localStorage.');
      }
    }
  }, [quiz.status, quiz.score, quiz.total, config]);

  // ── Navigation helpers ────────────────────────────────────
  const onFinish      = useCallback(() => setScreen('results'),    []);
  const onRestart     = useCallback(() => { quiz.reset(); setScreen('home'); }, [quiz]);
  const onLeaderboard = useCallback(() => setScreen('leaderboard'), []);
  const onHome        = useCallback(() => setScreen('home'),        []);

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {screen === 'home' && (
        <Home onStart={handleStart} onLeaderboard={onLeaderboard} />
      )}

      {screen === 'fetching' && (
        <div style={centerStyle}>
          <div style={spinnerStyle} />
          <p style={spinnerTextStyle}>Fetching questions from Open Trivia DB…</p>
        </div>
      )}

      {screen === 'quiz' && config && (
        <Quiz quiz={quiz} config={config} onFinish={onFinish} />
      )}

      {screen === 'results' && config && (
        <Results
          quiz={quiz}
          config={config}
          onRestart={onRestart}
          onLeaderboard={onLeaderboard}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard onBack={onHome} />
      )}

      {screen === 'error' && (
        <div style={centerStyle}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>⚠️</span>
          <h3 style={{ color: '#ef4444', fontSize: 20, margin: '0 0 10px' }}>
            Failed to Load Questions
          </h3>
          <p style={{ color: '#7d92b0', maxWidth: 380, textAlign: 'center', lineHeight: 1.6 }}>
            {quiz.errorMsg}
          </p>
          <button onClick={onRestart} style={retryBtnStyle}>
            Try Again
          </button>
        </div>
      )}
    </>
  );
}

/* ── Inline styles for loading / error states ── */
const centerStyle = {
  minHeight:      '100vh',
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            16,
  padding:        24,
};

const spinnerStyle = {
  width:       44,
  height:      44,
  borderRadius:'50%',
  border:      '3px solid #1c2840',
  borderTopColor: '#f59e0b',
  animation:   'spin 0.8s linear infinite',
};

const spinnerTextStyle = {
  color:    '#7d92b0',
  fontSize: 14,
};

const retryBtnStyle = {
  marginTop:    20,
  padding:      '12px 32px',
  borderRadius: 12,
  fontSize:     15,
  fontWeight:   800,
  border:       'none',
  background:   'linear-gradient(135deg, #f59e0b, #d97706)',
  color:        '#06090f',
  cursor:       'pointer',
};

export default App;
