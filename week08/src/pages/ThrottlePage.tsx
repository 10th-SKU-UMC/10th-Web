import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrotle";

const ThrottlePage = () => {
  // 실제 scrollY: 스크롤할 때마다 즉시 업데이트 (쓰로틀 미적용)
  const [scrollY, setScrollY] = useState<number>(0);

  // 쓰로틀 적용: 1초에 한 번만 값이 바뀜
  const throttledScrollY = useThrottle(scrollY, 1000);

  useEffect(() => {
    // HomeLayout의 <main> 요소가 실제 스크롤 컨테이너
    // window가 아닌 <main>에서 scroll 이벤트가 발생한다
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    const handleScroll = () => setScrollY(mainEl.scrollTop);
    mainEl.addEventListener("scroll", handleScroll);
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, []);

  // throttledScrollY가 바뀔 때만 실행 → 1초에 한 번만 로그 출력
  useEffect(() => {
    console.log("쓰로틀 적용 - throttledScrollY:", throttledScrollY);
  }, [throttledScrollY]);

  return (
    // min-h-[200dvh]: 스크롤 가능하도록 뷰포트 2배 높이
    <div className="min-h-[200dvh] flex flex-col items-center pt-16 gap-4">
      <div className="sticky top-10 bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold mb-4">쓰로틀링이 무엇일까요?</h1>
        <p className="text-gray-500 text-sm">
          실제 ScrollY (쓰로틀 ❌):{" "}
          <span className="text-blue-500 font-mono">
            {scrollY.toFixed(1)}px
          </span>
        </p>
        <p className="text-gray-500 text-sm mt-1">
          쓰로틀 ScrollY (1초 간격 ✅):{" "}
          <span className="text-green-500 font-mono">
            {throttledScrollY.toFixed(1)}px
          </span>
        </p>
      </div>
    </div>
  );
};

export default ThrottlePage;
