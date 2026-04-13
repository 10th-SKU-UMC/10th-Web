import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Movie, MovieResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';
import MovieCard from '../components/MovieCard';

const BASE_URL = 'https://api.themoviedb.org/3';

// 카테고리
const CATEGORY_LABELS: Record<string, string> = {
    now_playing: '- 현재 상영중 -',
    popular:     '- 인기 영화 -',
    top_rated:   '- 최고 평점 -',
    upcoming:    '- 개봉 예정 -',
};

export default function MoviePage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    // useCustomFetch 훅으로 데이터, 로딩, 에러 상태를 한번에 관리
    const { data, isPending, isError } = useCustomFetch<MovieResponse>(
        `${BASE_URL}/movie/${category}?language=ko-KR&page=${page}`
    );

    // data가 null인 경우(초기 상태) 빈 배열로 초기화
    const movies: Movie[] = data?.results ?? [];

    // 카테고리 한국어 제목 (매핑 없으면 영문 그대로 표시)
    const categoryLabel = CATEGORY_LABELS[category ?? ''] ?? category;

    // API 에러 발생 시 에러 UI 표시
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-dvh gap-4">
                <span className="text-yellow-400 text-6xl">⚠️</span>
                <p className="text-white text-xl font-semibold">에러가 발생했습니다. 이용에 불편을 드려 죄송합니다.</p>
                <button
                    className="mt-2 px-6 py-3 bg-[#dda5e3] text-white rounded-lg hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#a6abb5] text-white">

            {/* 카테고리 제목 */}
            <h1 className="text-2xl text-[#222435] text-center font-bold px-10 pt-8 pb-2">{categoryLabel}</h1>

            {/* 로딩 스피너 */}
            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}

            {/* 영화 카드 목록 */}
            {!isPending && (
                <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}

            {/* 페이지네이션 (하단) */}
            <div className="flex items-center justify-center gap-6 py-8">
                {/* page가 1이면 이전 버튼 자리를 빈 공간으로 유지 */}
                {page > 1 ? (
                    <button
                        className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow-md
                        hover:bg-[#a3bac8] transition-all duration-200 cursor-pointer text-lg"
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        «
                    </button>
                ) : (
                    <div className="px-5 py-2 text-lg invisible">«</div>
                )}
                <span className="text-lg font-semibold">
                    {page}
                </span>
                <button
                    className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow-md
                    hover:bg-[#a3bac8] transition-all duration-200
                    cursor-pointer text-lg"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    »
                </button>
            </div>

        </div>
    );
}
