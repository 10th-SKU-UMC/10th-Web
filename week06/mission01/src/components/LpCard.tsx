import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../apis/dto";

const formatDate = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

const VinylIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#4b5563" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="#4b5563" strokeWidth="1.5" />
  </svg>
);

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const showFallback = !lp.thumbnail || imgError;

  return (
    <div
      className="group relative mb-2 cursor-pointer overflow-hidden break-inside-avoid"
      onClick={() => navigate(`/lps/${lp.id}`)}
    >
      {showFallback ? (
        <div className="flex h-48 w-full items-center justify-center bg-gray-800">
          <VinylIcon />
        </div>
      ) : (
        <img
          src={lp.thumbnail!}
          alt={lp.title}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="truncate text-sm font-semibold text-white">{lp.title}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-300">
          <span>{formatDate(lp.createdAt)}</span>
          <span className="flex items-center gap-1">
            <span className="text-pink-400">♥</span>
            {lp.likes?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
