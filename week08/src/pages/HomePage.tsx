import { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps, searchLps } from "../apis/lp";
import type { SortOrder } from "../types/lp";
import LpCard from "../components/LpCard";
import Searchbar from "../components/Searchbar";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useDebounce } from "../hooks/useDebounce";
import FloatingButton from "../components/FloatingButton";

const SkeletonCard = () => (
  <div className="aspect-square bg-zinc-700 animate-pulse rounded" />
);

const InitialSkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// ── 정렬 레이블 ──────────────────────────────

const SORT_LABEL: Record<SortOrder, string> = {
  desc: "🕐 최신순",
  asc: "🕰 오래된순",
};

// ── 메인 컴포넌트 ─────────────────────────────

const HomePage = () => {
  const [order, setOrder] = useState<SortOrder>("desc");

  // ── 검색 상태 ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * useDebounce: 사용자 입력이 300ms 동안 멈춘 뒤에 값을 갱신합니다.
   * → 연속 타이핑 중에는 API 호출이 발생하지 않아 불필요한 서버 요청을 줄입니다.
   */
  const debouncedQuery = useDebounce(searchQuery.trim(), 300);

  // ── 검색 모드 여부 ──────────────────────────
  const isSearchMode = debouncedQuery.length > 0;

  // ── [1] 일반 LP 목록 쿼리 ──────────────────
  const {
    data: listData,
    isPending: listPending,
    isError: listError,
    refetch: listRefetch,
    fetchNextPage: listFetchNext,
    hasNextPage: listHasNext,
    isFetchingNextPage: listFetchingNext,
  } = useInfiniteQuery({
    queryKey: ["lps", order],
    queryFn: ({ pageParam }) => getLps(order, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNext
        ? (lastPage.data.nextCursor ?? undefined)
        : undefined,
    staleTime: 1000 * 60 * 3, // 3분 — 동일 정렬 재방문 시 재요청 방지
  });

  // ── [2] 검색 결과 쿼리 ─────────────────────
  /**
   * queryKey에 debouncedQuery를 포함합니다.
   * → 검색어가 바뀔 때마다 새 쿼리로 처리되어 자동으로 fetch합니다.
   *
   * enabled: 빈 문자열이면 쿼리 실행 자체를 막아 불필요한 서버 요청 차단.
   */
  const {
    data: searchData,
    isPending: searchPending,
    isError: searchError,
    refetch: searchRefetch,
    fetchNextPage: searchFetchNext,
    hasNextPage: searchHasNext,
    isFetchingNextPage: searchFetchingNext,
  } = useInfiniteQuery({
    queryKey: ["lps", "search", debouncedQuery],
    queryFn: ({ pageParam }) => searchLps(debouncedQuery, order, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNext
        ? (lastPage.data.nextCursor ?? undefined)
        : undefined,
    enabled: isSearchMode, // 빈 검색어일 때 쿼리 비활성화
    staleTime: 1000 * 60 * 2, // 2분 — 같은 검색어 재요청 방지
  });

  // ── 현재 모드에 맞는 값 선택 ────────────────
  const data = isSearchMode ? searchData : listData;
  const isPending = isSearchMode ? searchPending : listPending;
  const isError = isSearchMode ? searchError : listError;
  const refetch = isSearchMode ? searchRefetch : listRefetch;
  const fetchNextPage = isSearchMode ? searchFetchNext : listFetchNext;
  const hasNextPage = isSearchMode ? searchHasNext : listHasNext;
  const isFetchingNextPage = isSearchMode
    ? searchFetchingNext
    : listFetchingNext;

  // 모든 페이지의 LP를 하나의 배열로 flatten
  const lps = data?.pages.flatMap((page) => page.data?.data ?? []) ?? [];

  // enabled 옵션이 조건 제어를 담당하므로 콜백은 fetchNextPage만 호출
  const handleIntersect = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // hasNextPage && !isFetchingNextPage 일 때만 Observer 활성화
  const sentinelRef = useIntersectionObserver(handleIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <div className="p-4">
      {/* 검색바 */}
      <div className="mb-4">
        <Searchbar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="LP 제목을 검색하세요..."
        />
      </div>

      {/* 정렬 토글 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition"
        >
          {SORT_LABEL[order]}
        </button>
      </div>

      {/* 검색 모드 안내 */}
      {isSearchMode && (
        <p className="text-zinc-400 text-sm mb-3">
          <span className="text-blue-400 font-medium">"{debouncedQuery}"</span>{" "}
          검색 결과
        </p>
      )}

      {/* 초기 로딩 — 전체 스켈레톤 */}
      {isPending && isSearchMode && <InitialSkeletonGrid />}

      {/* 일반 목록 초기 로딩 */}
      {listPending && !isSearchMode && <InitialSkeletonGrid />}

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-zinc-400">데이터를 불러오는 데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 그리드 */}
      {!isPending && !isError && (
        <>
          {lps.length === 0 && !isFetchingNextPage ? (
            <p className="text-center text-zinc-500 py-20">
              {isSearchMode
                ? `"${debouncedQuery}"에 해당하는 LP가 없습니다.`
                : "등록된 LP가 없습니다."}
            </p>
          ) : (
            // 스켈레톤 카드를 LP 카드와 같은 grid 안에 두어 자연스럽게 이어지게 함
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {lps.map((lp) => (
                <LpCard
                  key={lp.id}
                  id={lp.id}
                  title={lp.title}
                  thumbnail={lp.thumbnail}
                  createdAt={lp.createdAt}
                  likes={lp.likes}
                />
              ))}
              {/* 다음 페이지 로딩 중 — 같은 그리드에 skeleton 카드 append */}
              {isFetchingNextPage &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`sk-${i}`} />
                ))}
            </div>
          )}

          {/* Intersection sentinel — 뷰포트 진입 시 fetchNextPage 트리거 */}
          <div ref={sentinelRef} className="h-10" aria-hidden="true" />
        </>
      )}
      <FloatingButton />
    </div>
  );
};

export default HomePage;
