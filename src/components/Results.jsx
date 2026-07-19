// ============================================================
// Results.jsx — Quiz Results Screen
//
// Shows:
//  - Animated SVG score ring with percentage
//  - Performance message (Excellent / Good Job / Keep Practicing)
//  - Correct vs Wrong stat chips
//  - Expandable question review with correct answers
//  - Share score (copy to clipboard)
//  - Restart and Leaderboard buttons
//
// Auto-saves score to localStorage via pushScore on mount.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import styles from './Results.module.css';

// Persist score — passed in from App so Results stays pure
function Results({ quiz, config, onRestart, onLeaderboard }) {
  const { score, total, log } = quiz;
  const [showReview, setShowReview] = useState(false);
  const [copied,     setCopied]     = useState(false);

  const pct   = Math.round((score / total) * 100);
  const right = log.filter(a =>  a.isOk).length;
  const wrong = log.filter(a => !a.isOk).length;

  // Performance tier
  const perf =
    pct >= 80 ? { label: '🏆 Excellent!',        color: 'var(--green)',  sub: 'Outstanding — you absolutely aced it!' }
  : pct >= 60 ? { label: '👍 Good Job!',          color: 'var(--accent)', sub: 'Solid effort — a little more practice and you\'ll ace it!' }
              : { label: '📚 Keep Practicing!',   color: 'var(--red)',    sub: 'Review the topics and try again — you\'ve got this!' };

  // SVG score ring math
  const RADIUS      = 60;
  const CIRCUMFRNC  = 2 * Math.PI * RADIUS;
  const dashOffset  = CIRCUMFRNC * (1 - pct / 100);

  // Share to clipboard
  const handleShare = () => {
    const text = [
      '🧠 QuizMaster Result',
      `Player:     ${config.playerName}`,
      `Score:      ${score}/${total} (${pct}%)`,
      `Category:   ${config.category} | ${config.difficulty}`,
      perf.label,
      '',
      'Play at QuizMaster!',
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={`${styles.wrapper} anim-popIn`}>
      <div className={styles.inner}>

        {/* ── Main score card ── */}
        <div className={styles.card}>
          {/* SVG Ring */}
          <div className={styles.ringWrap}>
            <svg viewBox="0 0 148 148" className={styles.ring}>
              {/* Background track */}
              <circle cx="74" cy="74" r={RADIUS}
                fill="none" stroke="var(--border)" strokeWidth="10" />
              {/* Progress arc */}
              <circle cx="74" cy="74" r={RADIUS}
                fill="none"
                stroke={perf.color}
                strokeWidth="10"
                strokeDasharray={CIRCUMFRNC}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease' }}
              />
            </svg>
            <div className={styles.ringInner}>
              <span className={styles.ringPct}>{pct}%</span>
              <span className={styles.ringFrac}>{score}/{total}</span>
            </div>
          </div>

          <h2 className={styles.perfLabel} style={{ color: perf.color }}>
            {perf.label}
          </h2>
          <p className={styles.perfSub}>{perf.sub}</p>
          <p className={styles.playerName}>{config.playerName}</p>
          <p className={styles.meta}>
            {config.category} &middot; {config.difficulty} &middot; {total} Questions
          </p>
        </div>

        {/* ── Correct / Wrong stat chips ── */}
        <div className={styles.statsRow}>
          <div className={`${styles.statChip} ${styles.statGreen}`}>
            <span className={styles.statNum}>{right}</span>
            <span className={styles.statLabel}>Correct</span>
          </div>
          <div className={`${styles.statChip} ${styles.statRed}`}>
            <span className={styles.statNum}>{wrong}</span>
            <span className={styles.statLabel}>Wrong</span>
          </div>
        </div>

        {/* ── Actions ── */}
        <button className={styles.primaryBtn} onClick={onRestart}>
          🔄&nbsp; Restart Quiz
        </button>

        <div className={styles.rowBtns}>
          <button className={styles.ghostBtn} onClick={onLeaderboard}>
            🏆&nbsp; Leaderboard
          </button>
          <button
            className={`${styles.shareBtn} ${copied ? styles.shareCopied : ''}`}
            onClick={handleShare}
          >
            {copied ? '✅ Copied!' : '📋 Share'}
          </button>
        </div>

        {/* ── Review toggle ── */}
        <button
          className={styles.reviewToggle}
          onClick={() => setShowReview(r => !r)}
        >
          {showReview ? '▲  Hide Review' : '▼  Review All Questions'}
        </button>

        {/* ── Review list ── */}
        {showReview && (
          <div className={styles.reviewList}>
            {log.map((entry, i) => (
              <div
                key={i}
                className={`${styles.reviewItem} ${entry.isOk ? styles.reviewOk : styles.reviewBad}`}
              >
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewQ}>Q{i + 1}</span>
                  <span className={`${styles.reviewBadge} ${entry.isOk ? styles.badgeOk : styles.badgeBad}`}>
                    {entry.isOk ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
                <p className={styles.reviewQuestion}>{entry.question}</p>
                {!entry.isOk && (
                  <p className={styles.reviewYours}>
                    Your answer:{' '}
                    <strong>
                      {entry.selected === '__TIMEOUT__' ? '⏰ Time expired' : entry.selected}
                    </strong>
                  </p>
                )}
                <p className={styles.reviewCorrect}>
                  Correct: <strong>{entry.correct}</strong>
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Results;
