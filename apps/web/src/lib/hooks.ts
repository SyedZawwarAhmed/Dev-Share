import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (defaults to 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Advanced debounce hook with additional options
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (defaults to 300ms)
 * @param options - Additional options
 * @returns Object with debounced value and utility functions
 */
export function useAdvancedDebounce<T>(
  value: T,
  delay: number = 300,
  options: {
    leading?: boolean; // Execute immediately on first call
    maxWait?: number; // Maximum time to wait before forcing execution
  } = {},
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);

    // Handle leading edge execution
    if (options.leading && debouncedValue !== value) {
      setDebouncedValue(value);
      if (!options.maxWait) {
        setIsDebouncing(false);
        return;
      }
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    // Handle maxWait option
    let maxWaitTimer: NodeJS.Timeout | null = null;
    if (options.maxWait) {
      maxWaitTimer = setTimeout(() => {
        setDebouncedValue(value);
        setIsDebouncing(false);
        clearTimeout(timer);
      }, options.maxWait);
    }

    return () => {
      clearTimeout(timer);
      if (maxWaitTimer) {
        clearTimeout(maxWaitTimer);
      }
    };
  }, [value, delay, options.leading, options.maxWait]);

  // Force immediate update
  const flush = () => {
    setDebouncedValue(value);
    setIsDebouncing(false);
  };

  // Cancel pending debounce
  const cancel = () => {
    setIsDebouncing(false);
  };

  return {
    debouncedValue,
    isDebouncing,
    flush,
    cancel,
  };
}
