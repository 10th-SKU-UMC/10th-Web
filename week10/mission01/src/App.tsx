import { useState, useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchForm from './components/SearchForm';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { searchMovies } from './api/movieApi';
import type { Language, Movie, SearchParams } from './types/movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<Language>('ko-KR');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchParams],
    queryFn: () => searchMovies(searchParams!),
    enabled: searchParams !== null,
  });

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query: query.trim(), includeAdult, language });
  }, [query, includeAdult, language]);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const movies = useMemo(() => data?.results ?? [], [data]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* 헤더 */}
        <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          🎬 Movie Search
        </h1>

        {/* 검색 폼 */}
        <SearchForm
          query={query}
          includeAdult={includeAdult}
          language={language}
          onQueryChange={setQuery}
          onAdultChange={setIncludeAdult}
          onLanguageChange={setLanguage}
          onSubmit={handleSubmit}
        />

        {/* 로딩 */}
        {isLoading && (
          <p className="mt-10 text-center text-sm text-gray-400">검색 중...</p>
        )}

        {/* 에러 */}
        {isError && (
          <p className="mt-10 text-center text-sm text-red-400">
            검색 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}

        {/* 결과 없음 */}
        {!isLoading && !isError && searchParams && movies.length === 0 && (
          <p className="mt-10 text-center text-sm text-gray-500">
            "{searchParams.query}"에 대한 검색 결과가 없습니다.
          </p>
        )}

        {/* 영화 카드 그리드 */}
        {movies.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>
        )}
      </div>

      {/* 영화 상세 모달 */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </div>
  );
}
