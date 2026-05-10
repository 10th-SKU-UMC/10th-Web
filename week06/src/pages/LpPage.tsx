import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PlusButton from "../components/PlusButton";
import { getLpList } from "../api/lp";
import type { ResponseLpListDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";

const SKELETON_COUNT = 10;

export default function LpPage() {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-lg bg-gray-800 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-700" />
              <div className="p-3">
                <div className="h-4 w-3/4 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-4 p-10">
          <p className="text-red-500">LP 목록을 불러오는 데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {lpList?.data.data.map((lp) => (
            <div
              key={lp.id}
              className="group relative rounded-xl overflow-hidden shadow-lg bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-48 object-cover transition duration-300 group-hover:blur-sm group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-bold text-white text-center break-keep">
                  {lp.title}
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
