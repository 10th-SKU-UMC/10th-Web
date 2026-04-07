import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    useEffect(() => {
        if (!category) {
            setError(true);
            return;
        }

        const fetchmovies = async () => {
            setIsPending(true);
            setError(false);

            try {
                const { data } = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}`,
                    {
                        params: {
                            language: "ko-KR",
                            page,
                        },
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            "Content-Type": "application/json;charset=utf-8",
                        },
                    }
                );

                setMovies(data.results);
            } catch {
                setError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchmovies();
    }, [page, category]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">에러가 발생했습니다.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6 mt-5">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#c990d0] transition-all duration-300 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
                >
                    이전
                </button>

                <span>{page} 페이지</span>

                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-3 bg-[#a0c99f] text-white rounded-lg shadow-md hover:bg-[#8bb88a] transition-all duration-300 cursor-pointer"
                >
                    다음
                </button>
            </div>

            {isPending && (
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner />
                </div>
            )}

            {!isPending && !error && (
                <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    );
}