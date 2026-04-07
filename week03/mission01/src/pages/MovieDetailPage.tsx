import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type {
  Cast,
  CreditsResponse,
  Crew,
  MovieDetail,
} from "../types/movie";

export default function MovieDetailPage() {
  const { movieId, category } = useParams<{ movieId: string; category: string }>();
  const navigate = useNavigate();

  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [directors, setDirectors] = useState<Crew[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) {
      setError(true);
      return;
    }

    const fetchMovieDetailData = async () => {
      setIsPending(true);
      setError(false);

      try {
        const [detailResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            {
              params: { language: "ko-KR" },
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                "Content-Type": "application/json;charset=utf-8",
              },
            }
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                "Content-Type": "application/json;charset=utf-8",
              },
            }
          ),
        ]);

        setMovieDetail(detailResponse.data);
        setCasts(creditsResponse.data.cast.slice(0, 10));
        setDirectors(
          creditsResponse.data.crew.filter(
            (crewMember) => crewMember.job === "Director"
          )
        );
      } catch {
        setError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetailData();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movieDetail) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-500 text-lg">상세 정보를 불러오는 중 오류가 발생했습니다.</p>
        <button
          onClick={() => navigate(category ? `/movies/${category}` : "/")}
          className="px-6 py-3 rounded-lg bg-[#dda5e3] text-white hover:bg-[#c990d0] transition-all duration-300"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="w-full h-[420px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetail.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
            alt={`${movieDetail.title} 포스터`}
            className="w-72 rounded-2xl shadow-2xl"
          />

          <div className="flex-1 pt-6">
            <p className="text-pink-300 mb-2">{movieDetail.tagline}</p>

            <h1 className="text-4xl font-bold mb-3">{movieDetail.title}</h1>

            <p className="text-zinc-300 mb-4">
              {movieDetail.original_title}
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <span className="px-3 py-1 bg-zinc-800 rounded-full">
                개봉일 {movieDetail.release_date}
              </span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full">
                평점 {movieDetail.vote_average.toFixed(1)}
              </span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full">
                러닝타임 {movieDetail.runtime}분
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movieDetail.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-[#dda5e3] text-white rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">줄거리</h2>
              <p className="text-zinc-200 leading-8">{movieDetail.overview}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">감독</h2>
              <div className="flex flex-wrap gap-3">
                {directors.length > 0 ? (
                  directors.map((director) => (
                    <span
                      key={director.id}
                      className="px-4 py-2 bg-zinc-800 rounded-lg"
                    >
                      {director.name}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-400">감독 정보가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pb-16">
          <h2 className="text-2xl font-semibold mb-6">출연진</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {casts.map((actor) => (
              <div
                key={actor.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg"
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 bg-zinc-800 flex items-center justify-center text-zinc-400">
                    이미지 없음
                  </div>
                )}

                <div className="p-4">
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}