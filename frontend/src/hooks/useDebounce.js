import { useState, useEffect } from 'react';

/**
 * useDebounce — returns a value that only updates after `delay` ms of
 * inactivity. Useful for search-as-you-type inputs to avoid firing an API
 * request on every keystroke.
 *
 * @param {*} value The fast-changing value (e.g. a search string).
 * @param {number} delay Delay in milliseconds (default 300).
 * @returns {*} The debounced value.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
