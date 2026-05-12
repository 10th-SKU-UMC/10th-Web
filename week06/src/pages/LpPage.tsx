import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PlusButton from "../components/PlusButton";
import LpCardSkeleton from "../components/LpCardSkeleton";
import ErrorState from "../components/ErrorState";
import { getLpList } from "../api/lp";
import type { ResponseLpListDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const PAGE_SIZE = 30;

export default function LpPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data,
    isPending,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lps", sort] as const,
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getLpList({ cursor: pageParam, limit: PAGE_SIZE, order: sort }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ResponseLpListDto) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor ?? undefined : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const triggerRef = useInfiniteScroll<HTMLDivElement>(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  const toggleSort = () => {
    setSort((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc,
    );
  };

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSort}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
        >
          {sort === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
          {isFetching && !isPending && !isFetchingNextPage && (
            <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-white align-middle" />
          )}
        </button>
      </div>

      {isPending ? (
        <LpCardSkeleton />
      ) : isError ? (
        <ErrorState
          message="LP 목록을 불러오는 데 실패했습니다."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {lps.map((lp) => (
              <div
                key={lp.id}
                onClick={() => navigate(`/lp/${lp.id}`)}
                className="group relative rounded-xl overflow-hidden shadow-lg bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-48 object-cover transition duration-300 group-hover:blur-sm group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="font-bold text-white text-center break-keep line-clamp-2">
                    {lp.title}
                  </p>
                  <p className="text-xs text-gray-200">
                    {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-200 flex items-center gap-1">
                    <span aria-hidden>♥</span>
                    <span>{lp.likes.length}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="mt-6">
              <LpCardSkeleton count={5} />
            </div>
          )}

          {hasNextPage && <div ref={triggerRef} className="h-10" />}

          {!hasNextPage && lps.length > 0 && (
            <p className="text-center text-gray-500 mt-8">
              마지막 LP까지 모두 불러왔습니다.
            </p>
          )}
        </>
      )}

      <div className="fixed bottom-6 right-6">
        <PlusButton />
      </div>
    </div>
  );
}
