import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    let item;
    if (typeof window !== 'undefined') {
      item = window.localStorage?.getItem(key);
    }
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T) => {
    // Allow value to be a function, so we have same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // Save state
    setStoredValue(valueToStore);
    // Save to local storage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };
  return [storedValue, setValue] as const;
}
