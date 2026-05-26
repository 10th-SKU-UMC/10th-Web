interface SearchbarProps {
  /** 현재 입력값 (부모가 관리하는 상태) */
  value: string;
  /** 입력값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 검색 버튼 클릭 시 즉시 실행 (선택) */
  onSearch?: () => void;
  placeholder?: string;
}

export default function Searchbar({
  value,
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요...",
}: SearchbarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 border border-zinc-600 bg-zinc-800 text-zinc-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-500 transition disabled:opacity-40"
        onClick={onSearch}
        disabled={!value.trim()}
      >
        검색
      </button>
    </div>
  );
}
