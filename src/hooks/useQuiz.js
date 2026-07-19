// ============================================================
// useQuiz.js — Custom Hook
//
// Central quiz state machine. Manages:
//  - Fetching questions from Open Trivia DB
//  - Answer selection and scoring
//  - Question advancement
//  - Review log for results screen
//  - Reset back to idle
//
// State machine flow:
//   idle → loading → ready → (answering questions) → done
//   Any state → idle  (via reset)
//   loading → error  (on API failure)
// ============================================================

import { useState, useCallback, useMemo } from 'react';

// Category name → Open Trivia DB category ID
const CATEGORY_MAP = {
  'General Knowledge': 9,
  'Science':           17,
  'Sports':            21,
  'Movies':            11,
};

// Decode HTML entities that the API returns (e.g. &amp; &#039;)
function decodeHTML(str) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

/**
 * useQuiz — encapsulates all quiz business logic
 *
 * Returns:
 *   qs            — array of formatted question objects
 *   current       — current question object (or null)
 *   idx           — current question index (0-based)
 *   total         — total number of questions
 *   sel           — selected answer for current question (null if none)
 *   score         — running correct-answer count
 *   log           — array of {q, sel, cor, ok} for results review
 *   status        — 'idle' | 'loading' | 'ready' | 'done' | 'error'
 *   errorMsg      — error message string (when status === 'error')
 *   fetchQuestions — async fn({ category, difficulty, amount })
 *   selectAnswer  — fn(answer: string)
 *   advance       — move to next question (or set status='done')
 *   reset         — wipe everything back to idle
 */
function useQuiz() {
  const [questions, setQuestions]   = useState([]);
  const [idx,       setIdx]         = useState(0);
  const [selected,  setSelected]    = useState(null);   // chosen answer string
  const [score,     setScore]       = useState(0);
  const [log,       setLog]         = useState([]);     // per-question review data
  const [status,    setStatus]      = useState('idle'); // state-machine status
  const [errorMsg,  setErrorMsg]    = useState('');

  // ── Fetch questions from Open Trivia DB ─────────────────
  const fetchQuestions = useCallback(async ({ category, difficulty, amount }) => {
    setStatus('loading');
    setErrorMsg('');

    try {
      const catId = CATEGORY_MAP[category] ?? 9;
      const url   = `https://opentdb.com/api.php?amount=${amount}&category=${catId}&difficulty=${difficulty.toLowerCase()}&type=multiple`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} — check your connection.`);

      const { response_code, results } = await res.json();

      // response_code 1 = not enough questions for filters
      if (response_code === 1) throw new Error('Not enough questions for these settings. Try fewer questions or a different difficulty.');
      if (response_code !== 0) throw new Error('Open Trivia DB returned an unexpected error. Please try again.');

      // Shuffle the incorrect answers + correct answer together
      const formatted = results.map(q => ({
        question: decodeHTML(q.question),
        correct:  decodeHTML(q.correct_answer),
        options:  [
          ...q.incorrect_answers.map(decodeHTML),
          decodeHTML(q.correct_answer),
        ].sort(() => Math.random() - 0.5), // Fisher-Yates-ish shuffle
      }));

      // Reset all state before loading new questions
      setQuestions(formatted);
      setIdx(0);
      setScore(0);
      setLog([]);
      setSelected(null);
      setStatus('ready');

    } catch (err) {
      setErrorMsg(err.message || 'Failed to load questions. Please try again.');
      setStatus('error');
    }
  }, []);

  // ── Select an answer ─────────────────────────────────────
  const selectAnswer = useCallback((answer) => {
    // Guard: don't allow re-selection
    if (selected !== null) return;

    const current = questions[idx];
    if (!current) return;

    const isCorrect = answer === current.correct;

    setSelected(answer);
    if (isCorrect) setScore(s => s + 1);

    // Append to review log
    setLog(prev => [
      ...prev,
      {
        question: current.question,
        selected: answer,
        correct:  current.correct,
        isOk:     isCorrect,
      },
    ]);
  }, [selected, questions, idx]);

  // ── Advance to next question ─────────────────────────────
  const advance = useCallback(() => {
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setStatus('done');
      return;
    }
    setIdx(nextIdx);
    setSelected(null); // Clear selection for the next question
  }, [idx, questions.length]);

  // ── Reset to idle ─────────────────────────────────────────
  const reset = useCallback(() => {
    setQuestions([]);
    setIdx(0);
    setScore(0);
    setLog([]);
    setSelected(null);
    setStatus('idle');
    setErrorMsg('');
  }, []);

  // ── Derived: current question (memoised) ─────────────────
  // useMemo avoids re-computing this on every render where
  // something unrelated (e.g., score) changes.
  const current = useMemo(() => questions[idx] ?? null, [questions, idx]);

  return {
    questions,
    current,
    idx,
    total:   questions.length,
    sel:     selected,
    score,
    log,
    status,
    errorMsg,
    fetchQuestions,
    selectAnswer,
    advance,
    reset,
  };
}

export default useQuiz;
