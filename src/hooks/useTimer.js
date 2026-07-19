// ============================================================
// useTimer.js — Custom Hook
//
// Manages a countdown timer with:
//  - Auto-reset when `resetKey` changes (e.g., question index)
//  - Pause/resume via `isActive`
//  - onExpire callback fires once when timer hits 0
//  - Stale-closure protection via useRef for the callback
// ============================================================

import { useState, useEffect, useRef } from 'react';

/**
 * @param {number}   duration  - Timer start value in seconds
 * @param {Function} onExpire  - Called once when time reaches 0
 * @param {boolean}  isActive  - Pause the timer when false
 * @param {any}      resetKey  - Timer resets whenever this value changes
 * @returns {number} timeLeft  - Current seconds remaining
 */
function useTimer(duration, onExpire, isActive, resetKey) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  // Keep a ref to the latest onExpire so the interval
  // never captures a stale version of the callback.
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    // Clear any existing interval on each reset or pause
    clearInterval(intervalRef.current);
    setTimeLeft(duration);

    // Don't start if paused
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Use ref to always call the LATEST version of onExpire
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or before next effect run
    return () => clearInterval(intervalRef.current);
  }, [resetKey, isActive, duration]); // Re-run when question changes or active state flips

  return timeLeft;
}

export default useTimer;
