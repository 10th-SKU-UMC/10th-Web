import { useQuery } from "@tanstack/react-query";

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    queryKey: [url],
    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json() as Promise<T>;
    },

    retry: 3,

    // 지수 백오프 전략
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * Math.pow(2, attemptIndex), 30_000);
    },

    staleTime: 5 * 60 * 1_000,

    // 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 삭제된다.
    gcTime: 10 * 60 * 1_000,
  });
};

/*
import { useEffect, useMemo, useState, useRef } from "react";

const STALE_TIME = 0.5 * 60 * 1_000; // 5 minutes

const MAX_RETRIES = 3;

// 1초마다 재시도
const INITIAL_RETRY_DELAY = 1_000;

// 로컬스토리지에 저장할 데이터의 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 마지막으로 데이터를 가져온 시점 다임스탬프
}

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    setIsError(false);

    const fetchData = async (currentRetry = 0) => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);

      // 캐시 데이터 확인 및 신선도 검증
      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          // 캐시가 신선한 경우 (STALE_TIME 이내)
          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log("캐시된 데이터 사용", url);
            return;
          }

          // 캐시가 만료된 경우
          setData(cachedData.data);
          console.log("만료된 캐시 데이터 사용", url);
        } catch {
          localStorage.removeItem(storageKey);
          console.warn("캐시 에러: 캐시 삭제함!", url);
        }
      }

      try {
        setIsPending(true);
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const newData = (await response.json()) as T;
        setData(newData);

        const newCachedEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(), // 현재 시간을 타임스탭프로 저장
        };

        localStorage.setItem(storageKey, JSON.stringify(newCachedEntry));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("요청 취소됨", url);

          return;
        }

        if (currentRetry < MAX_RETRIES) {
          // 1-> 2-> 4-> 8
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log(`재시도, ${(currentRetry = 1)}/${MAX_RETRIES})ms later`);

          retryTimeoutRef.current = setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay);
        } else {
          // 최대 재시도 횟수 초과
          setIsError(true);
          setIsPending(false);
          console.log("최대 재시도 쵯수 초과", url);
          return;
        }
        setIsError(true);
        console.log(error);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      abortControllerRef.current?.abort();

      // 예야된 재시도 타이머 취소됨
      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};
*/
