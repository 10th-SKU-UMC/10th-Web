import { useState } from "react";
import useThrottle from "../hooks/useThrottle";

export default function ThrottlePage() {
  const [rawScrollY, setRawScrollY] = useState<number>(0);
  const throttledScrollY = useThrottle<number>(rawScrollY, 2000);

  // window가 아닌 div 요소의 스크롤 이벤트를 처리하는 함수
  const handleDivScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // e.currentTarget.scrollTop이 해당 div 내부의 스크롤 위치를 나타냅니다.
    console.log("div 스크롤 중!", e.currentTarget.scrollTop);
    setRawScrollY(e.currentTarget.scrollTop);
  };

  return (
    // 1. 최상단 div를 브라우저 높이(h-screen)로 고정하고, 넘치는 내용(overflow-y-auto)을 스크롤하게 만듭니다.
    <div
      className="h-screen overflow-y-auto"
      onScroll={handleDivScroll} // 2. 여기에 직접 스크롤 이벤트를 답니다!
    >
      {/* 3. 스크롤이 생기도록 내부 콘텐츠의 높이를 강제로 늘립니다 (h-[200vh]) */}
      <div className="h-[200vh] flex flex-col items-center pt-[50vh] text-center">
        <div className="sticky top-1/2">
          <h1>Throttle Page</h1>
          <p>Throttled ScrollY : {throttledScrollY}px</p>
          <p className="text-gray-400 text-sm">실제 ScrollY : {rawScrollY}px</p>
        </div>
      </div>
    </div>
  );
}
