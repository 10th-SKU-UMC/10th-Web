import { useState, useEffect, useMemo } from 'react';

const STALE_TIME = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export type { CacheEntry };

export const useCustomFetch = <T>(url: string): { data: T | null; isPending: boolean; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const storageKey = useMemo(() => `cache_${url}`, [url]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setData(null);
      setIsPending(true);
      setError(null);

      const cachedItem = localStorage.getItem(storageKey);
      const currentTime = Date.now();

      if (cachedItem) {
        try {
          const cachedData = JSON.parse(cachedItem) as CacheEntry<T>;
          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            return;
          }
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newData: T = await response.json();
        setData(newData);

        localStorage.setItem(storageKey, JSON.stringify({
          data: newData,
          lastFetched: Date.now(),
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, storageKey]);

  return { data, isPending, error };
};
