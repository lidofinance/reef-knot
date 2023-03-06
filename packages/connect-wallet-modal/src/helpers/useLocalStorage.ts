import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (window?.localStorage?.hasItem(key)) {
      const item = window.localStorage.getItem(key);
      try {
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(
          `Reef Knot tried to parse a localStorage value using key: "${key}" and got the error:`,
          error,
        );
        return initialValue;
      }
    }
    return initialValue;
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: any) => {
    // Allow value to be a function, so we have same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // Save state
    setStoredValue(valueToStore);
    // Save to local storage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };
  return [storedValue, setValue];
}
