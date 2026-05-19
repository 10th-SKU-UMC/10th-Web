import { Link } from "react-router-dom";
import type { Lp } from "../../types/lp";

type LpCardProps = {
  lp: Lp;
};

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="relative group block overflow-hidden rounded-sm aspect-square"
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
          No Image
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h2 className="text-white font-semibold text-sm line-clamp-1">
          {lp.title}
        </h2>
        <p className="text-gray-300 text-xs mt-1">
          {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
        </p>
        <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
          <span>♥</span>
          <span>{lp.likes.length}</span>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
