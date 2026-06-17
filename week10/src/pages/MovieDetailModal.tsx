import { useMemo } from "react";
import type { MovieDetails } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

interface MovieDetailModalProps {
  movieId: number;
  onClose: () => void;
}

export default function MovieDetailModal({
  movieId,
  onClose,
}: MovieDetailModalProps) {
  const requestConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    }),
    [],
  );

  const {
    data: movieDetails,
    loading: movieLoading,
    error: movieError,
  } = useCustomFetch<MovieDetails>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-US`
      : "",
    requestConfig,
  );

  const isPending = movieLoading;
  const isError = movieError;
  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">요청에 실패하였습니다.</span>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh bg-black/95">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[680px] max-h-[90vh] bg-[#1a1a2e] rounded-lg overflow-hidden shadow-2xl">
        {/* 상단 배경 이미지 + 제목 오버레이 */}
        <div className="relative h-[260px] overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movieDetails?.backdrop_path}`}
            alt={`${movieDetails?.title} 영화의 이미지`}
            className="w-full h-full object-cover object-center"
          />
          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* 제목 (좌하단) */}
          <div className="absolute bottom-4 left-5">
            <h1 className="text-2xl font-bold text-white leading-tight">
              {movieDetails?.title}
            </h1>
            {movieDetails?.tagline && (
              <p className="text-sm text-gray-300 mt-0.5">
                {movieDetails.tagline}
              </p>
            )}
          </div>

          {/* X 닫기 버튼 (우상단) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 하단 콘텐츠 카드 */}
        <div className="flex gap-5 p-5 bg-[#f5f5f5]">
          {/* 좌측: 포스터 */}
          <div className="flex-shrink-0 w-[140px]">
            <img
              src={`https://image.tmdb.org/t/p/w300${movieDetails?.poster_path}`}
              alt={`${movieDetails?.title} 포스터`}
              className="w-full rounded-md shadow-md object-cover"
            />
          </div>

          {/* 우측: 정보 */}
          <div className="flex-1 min-w-0">
            {/* 평점 */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-800">
                {movieDetails?.vote_average?.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({movieDetails?.vote_count?.toLocaleString()} 평가)
              </span>
            </div>

            {/* 개봉일 */}
            <div className="mb-3 text-center">
              <p className="text-xs text-gray-500 mb-0.5">개봉일</p>
              <p className="text-sm font-medium text-gray-800">
                {movieDetails?.release_date
                  ?.replace(/-/g, "년 ")
                  .replace(/-/, "월 ")
                  .concat("일")}
              </p>
            </div>

            {/* 인기도 */}
            <div className="mb-3 text-center">
              <p className="text-xs text-gray-500 mb-1">인기도</p>
              <div className="w-full bg-gray-300 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(((movieDetails?.popularity ?? 0) / 500) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* 줄거리 */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1 text-center">줄거리</p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-5">
                {movieDetails?.overview}
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.location.href = `https://www.imdb.com/title/${movieDetails?.imdb_id}`;
                }}
                className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium rounded transition-colors"
              >
                IMDb에서 검색
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
