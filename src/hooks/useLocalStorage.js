import { useEffect, useState } from "react";

/**
 * 🌸 useLocalStorage Hook — Lovely Boutique
 * -----------------------------------------
 * A small reusable hook to manage localStorage with reactivity.
 * Works for strings, numbers, arrays, and objects.
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if key not found
 * @returns [value, setValue, clearValue]
 */

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage error for key "${key}":`, err);
      return initialValue;
    }
  });

  /** ✅ Sync changes to localStorage */
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [key, storedValue]);

  /** 🧹 Optional clear method */
  const clearValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
  };

  return [storedValue, setStoredValue, clearValue];
}
