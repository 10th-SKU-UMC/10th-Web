import type { Movie } from '../types/movie';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

function getRatingColor(rating: number): string {
  if (rating >= 7) return 'bg-green-500';
  if (rating >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function MovieCard({ movie, onClick }: Props) {
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
      })
    : '정보 없음';

  return (
    <button
      type="button"
      onClick={() => onClick(movie)}
      className="group w-full overflow-hidden rounded-xl bg-[#1a1a2e] text-left shadow-lg transition hover:ring-2 hover:ring-violet-500"
    >
      {/* 포스터 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2d2d44] text-xs text-gray-500">
            이미지 없음
          </div>
        )}
        {/* 평점 배지 */}
        <span
          className={`absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-xs font-bold text-white ${getRatingColor(movie.vote_average)}`}
        >
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      {/* 정보 */}
      <div className="p-3">
        <p className="mb-1 truncate text-sm font-semibold text-white">
          {movie.title}
        </p>
        <p className="mb-1.5 text-xs text-gray-400">{releaseYear}</p>
        <p className="line-clamp-2 text-xs text-gray-500">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>
    </button>
  );
}
