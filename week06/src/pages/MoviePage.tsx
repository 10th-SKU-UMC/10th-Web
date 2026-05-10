import { useState } from "react";
import type { MoviePageProps, MovieResponse } from "../types/movie";
import MovieItem from "../components/MovieItem";
import LoadingSpinner from "../components/LoadingSpinner";
import NotFound from "./NotFound";
import useCustomFetch from "../hooks/useCustomFetch";

const MoviePage = ({ category }: MoviePageProps) => {
  const [page, setPage] = useState(1);

  const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`;

  const { data, isLoading, error } = useCustomFetch<MovieResponse>(url);

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
          {data?.results.map((movie) => (
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
