import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment, deleteComment } from "../apis/lp";
import type { SortOrder } from "../apis/dto";
import { useAuth } from "../hooks/useAuth";

const CommentSkeleton = () => (
  <div className="flex animate-pulse gap-3 py-3">
    <div className="h-9 w-9 shrink-0 rounded-full bg-gray-700" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-24 rounded bg-gray-700" />
      <div className="h-3 w-full rounded bg-gray-700" />
    </div>
  </div>
);

const CommentSkeletonList = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </>
);

interface CommentSectionProps {
  lpId: number;
}

export default function CommentSection({ lpId }: CommentSectionProps) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<SortOrder>("desc");
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, sort],
    queryFn: ({ pageParam }) => getComments(lpId, sort, pageParam as number | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? (lastPage.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60,
  });

  const comments = data?.pages.flatMap((p) => p.data.data) ?? [];

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const createMutation = useMutation({
    mutationFn: () => createComment(lpId, { content: input.trim() }),
    onSuccess: () => {
      setInput("");
      setInputError("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const handleSubmit = () => {
    if (!input.trim()) {
      setInputError("댓글 내용을 입력해주세요.");
      return;
    }
    if (input.trim().length > 500) {
      setInputError("댓글은 500자 이내로 입력해주세요.");
      return;
    }
    setInputError("");
    createMutation.mutate();
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "방금 전";
    if (mins < 60) return `${mins}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div className="mt-10 border-t border-gray-800 px-6 py-6">
      {/* Header + sort */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">댓글</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              sort === "asc"
                ? "bg-white text-black"
                : "border border-gray-600 text-gray-400 hover:border-white hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              sort === "desc"
                ? "bg-white text-black"
                : "border border-gray-600 text-gray-400 hover:border-white hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* Input */}
      {userId && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (inputError) setInputError("");
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="댓글을 입력해주세요"
              maxLength={500}
              className="flex-1 rounded-md border border-gray-600 bg-[#111] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="rounded-md bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-600 disabled:opacity-50"
            >
              작성
            </button>
          </div>
          {inputError && (
            <p className="mt-1 text-xs text-red-400">{inputError}</p>
          )}
        </div>
      )}

      {/* Comment list */}
      {isLoading ? (
        <CommentSkeletonList />
      ) : comments.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">첫 댓글을 남겨보세요!</p>
      ) : (
        <ul className="space-y-1 divide-y divide-gray-800">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start gap-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">
                {comment.author?.name?.charAt(0) ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {comment.author?.name ?? `User ${comment.authorId}`}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-0.5 break-words text-sm text-gray-300">{comment.content}</p>
              </div>
              {userId === comment.authorId && (
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(comment.id)}
                  disabled={deleteMutation.isPending}
                  className="shrink-0 text-xs text-gray-500 transition hover:text-red-400"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isFetchingNextPage && <CommentSkeletonList count={3} />}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
