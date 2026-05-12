import { useEffect, useState } from "react";

export const getStorageItem = <T,>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const setStorageItem = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const removeStorageItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = getStorageItem<T>(key);
    return stored ?? initialValue;
  });

  useEffect(() => {
    if (value === null || value === undefined) {
      removeStorageItem(key);
    } else {
      setStorageItem(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
