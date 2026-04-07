import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetail, Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODQ2ZDIwMmIwMDQ5MzcyYzkxYTlmODFjMjZlYTU5YSIsIm5iZiI6MTc3NDk4MDk3OS4wNjQsInN1YiI6IjY5Y2MwZjczY2IyYjRhMzA5OWNhNDE5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qOvZ8YutakIzebPTpbjZHWTvV3u8cnXy_ZKt3yQSb88'; // MoviePage.tsx 토큰 그대로 복붙
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

const axiosConfig = {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
};

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const [movieRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(
                        `${BASE_URL}/movie/${movieId}?language=ko-KR`,
                        axiosConfig
                    ),
                    axios.get<Credits>(
                        `${BASE_URL}/movie/${movieId}/credits?language=ko-KR`,
                        axiosConfig
                    ),
                ]);
                setMovie(movieRes.data);
                setCredits(creditsRes.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchDetail();
    }, [movieId]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        );
    }

    const directors = credits?.crew.filter((c) => c.job === 'Director') ?? [];
    const cast = credits?.cast.slice(0, 20) ?? [];
    const people = [...directors, ...cast];

    return (
        <div className="text-white bg-black min-h-screen p-6">

            {/* 상단: 영화 정보 + 이미지 */}
            <div className="flex flex-col md:flex-row gap-6 mb-10">

                {/* 왼쪽: 텍스트 정보 */}
                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-3">{movie.title}</h1>
                    <p className="text-gray-300">평균 {movie.vote_average.toFixed(1)}</p>
                    <p className="text-gray-300">{movie.release_date?.slice(0, 4)}</p>
                    <p className="text-gray-300 mb-4">{movie.runtime}분</p>
                    {movie.tagline && (
                        <p className="text-yellow-400 italic mb-4">{movie.tagline}</p>
                    )}
                    <p className="text-gray-300 leading-relaxed">
                        {movie.overview || '줄거리 정보가 없습니다.'}
                    </p>
                </div>

                {/* 오른쪽: 배경 이미지 */}
                <div className="flex-1">
                    <img
                        src={`${IMG_BASE}/w780${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full rounded-2xl object-cover"
                    />
                </div>
            </div>

            {/* 구분선 */}
            <hr className="border-gray-700 mb-8" />

            {/* 감독/출연 */}
            <div>
                <h2 className="text-xl font-bold mb-6">감독/출연</h2>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {people.map((person, index) => (
                        <div key={`${person.id}-${index}`} className="flex-shrink-0 w-24 text-center">
                            <img
                                src={
                                    person.profile_path
                                        ? `${IMG_BASE}/w185${person.profile_path}`
                                        : undefined
                                }
                                alt={person.name}
                                className="w-20 h-20 rounded-full object-cover mx-auto mb-2 bg-gray-700"
                            />
                            <p className="text-sm font-semibold">{person.name}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {'character' in person ? person.character : person.job}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}