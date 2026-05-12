import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useGetLp from "../hooks/queries/useGetLp";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";
import usePostComment from "../hooks/mutations/usePostComment";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "../components/CommentCard/CommentSkeleton";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isPending, isError } = useGetLp(Number(lpId));
  const [isLiked, setIsLiked] = useState(false);
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");
  const [commentTouched, setCommentTouched] = useState(false);

  const { mutate: submitComment, isPending: isSubmitting } = usePostComment(Number(lpId));

  const handleCommentSubmit = () => {
    if (commentInput.trim().length === 0) return;
    submitComment(commentInput.trim(), {
      onSuccess: () => {
        setCommentInput("");
        setCommentTouched(false);
      },
    });
  };

  const {
    data: comments,
    isFetching: isCommentFetching,
    isPending: isCommentPending,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteCommentList(Number(lpId), order);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isCommentFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isCommentFetching, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">LP를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const lp = data.data;
  const likeCount = lp.likes.length + (isLiked ? 1 : 0);

  return (
    <div className="flex flex-col items-center gap-6 bg-gray-50 min-h-full px-6 py-10">
      {/* 비로그인 경고 모달 */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-80">
            <h2 className="text-lg font-bold text-gray-900">
              로그인이 필요합니다
            </h2>
            <p className="text-sm text-gray-500 text-center">
              상세 페이지는 로그인 후 이용할 수 있습니다.
            </p>
            <button
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-xl shadow-md px-8 py-6 flex flex-col items-center gap-4 w-[1000px] h-[750px]">
        {/* 수정/삭제 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="text-sm text-gray-500 hover:text-blue-500 border border-gray-200 px-3 py-1.5 rounded-md hover:border-blue-400 transition-colors cursor-pointer">
            수정
          </button>
          <button className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 px-3 py-1.5 rounded-md hover:border-red-400 transition-colors cursor-pointer">
            삭제
          </button>
        </div>

        {/* 비닐 레코드 */}
        <div className="relative shrink-0 flex items-center justify-center w-72 h-72 rounded-full shadow-2xl overflow-hidden animate-[spin_8s_linear_infinite]">
          {lp.thumbnail ? (
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-black/50 rounded-full" />
          <div className="absolute w-64 h-64 rounded-full border border-white/10" />
          <div className="absolute w-56 h-56 rounded-full border border-white/10" />
          <div className="absolute w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute w-40 h-40 rounded-full border border-white/10" />
          <div className="absolute w-15 h-15 rounded-full bg-white z-20" />
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {lp.title}
        </h1>

        {/* 업로드일 */}
        <p className="text-sm text-gray-400">
          {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
        </p>

        {/* 본문 */}
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap text-center">
          {lp.content}
        </p>

        {/* 좋아요 버튼 */}
        <button
          onClick={() => setIsLiked((prev) => !prev)}
          className="absolute bottom-6 flex flex-col items-center gap-1 cursor-pointer group"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={isLiked ? "#ef4444" : "none"}
            stroke={isLiked ? "#ef4444" : "#9ca3af"}
            strokeWidth="2"
            className="transition-all duration-200 group-hover:scale-110"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span
            className={`text-sm font-medium ${isLiked ? "text-red-400" : "text-gray-400"}`}
          >
            {likeCount}
          </span>
        </button>
      </div>
      {/* 댓글 영역 */}
      <div className="w-[1000px] flex flex-col gap-4">
        {/* 정렬 토글 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">댓글</span>
          <div className="flex border border-gray-300 rounded-md overflow-hidden text-sm">
            <button
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                order === PAGINATION_ORDER.desc
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
              className={`px-3 py-1.5 border-l border-gray-300 transition-colors cursor-pointer ${
                order === PAGINATION_ORDER.asc
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* 댓글 작성란 */}
        <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onBlur={() => setCommentTouched(true)}
              placeholder="댓글을 입력해주세요."
              rows={1}
              className={`flex-1 resize-none border rounded-lg px-4 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-400 leading-6 ${
                commentTouched && commentInput.trim().length === 0
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={commentInput.trim().length === 0 || isSubmitting}
              className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "등록"}
            </button>
          </div>
          <div className="text-xs min-h-4 px-1">
            {commentTouched && commentInput.trim().length === 0 ? (
              <span className="text-red-400">댓글 내용을 입력해주세요.</span>
            ) : commentInput.trim().length > 0 ? (
              <span className="text-gray-400">{commentInput.trim().length}자</span>
            ) : null}
          </div>
        </div>

        {/* 댓글 아이템 */}
        {isCommentPending
          ? Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)
          : comments?.pages
              ?.flatMap((page) => page.data.data)
              .map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-start gap-3"
            >
              <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {comment.author?.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {comment.author?.name ?? "알 수 없음"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        {isCommentFetching && !isCommentPending &&
          Array.from({ length: 2 }).map((_, i) => (
            <CommentSkeleton key={`more-${i}`} />
          ))}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};

export default LpDetailPage;
