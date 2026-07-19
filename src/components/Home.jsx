// ============================================================
// Home.jsx — Welcome / Setup Screen
//
// Lets the user choose:
//   - Player name (required to start)
//   - Category (General Knowledge / Science / Sports / Movies)
//   - Difficulty (Easy / Medium / Hard)
//   - Number of questions (5 / 10 / 15)
//
// Calls onStart({ playerName, category, difficulty, amount })
// ============================================================

import React, { useState } from 'react';
import styles from './Home.module.css';

const CATEGORIES  = ['General Knowledge', 'Science', 'Sports', 'Movies'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const AMOUNTS     = [5, 10, 15];

const CAT_EMOJI = {
  'General Knowledge': '🌍',
  'Science':           '🔬',
  'Sports':            '⚽',
  'Movies':            '🎬',
};

function Home({ onStart, onLeaderboard }) {
  const [playerName, setPlayerName] = useState('');
  const [category,   setCategory]   = useState('General Knowledge');
  const [difficulty, setDifficulty] = useState('Medium');
  const [amount,     setAmount]     = useState(10);

  const canStart = playerName.trim().length > 0;

  const handleStart = () => {
    if (!canStart) return;
    onStart({
      playerName: playerName.trim(),
      category,
      difficulty,
      amount,
    });
  };

  return (
    <div className={`${styles.wrapper} anim-fadeUp`}>
      <div className={styles.inner}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroEmoji}>🧠</div>
          <h1 className={styles.title}>QuizMaster</h1>
          <p className={styles.subtitle}>
            Test your knowledge across categories and difficulties
          </p>
        </div>

        {/* Card */}
        <div className={styles.card}>

          {/* Player name */}
          <div className={styles.field}>
            <label className={styles.label}>Your Name</label>
            <input
              className={styles.input}
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name to begin…"
              maxLength={22}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <div className={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.chipBtn} ${category === cat ? styles.chipActive : ''}`}
                  onClick={() => setCategory(cat)}
                  style={category === cat ? { '--chip-accent': 'var(--accent)' } : {}}
                >
                  <span className={styles.chipEmoji}>{CAT_EMOJI[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className={styles.field}>
            <label className={styles.label}>Difficulty</label>
            <div className={styles.row3}>
              {DIFFICULTIES.map(d => {
                const color = d === 'Easy' ? 'var(--green)'
                            : d === 'Hard' ? 'var(--red)'
                            : 'var(--accent)';
                return (
                  <button
                    key={d}
                    className={`${styles.chipBtn} ${difficulty === d ? styles.chipActive : ''}`}
                    onClick={() => setDifficulty(d)}
                    style={difficulty === d ? { '--chip-accent': color } : {}}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div className={styles.field}>
            <label className={styles.label}>Number of Questions</label>
            <div className={styles.row3}>
              {AMOUNTS.map(n => (
                <button
                  key={n}
                  className={`${styles.chipBtn} ${styles.chipNum} ${amount === n ? styles.chipActive : ''}`}
                  onClick={() => setAmount(n)}
                  style={amount === n ? { '--chip-accent': 'var(--blue)' } : {}}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={handleStart}
              disabled={!canStart}
            >
              🚀&nbsp; Start Quiz
            </button>
            <button className={styles.ghostBtn} onClick={onLeaderboard}>
              🏆&nbsp; View Leaderboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
