import { useCallback } from "react";

export const useLocalStorage = <T>(key: string) => {
  const setItem = useCallback(
    (value: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  const getItem = useCallback((): T | null => {
    try {
      const item: string | null = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [key]);

  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return { setItem, getItem, removeItem };
};
