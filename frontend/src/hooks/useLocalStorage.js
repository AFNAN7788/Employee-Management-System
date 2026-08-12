import { useState, useEffect } from 'react';

/**
 * useLocalStorage — a piece of state that stays in sync with localStorage.
 *
 * @param {string} key The storage key.
 * @param {*} initialValue Value used when nothing is stored yet.
 * @returns {[*, Function]} Current value and a setter that persists to storage.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private mode / quota) — ignore.
    }
  }, [key, value]);

  return [value, setValue];
}
