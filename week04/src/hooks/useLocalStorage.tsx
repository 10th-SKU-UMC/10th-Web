import { useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  };

  return [storedValue, setValue] as const;
}
