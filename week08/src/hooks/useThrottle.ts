// useThrottle : 주어진 값(상태)가 자주 변경될 때
// 최소 interval(밀리초) 간격으로만 업데이트해서 성능을 개선한다

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number): T {
  // 상태 변수 throttledValue : 최종적으로 쓰로틀링 적용된 값
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // Ref lastExceuted : 마지막으로 실행된 시간을 기록하는 변수
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    // 현재시각과 lastExceuted 차이가 delay
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      // Cleanup function 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
      // 기존 타이머를
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
