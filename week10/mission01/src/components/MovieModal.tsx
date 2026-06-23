import type { Movie } from '../types/movie';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

interface Props {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: Props) {
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE}${movie.poster_path}`
    : null;
  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE}${movie.backdrop_path}`
    : posterUrl;

  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '정보 없음';

  const popularityPercent = Math.min(movie.popularity / 100, 1) * 100;

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* 모달 박스 */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#111827] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 백드롭 이미지 */}
        <div className="relative h-52 w-full overflow-hidden sm:h-64">
          {backdropUrl ? (
            <img src={backdropUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[#1a1a2e]" />
          )}
          {/* 아래로 자연스럽게 페이드 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
        </div>

        {/* X 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
        >
          ✕
        </button>

        {/* 제목 영역 */}
        <div className="relative z-10 -mt-6 px-6 pb-4">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{movie.title}</h2>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="mt-0.5 text-sm text-gray-400">{movie.original_title}</p>
          )}
        </div>

        {/* 본문 영역 */}
        <div className="flex gap-5 px-6 pb-6">
          {/* 포스터 */}
          {posterUrl && (
            <div className="hidden w-28 flex-shrink-0 sm:block">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* 상세 정보 */}
          <div className="flex-1 space-y-4">
            {/* 평점 */}
            <div>
              <span className="text-2xl font-extrabold text-violet-400">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="ml-1.5 text-sm text-gray-400">
                ({movie.vote_count.toLocaleString()} 평가)
              </span>
            </div>

            {/* 개봉일 */}
            <div>
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
                개봉일
              </p>
              <p className="text-sm text-white">{releaseDate}</p>
            </div>

            {/* 인기도 */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                인기도
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${popularityPercent}%` }}
                />
              </div>
            </div>

            {/* 줄거리 */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                줄거리
              </p>
              <p className="line-clamp-4 text-sm leading-relaxed text-gray-300">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 border-t border-white/10 px-6 py-4">
          <a
            href={imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            IMDb에서 검색
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
