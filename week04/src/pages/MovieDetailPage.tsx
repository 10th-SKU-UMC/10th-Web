import { useParams, useNavigate } from 'react-router-dom';
import type { MovieDetail, Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';
import noProfile from '../assets/no_profile.png';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE  = 'https://image.tmdb.org/t/p';

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    // 영화 상세 정보 요청 (useCustomFetch 훅 사용)
    const {
        data: movie,
        isPending: moviePending,
        isError: movieError,
    } = useCustomFetch<MovieDetail>(
        `${BASE_URL}/movie/${movieId}?language=ko-KR`
    );

    // 감독/출연진 정보 요청 (useCustomFetch 훅 사용)
    const {
        data: credits,
        isPending: creditsPending,
        isError: creditsError,
    } = useCustomFetch<Credits>(
        `${BASE_URL}/movie/${movieId}/credits?language=ko-KR`
    );

    // 두 요청 중 하나라도 로딩 중이면 스피너 표시
    const isPending = moviePending || creditsPending;

    // 두 요청 중 하나라도 에러면 에러 표시
    const isError = movieError || creditsError;

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-dvh bg-black">
                <LoadingSpinner />
            </div>
        );
    }

    // API 에러 발생 시 에러 UI 표시
    if (isError || !movie) {
        return (
            <div className="flex flex-col items-center justify-center h-dvh gap-4">
                <span className="text-yellow-400 text-6xl">⚠️</span>
                <p className="text-black text-xl font-semibold">에러가 발생했습니다. 이용에 불편을 드려 죄송합니다.</p>
                <button
                    className="mt-2 px-6 py-3 bg-[#f3c4c4] text-black rounded-lg hover:bg-[#c4dab1] transition-all duration-200 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    // 감독 필터링 + 출연진 상위 20명 추출
    const directors = credits?.crew.filter((c) => c.job === 'Director') ?? [];
    const cast      = credits?.cast.slice(0, 20) ?? [];

    return (
        <div className="text-white bg-black min-h-screen">

            {/* 배경 이미지 헤더 (그라데이션 페이드아웃) */}
            <div className="relative w-full h-[400px]">
                <img
                    src={`${IMG_BASE}/w1280${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            </div>

            {/* 뒤로 가기 버튼 */}
            <button
                className="absolute top-20 left-6 px-4 py-2 bg-black/50 text-white rounded-lg
                hover:bg-black/80 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                onClick={() => navigate(-1)}
            >
                ← 뒤로
            </button>

            {/* 영화 정보 영역 */}
            <div className="px-8 pb-8 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* 포스터 이미지 */}
                    <div className="flex-shrink-0">
                        <img
                            src={`${IMG_BASE}/w342${movie.poster_path}`}
                            alt={movie.title}
                            className="w-48 rounded-xl shadow-2xl"
                        />
                    </div>

                    {/* 텍스트 정보 */}
                    <div className="flex flex-col justify-end">
                        <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>

                        {/* 평점 배지 */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-yellow-400 text-xl">★</span>
                            <span className="text-yellow-400 font-bold text-lg">
                                {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="text-gray-400 text-sm">/ 10</span>
                        </div>

                        {/* 개봉연도 · 상영시간 */}
                        <div className="flex gap-3 text-gray-400 text-sm mb-4">
                            <span>{movie.release_date?.slice(0, 4)}</span>
                            <span>·</span>
                            <span>{movie.runtime}분</span>
                        </div>

                        {/* 태그라인 */}
                        {movie.tagline && (
                            <p className="text-yellow-400 italic mb-4">{movie.tagline}</p>
                        )}

                        {/* 줄거리 */}
                        <p className="text-gray-300 leading-relaxed max-w-2xl">
                            {movie.overview || '줄거리 정보가 없습니다.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 구분선 */}
            <hr className="border-gray-700 mx-8 mb-8" />

            
            {/* 감독 (그리드) */}
            <div className="px-8 pb-12">
                <h2 className="text-xl font-bold mb-6">감독</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    {directors.map((person, index) => (
                        <div
                            key={`${person.id}-${index}`}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={
                                    person.profile_path
                                        ? `${IMG_BASE}/w185${person.profile_path}`
                                        : noProfile
                                }
                                alt={person.name}
                                className="w-16 h-16 rounded-full object-cover mb-2 bg-gray-700"
                            />
                            <p className="text-xs font-semibold leading-snug">{person.name}</p>
                            <p className="text-xs text-gray-400 mt-1 leading-snug">{person.job}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 출연진 (그리드) */}
            <div className="px-8 pb-10">
                <h2 className="text-xl font-bold mb-6">출연</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    {cast.map((person, index) => (
                        <div
                            key={`${person.id}-${index}`}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={
                                    person.profile_path
                                        ? `${IMG_BASE}/w185${person.profile_path}`
                                        : noProfile
                                }
                                alt={person.name}
                                className="w-16 h-16 rounded-full object-cover mb-2 bg-gray-700"
                            />
                            <p className="text-xs font-semibold leading-snug">{person.name}</p>
                            <p className="text-xs text-gray-400 mt-1 leading-snug">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
