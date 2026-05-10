import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PlusButton from "../components/PlusButton";
import LpCardSkeleton from "../components/LpCardSkeleton";
import ErrorState from "../components/ErrorState";
import { getLpList } from "../api/lp";
import type { ResponseLpListDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";

export default function LpPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: lpList,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useQuery<ResponseLpListDto>({
    queryKey: ["lps", sort],
    queryFn: () => getLpList({ limit: 30, order: sort }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const toggleSort = () => {
    setSort((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc,
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSort}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
        >
          {sort === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
          {isFetching && !isPending && (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {lpList?.data.data.map((lp) => (
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
      )}

      <div className="fixed bottom-6 right-6">
        <PlusButton />
      </div>
    </div>
  );
}
