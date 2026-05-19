import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLpDetail, deleteLp, addLike, removeLike } from "../apis/lp";
import { useAuth } from "../hooks/useAuth";
import CommentSection from "../components/CommentSection";

const formatDate = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

const DetailSkeleton = () => (
  <div className="mx-auto max-w-2xl animate-pulse px-6 py-10">
    <div className="mb-4 h-6 w-1/3 rounded bg-gray-800" />
    <div className="mb-6 h-10 w-2/3 rounded bg-gray-800" />
    <div className="mx-auto mb-6 aspect-square w-64 rounded-full bg-gray-800" />
    <div className="mb-4 h-4 w-full rounded bg-gray-800" />
    <div className="mb-4 h-4 w-5/6 rounded bg-gray-800" />
  </div>
);

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  const id = Number(lpid);

  // 비로그인 사용자 접근 시 경고 모달 → /login으로 이동
  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [accessToken, navigate, location.pathname]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["lp", id],
    queryFn: () => getLpDetail(id),
    enabled: !isNaN(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/");
    },
  });

  const [thumbError, setThumbError] = useState(false);

  const lp = data?.data;
  const isLiked = userId != null && (lp?.likes ?? []).some((l) => l.userId === userId);

  const likeMutation = useMutation({
    mutationFn: () => (isLiked ? removeLike(id) : addLike(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", id] });
    },
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
        <p>LP를 불러오는 데 실패했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Author + date */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">
          {lp.author?.name?.charAt(0) ?? "?"}
        </div>
        <span className="font-medium text-white">{lp.author?.name ?? `User ${lp.authorId}`}</span>
        <span className="ml-auto text-sm text-gray-400">{formatDate(lp.createdAt)}</span>
      </div>

      {/* Title + edit/delete */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{lp.title}</h1>
        {accessToken && userId === lp.authorId && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/lps/${id}/edit`)}
              className="text-gray-400 transition hover:text-white"
              aria-label="수정"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-gray-400 transition hover:text-red-400"
              aria-label="삭제"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail - circular vinyl */}
      <div className="mx-auto mb-8 flex w-64 items-center justify-center">
        {lp.thumbnail && !thumbError ? (
          <div className="relative h-64 w-64">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full rounded-full object-cover"
              onError={() => setThumbError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gray-900" />
            </div>
          </div>
        ) : (
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gray-800">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#4b5563" strokeWidth="1" />
              <circle cx="12" cy="12" r="3" stroke="#4b5563" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="mb-6 text-center text-sm leading-relaxed text-gray-300">{lp.content}</p>

      {/* Tags */}
      {lp.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-sm text-gray-400"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Like */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-2 rounded-full border px-6 py-2 transition ${
            isLiked
              ? "border-pink-500 text-pink-400"
              : "border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-400"
          }`}
        >
          <span>♥</span>
          <span>{lp.likes?.length ?? 0}</span>
        </button>
      </div>

      <CommentSection lpId={id} />
    </div>
  );
}
