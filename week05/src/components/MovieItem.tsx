import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieItemProps {
  movie: Movie;
}

export default function MovieItem({ movie }: MovieItemProps) {
  const navigate = useNavigate();
  const gotoMovieDetail = () => {
    navigate(`/movie/${movie.id}`);
  };

  const [isHover, setIsHover] = useState(false);

  return (
    <div>
      <div
        className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer 
      w-44 transition-transform duration-500 hover:scale-110"
        onClick={gotoMovieDetail}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img
          src={`http://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={`${movie.title}`}
        ></img>

        {isHover && (
          <div className="absolute inset-0 backdrop-blur-md flex flex-col justify-center items-center text-white p-4">
            <div className="text-lg font-bold">{movie.title}</div>
            <div className="line-clamp-5 text-sm">{movie.overview}</div>
          </div>
        )}
      </div>
    </div>
  );
}
