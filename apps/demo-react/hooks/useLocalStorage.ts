import { useCallback, useState } from 'react';

// Local replacement for the identically-named hook from @lido-sdk/react,
// which was the demo's last dependency pulling in ethers.
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      // SSR (no window) or corrupted stored JSON
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage may be unavailable (SSR, private mode, quota)
      }
    },
    [key],
  );

  return [storedValue, setValue];
};
