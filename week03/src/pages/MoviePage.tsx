import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MoviePageProps, MovieResponse } from "../types/movie";
import MovieItem from "../components/MovieItem";
import LoadingSpinner from "../components/LoadingSpinner";
import NotFound from "./NotFound";

const MoviePage = ({ category }: MoviePageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const TMBD_TOKEN = import.meta.env.VITE_TMDB_KEY;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchMovies = async () => {
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${TMBD_TOKEN}`,
            },
          },
        );

        setMovies(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <div>
      <div className="p-10 flex justify-center">
        <div className="grid gap-10 grid-cols-5">
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 p-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          이전
        </button>
        <p className="flex items-center">{page} 페이지</p>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MoviePage;
