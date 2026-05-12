import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lp";
import type { SortOrder } from "../apis/dto";
import LpCard from "../components/LpCard";
import { LpGridSkeleton } from "../components/LpCardSkeleton";

export default function HomePage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOrder>("desc");
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam }) => getLps(sort, pageParam as number | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  const lps = data?.pages.flatMap((p) => p.data.data) ?? [];

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="relative min-h-full p-6">
      {/* Sort buttons */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setSort("asc")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            sort === "asc"
              ? "bg-white text-black"
              : "border border-gray-600 text-gray-300 hover:border-white hover:text-white"
          }`}
        >
          오래된순
        </button>
        <button
          type="button"
          onClick={() => setSort("desc")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            sort === "desc"
              ? "bg-white text-black"
              : "border border-gray-600 text-gray-300 hover:border-white hover:text-white"
          }`}
        >
          최신순
        </button>
      </div>

      {/* Grid */}
      {isError ? (
        <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
          <p>데이터를 불러오는 데 실패했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className="[column-count:2] sm:[column-count:3] md:[column-count:4] lg:[column-count:5]">
          {isLoading ? (
            <LpGridSkeleton />
          ) : lps.length === 0 ? (
            <p className="py-20 text-center text-gray-500">등록된 LP가 없습니다.</p>
          ) : (
            lps.map((lp) => <LpCard key={lp.id} lp={lp} />)
          )}
          {isFetchingNextPage && <LpGridSkeleton count={5} />}
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={bottomRef} className="h-4" />

      {/* Floating + button */}
      <button
        type="button"
        onClick={() => navigate("/lps/new")}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl text-white shadow-lg transition hover:bg-pink-600"
      >
        +
      </button>
    </div>
  );
}
