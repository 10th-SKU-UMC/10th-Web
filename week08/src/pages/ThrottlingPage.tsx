import { useState } from "react";
import { useThrottle } from "../hooks/useThrottle";

export default function ThrottlingPage() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useThrottle(keyword, 300);

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-8 bg-white min-h-[calc(100vh-60px)]">
      <div>
        <div className="text-3xl font-bold text-blue-600">useThrottle</div>
      </div>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full max-w-md px-4 py-2 bg-white border border-blue-200 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
        <div className="p-4 bg-white border border-blue-200 rounded-md shadow-sm">
          <div className="text-xs text-gray-500 mb-1">실시간 값</div>
          <div className="font-mono text-blue-600 break-all">
            {keyword || "(없음)"}
          </div>
        </div>
        <div className="p-4 bg-white border border-blue-200 rounded-md shadow-sm">
          <div className="text-xs text-gray-500 mb-1">쓰로틀링 값 (300ms)</div>
          <div className="font-mono text-blue-600 break-all">
            {debouncedKeyword || "(없음)"}
          </div>
        </div>
      </div>
    </div>
  );
}
