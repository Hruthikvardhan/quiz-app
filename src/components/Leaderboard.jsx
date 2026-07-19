// ============================================================
// Leaderboard.jsx — Top Scores Screen
//
// Reads scores saved to localStorage key 'quizmaster_scores'.
// Scores are written by App.jsx after each quiz completes.
// Displays top 10 scores sorted by percentage then raw score.
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import styles from './Leaderboard.module.css';

const STORAGE_KEY = 'quizmaster_scores';

// Medal emojis for top 3
const MEDALS = ['🥇', '🥈', '🥉'];

// Difficulty color helpers
const DIFF_COLOR = {
  Easy:   'var(--green)',
  Medium: 'var(--accent)',
  Hard:   'var(--red)',
};

function Leaderboard({ onBack }) {
  const [scores,  setScores]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All'); // All | Easy | Medium | Hard

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setScores(list);
    } catch {
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtered + sorted list (memoised so it only recalculates on change)
  const filtered = useMemo(() => {
    const list = filter === 'All'
      ? scores
      : scores.filter(s => s.difficulty === filter);
    return list
      .sort((a, b) => b.pct - a.pct || b.score - a.score)
      .slice(0, 10);
  }, [scores, filter]);

  const handleClear = () => {
    if (window.confirm('Clear all scores? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setScores([]);
    }
  };

  return (
    <div className={`${styles.wrapper} anim-fadeUp`}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <div>
            <h2 className={styles.title}>🏆 Leaderboard</h2>
            <p className={styles.subtitle}>
              Top scores across all sessions
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className={styles.filters}>
          {['All', 'Easy', 'Medium', 'Hard'].map(f => (
            <button
              key={f}
              className={`${styles.filterChip} ${filter === f ? styles.filterActive : ''}`}
              style={filter === f ? { '--fc': DIFF_COLOR[f] ?? 'var(--accent)' } : {}}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className={styles.empty}>
            <div className={styles.spinner} />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p className={styles.emptyText}>
              {filter === 'All'
                ? 'No scores yet. Play a quiz to appear here!'
                : `No ${filter} scores yet.`}
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((s, i) => (
              <div
                key={i}
                className={`${styles.row} ${i === 0 ? styles.rowTop : ''}`}
              >
                {/* Rank */}
                <span className={styles.rank}>
                  {MEDALS[i] ?? `#${i + 1}`}
                </span>

                {/* Name + meta */}
                <div className={styles.info}>
                  <div className={styles.name}>{s.name}</div>
                  <div className={styles.meta}>
                    {s.category}
                    <span
                      className={styles.diffBadge}
                      style={{ color: DIFF_COLOR[s.difficulty] }}
                    >
                      {s.difficulty}
                    </span>
                    · {s.date}
                  </div>
                </div>

                {/* Score */}
                <div className={styles.score}>
                  <div
                    className={styles.scorePct}
                    style={{ color: i === 0 ? 'var(--accent)' : 'var(--text)' }}
                  >
                    {s.pct}%
                  </div>
                  <div className={styles.scoreFrac}>
                    {s.score}/{s.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear button (only if scores exist) */}
        {scores.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClear}>
            🗑&nbsp; Clear All Scores
          </button>
        )}

      </div>
    </div>
  );
}

export default Leaderboard;
