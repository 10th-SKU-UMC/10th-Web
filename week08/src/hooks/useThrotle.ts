// useThrottle: 주어진 값(상태)가 자주 변경될 때
// 최소 delay(밀리초) 간격으로만 업데이트 해서 성능을 개선한다.

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number = 500): T {
  // 1. 상태 변수 : throttledValue — 최종적으로 쓰로틀링 적용된 값 (초기값: 전달받은 value)
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. Ref lastExecuted — 마지막으로 실행된 시간을 기록
  // useRef를 사용하면 컴포넌트가 리렌더링되어도 값이 유지되고,
  // 변경되어도 리렌더링을 트리거하지 않는다.
  const lastExecuted = useRef<number>(Date.now());

  // 3. useEffect: value 또는 delay가 변경될 때마다 아래 로직 실행
  useEffect(() => {
    const now = Date.now();
    const remaining = lastExecuted.current + delay - now;

    if (remaining <= 0) {
      // 충분한 시간이 지난 경우 → 즉시 업데이트
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      // 아직 delay가 남은 경우 → remaining ms 후에 업데이트 (최신 value로)
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      // CleanUp: 의존성이 다시 바뀌면 이전 타이머를 취소해 중복 업데이트를 방지한다.
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
