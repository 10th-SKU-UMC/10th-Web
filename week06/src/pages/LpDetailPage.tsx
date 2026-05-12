import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLpLike, getLp, postLpLike } from "../api/lp";
import { getMyInfo } from "../api/auth";
import type { ResponseLpDto, Tag } from "../types/lp";
import type { ResponseMyInfoDto } from "../types/auth";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";

const getTagName = (tag: Tag) => tag.name ?? tag.tag?.name;

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useQuery<ResponseLpDto>({
    queryKey: ["lp", lpid],
    queryFn: () => getLp(lpid!),
    enabled: !!lpid,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const { data: me } = useQuery<ResponseMyInfoDto>({
    queryKey: ["me"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  const myId = me?.data.id;
  const isLiked = !!(
    myId && lp?.data.likes.some((like) => like.userId === myId)
  );

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? deleteLpLike(lpid!) : postLpLike(lpid!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
      queryClient.invalidateQueries({ queryKey: ["lps"] });
    },
  });

  if (isPending) {
    return (
      <div className="px-6 md:px-20 py-10 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-2/3 bg-gray-700 rounded mb-4" />
        <div className="h-4 w-1/3 bg-gray-700 rounded mb-8" />
        <div className="w-full aspect-square max-w-md mx-auto bg-gray-700 rounded-xl mb-8" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-700 rounded" />
          <div className="h-4 w-4/6 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <ErrorState
        message="LP 정보를 불러오는 데 실패했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  const detail = lp.data;
  const createdAt = new Date(detail.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const tags = (detail.tags ?? []).filter((t) => getTagName(t));

  return (
    <div className="px-6 md:px-20 py-10 max-w-4xl mx-auto text-white">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="text-3xl font-bold break-keep">{detail.title}</div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3 py-1.5 rounded-lg bg-gray-600 text-sm font-medium hover:bg-gray-600 transition-colors">
            수정
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-red-600 text-sm font-medium hover:bg-red-500 transition-colors">
            삭제
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-8">업로드일 {createdAt}</p>

      <div className="mb-8">
        <img
          src={detail.thumbnail}
          alt={detail.title}
          className="w-full max-w-md mx-auto aspect-square object-cover rounded-xl shadow-lg"
        />
      </div>

      <div className="flex mb-8 text-black text-2xl justify-center items-center font-">
        {detail.title}
      </div>

      <div className="mb-8">
        <p className="leading-relaxed whitespace-pre-line text-black">
          {detail.content}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 rounded-full bg-gray-700 text-xs"
            >
              #{getTagName(tag)}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center pt-6 border-t border-gray-700">
        <button
          onClick={() => {
            if (!accessToken) {
              alert("로그인이 필요합니다.");
              return;
            }
            likeMutation.mutate();
          }}
          disabled={likeMutation.isPending}
          aria-pressed={isLiked}
          className={`flex items-center gap-2 px-5 py-2 rounded-full transition-colors font-medium disabled:opacity-60 ${
            isLiked
              ? "bg-pink-500 hover:bg-pink-400 text-white"
              : "bg-pink-300 hover:bg-pink-500 text-white"
          }`}
        >
          <span>{isLiked ? "♥" : "♡"}</span>
          <span>{detail.likes.length}</span>
        </button>
      </div>
    </div>
  );
}
