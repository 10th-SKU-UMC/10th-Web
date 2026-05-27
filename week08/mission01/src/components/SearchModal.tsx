import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchLps, searchLpsByTag, type SearchType } from "../apis/lp";
import { useDebounce } from "../hooks/useDebounce";
import LpCard from "./LpCard";

const RECENT_KEY = "recentSearches";
const MAX_RECENT = 8;

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: "title", label: "제목" },
  { value: "tag", label: "태그" },
];

function getRecentSearches(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    // 파싱 결과가 배열이 아닐 경우 런타임 오류 방어
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const prev = getRecentSearches();
    const next = [query, ...prev.filter((q) => q !== query)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {}
}

interface Props {
  onClose: () => void;
}

export default function SearchModal({ onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [typeOpen, setTypeOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const debouncedQuery = useDebounce(query, 300);
  const trimmed = debouncedQuery.trim();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", trimmed, searchType],
    queryFn: ({ pageParam }) =>
      searchType === "tag"
        ? searchLpsByTag(trimmed, "desc", pageParam as number | undefined)
        : searchLps(trimmed, "desc", pageParam as number | undefined),
    getNextPageParam: (last) =>
      last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  const results = data?.pages.flatMap((p) => p.data.data) ?? [];


  /* 무한 스크롤 — IntersectionObserver */
  useEffect(() => {
    if (!bottomRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* 모달 열리면 input 포커스 */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && query.trim().length > 0) {
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleClearAll = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const selectedLabel = SEARCH_TYPES.find((t) => t.value === searchType)?.label ?? "제목";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-16"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-2xl flex-col rounded-xl bg-[#111] shadow-2xl" style={{ maxHeight: "80vh" }}>
        {/* 검색 입력 */}
        <div className="flex items-center gap-2 border-b border-gray-800 p-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-gray-400">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />
          {/* 검색 타입 드롭다운 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTypeOpen((p) => !p)}
              className="flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-300 transition hover:border-gray-500"
            >
              {selectedLabel}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {typeOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-20 rounded-md border border-gray-700 bg-[#1a1a1a] py-1 shadow-lg">
                {SEARCH_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setSearchType(t.value); setTypeOpen(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs transition hover:bg-gray-800 ${
                      searchType === t.value ? "text-pink-400" : "text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="overflow-y-auto p-4">
          {/* 검색 전 — 최근 검색어 */}
          {trimmed.length === 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">최근 검색어</span>
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-gray-500 transition hover:text-gray-300"
                  >
                    모두 지우기
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-600">최근 검색어가 없습니다.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleRecentClick(term)}
                      className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300 transition hover:border-gray-500 hover:text-white"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 검색 결과 */}
          {trimmed.length > 0 && (
            <>
              {isLoading ? (
                <div className="columns-2 gap-3 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="mb-3 h-48 animate-pulse rounded-xl bg-gray-800" />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <p className="text-sm text-gray-400">검색 중 오류가 발생했습니다.</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded bg-pink-500 px-4 py-2 text-sm text-white transition hover:bg-pink-600"
                  >
                    다시 시도
                  </button>
                </div>
              ) : results.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">검색 결과가 없습니다.</p>
              ) : (
                <div className="columns-2 gap-3">
                  {results.map((lp) => (
                    <div
                      key={lp.id}
                      className="mb-3 break-inside-avoid"
                      onClick={() => {
                        if (trimmed.length > 0) {
                          saveRecentSearch(trimmed);
                          setRecentSearches(getRecentSearches());
                        }
                        onClose();
                      }}
                    >
                      <LpCard lp={lp} />
                    </div>
                  ))}
                </div>
              )}
              {/* 무한 스크롤 트리거 */}
              <div ref={bottomRef} className="h-4" />
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
