import { useCallback, useState } from "react";
import { type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import SearchBar from "../components/SearchBar";
import MovieDetailModal from "./MovieDetailModal";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const [searchUrl, setSearchUrl] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const { category } = useParams<{
    category: string;
  }>();

  const url =
    searchUrl ||
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;

  const { data, loading, error } = useCustomFetch<MovieResponse>(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    },
  });

  const handleSearch = useCallback(
    (title: string, language: string, includeAdult: boolean) => {
      setSearchUrl(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          title,
        )}&language=${language}&include_adult=${includeAdult}`,
      );
    },
    [],
  );

  if (error) {
    return (
      <div>
        <span className="text-red-500 text-2xl">Error</span>
      </div>
    );
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      {!searchUrl && (
        <div className="flex items-center justify-center gap-6 mt-5">
          <button
            className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
            hover:bg-[#b2dab1] trasition-all duration-200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={(): void => setPage((prev): number => prev - 1)}
          >
            {"<"}
          </button>

          <button
            className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
            hover:bg-[#b2dab1] trasition-all duration-200 
            cursor-pointer"
            onClick={(): void => setPage((prev): number => prev + 1)}
          >
            {">"}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!loading && (
        <div className="p-10 gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={setSelectedMovieId}
            />
          ))}
        </div>
      )}
      {selectedMovieId && (
        <MovieDetailModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </>
  );
}
