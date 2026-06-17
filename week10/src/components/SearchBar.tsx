import { memo, useState } from "react";

interface SearchBarProps {
  onSearch: (title: string, language: string, includeAdult: boolean) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("ko-KR");
  const [includeAdult, setIncludeAdult] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSearch(title, language, includeAdult);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-md shadow-md">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-8">
          <div className="flex-1 flex flex-col items-center gap-2">
            <label htmlFor="title">🎥 영화</label>
            <input
              className="w-64 border border-gray-300 rounded-md px-3 py-2 w-full"
              type="text"
              id="title"
              placeholder="영화 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <span>⚙️ 옵션</span>
            <label className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-full">
              <input
                type="checkbox"
                checked={includeAdult}
                onChange={(e) => setIncludeAdult(e.target.checked)}
              />
              성인 컨텐츠 표시
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="language">🌐 언어</label>
          <select
            id="language"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
            <option value="zh-CN">중국어</option>
          </select>
        </div>
        <button
          className="w-full self-center bg-[#60A5FA] text-white px-6 py-3 rounded-md hover:bg-[#3b82f6] transition"
          type="submit"
        >
          🔍 검색하기
        </button>
      </form>
    </div>
  );
}

export default memo(SearchBar);
