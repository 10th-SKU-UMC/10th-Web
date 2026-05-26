import { useEffect, useState } from "react";

/**
 * 값 지연형 Debounce 훅
 *
 * @param value - 지연시킬 원본 값
 * @param delay - 지연 시간 (ms), 권장 300ms
 * @returns debouncedValue - delay 이후에 갱신된 값
 *
 * [동작 원리]
 * - value 또는 delay 가 바뀌면 새 타이머를 등록합니다.
 * - 이전 타이머는 cleanup(clearTimeout)으로 즉시 취소합니다.
 *   → 연속 입력 중에는 마지막 입력 후 delay ms 가 지나야 값이 갱신됩니다.
 * - 컴포넌트 언마운트 시에도 타이머가 자동으로 정리됩니다.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay ms 후에 debouncedValue 갱신
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value 또는 delay 가 바뀌거나, 컴포넌트가 언마운트되면
    // 이전 타이머를 취소 → 불필요한 상태 업데이트 방지
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // delay 변경도 즉시 반영

  return debouncedValue;
}
