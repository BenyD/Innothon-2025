import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    // Cleanup on unmount or if delay changes
    return () => clearInterval(id);
  }, [delay]);
} 