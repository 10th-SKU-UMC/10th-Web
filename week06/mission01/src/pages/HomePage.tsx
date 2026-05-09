import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lp";
import type { SortOrder } from "../apis/dto";
import LpCard from "../components/LpCard";
import { LpGridSkeleton } from "../components/LpCardSkeleton";

export default function HomePage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOrder>("desc");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["lps", sort],
    queryFn: () => getLps(sort),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.data?.data ?? [];

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
            <p className="col-span-full py-20 text-center text-gray-500">
              등록된 LP가 없습니다.
            </p>
          ) : (
            lps.map((lp) => <LpCard key={lp.id} lp={lp} />)
          )}
        </div>
      )}

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
