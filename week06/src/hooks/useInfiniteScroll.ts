import { useEffect, useRef } from "react";

export function useInfiniteScroll<T extends Element>(
  callback: () => void,
  enabled: boolean,
  rootMargin = "200px",
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}
