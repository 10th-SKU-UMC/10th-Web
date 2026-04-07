import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  const handleClick = () => {
    if (!category) return;
    navigate(`/movies/${category}/${movie.id}`);
  };

  return (
    <div
      className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg w-44 transition-transform duration-500 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
      />

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-xl font-bold leading-snug mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}