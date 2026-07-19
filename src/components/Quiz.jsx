// ============================================================
// Quiz.jsx — Active Quiz Screen
//
// Features:
//  - Question progress bar (visual + text)
//  - Per-question countdown timer (useTimer hook)
//  - Timer bar that shrinks; turns red under 10 sec
//  - Auto-advance when timer expires (stale-closure safe)
//  - 4 answer option cards with green/red highlight on select
//  - All options disabled after selection
//  - Live score display
//  - Next / Finish button
// ============================================================

import React, { useEffect, useRef, useCallback } from 'react';
import useTimer from '../hooks/useTimer';
import styles from './Quiz.module.css';

const TIMER_DURATION = 30; // seconds per question

function Quiz({ quiz, config, onFinish }) {
  const { current, idx, total, sel, score, selectAnswer, advance, status } = quiz;

  // ── Stale-closure fix ─────────────────────────────────────
  // The timer interval captures `sel` at creation time.
  // We use a ref to always expose the LATEST sel value.
  const selRef = useRef(sel);
  useEffect(() => { selRef.current = sel; }, [sel]);

  // Called by useTimer when 30s runs out
  const handleExpire = useCallback(() => {
    // Only auto-select if user hasn't answered yet
    if (selRef.current === null) {
      selectAnswer('__TIMEOUT__'); // special sentinel value
    }
  }, [selectAnswer]);

  // Timer resets automatically when idx changes (resetKey)
  // Timer pauses when sel !== null (user has answered)
  const timeLeft = useTimer(
    TIMER_DURATION,
    handleExpire,
    sel === null,   // isActive: run only while unanswered
    idx             // resetKey: reset on every new question
  );

  // Navigate to results when quiz finishes
  useEffect(() => {
    if (status === 'done') onFinish();
  }, [status, onFinish]);

  if (!current) return null;

  // ── Derived values ────────────────────────────────────────
  const progressPct = (idx / total) * 100;
  const timerPct    = (timeLeft / TIMER_DURATION) * 100;
  const isWarning   = timeLeft <= 10;
  const isLast      = idx + 1 >= total;

  // Determine the visual style of each answer button
  const getAnswerClass = (opt) => {
    if (!sel) return styles.optionDefault;
    if (opt === current.correct)           return styles.optionCorrect;
    if (opt === sel && opt !== current.correct) return styles.optionWrong;
    return styles.optionDimmed;
  };

  return (
    <div className={`${styles.wrapper} anim-fadeUp`}>
      <div className={styles.inner}>

        {/* ── Top bar: progress text + timer + score ── */}
        <div className={styles.topBar}>
          {/* Question count */}
          <div className={styles.topItem}>
            <span className={styles.topLabel}>Question</span>
            <span className={styles.topValue}>
              {idx + 1}
              <span className={styles.topTotal}> / {total}</span>
            </span>
          </div>

          {/* Countdown timer pill */}
          <div className={`${styles.timerPill} ${isWarning ? styles.timerWarn : ''}`}>
            <span className={`${styles.timerNum} ${isWarning ? styles.timerNumWarn : ''}`}>
              {timeLeft}<span className={styles.timerS}>s</span>
            </span>
            <div className={styles.timerTrack}>
              <div
                className={`${styles.timerBar} ${isWarning ? styles.timerBarWarn : ''}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

          {/* Live score */}
          <div className={`${styles.topItem} ${styles.topRight}`}>
            <span className={styles.topLabel}>Score</span>
            <span className={`${styles.topValue} ${styles.scoreVal}`}>{score}</span>
          </div>
        </div>

        {/* ── Overall progress bar ── */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* ── Category + difficulty tag ── */}
        <div className={styles.tag}>
          {config.category} &middot; {config.difficulty}
        </div>

        {/* ── Question card ── */}
        <div className={styles.questionCard}>
          <p className={styles.questionText}>{current.question}</p>
        </div>

        {/* ── Answer options ── */}
        <div className={styles.optionsGrid}>
          {current.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.option} ${getAnswerClass(opt)}`}
              onClick={() => !sel && selectAnswer(opt)}
              disabled={!!sel}
            >
              {/* Option letter badge */}
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className={styles.optionText}>{opt}</span>
            </button>
          ))}
        </div>

        {/* ── Next button (shown after selection) ── */}
        {sel && (
          <div className={`${styles.nextWrap} anim-slideUp`}>
            <button className={styles.nextBtn} onClick={advance}>
              {isLast ? '🏁\u00a0 See Results' : 'Next Question \u00a0→'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Quiz;
