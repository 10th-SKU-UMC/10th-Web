import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useGetLp from "../hooks/queries/useGetLp";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";
import usePostComment from "../hooks/mutations/usePostComment";
import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import useToggleLike from "../hooks/mutations/useToggleLike";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "../components/CommentCard/CommentSkeleton";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isPending, isError } = useGetLp(Number(lpId));
  const { data: myInfo } = useGetMyInfo(isAuthenticated);
  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleLike(Number(lpId));
  const { mutate: updateLp, isPending: isUpdating } = useUpdateLp(Number(lpId));
  const { mutate: deleteLpMutate, isPending: isDeleting } = useDeleteLp(Number(lpId));

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");
  const [commentTouched, setCommentTouched] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editThumbnail, setEditThumbnail] = useState<string | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editFileRef = useRef<HTMLInputElement>(null);

  const { mutate: submitComment, isPending: isSubmitting } = usePostComment(Number(lpId));
  const { mutate: updateCommentMutate, isPending: isUpdatingComment } = useUpdateComment(Number(lpId));
  const { mutate: deleteCommentMutate, isPending: isDeletingComment } = useDeleteComment(Number(lpId));

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const handleCommentSubmit = () => {
    if (commentInput.trim().length === 0) return;
    submitComment(commentInput.trim(), {
      onSuccess: () => {
        setCommentInput("");
        setCommentTouched(false);
      },
    });
  };

  const handleCommentEditStart = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setOpenMenuId(null);
  };

  const handleCommentEditSave = (commentId: number) => {
    if (editingCommentContent.trim().length === 0) return;
    updateCommentMutate(
      { commentId, content: editingCommentContent.trim() },
      { onSuccess: () => setEditingCommentId(null) },
    );
  };

  const handleCommentDelete = (commentId: number) => {
    deleteCommentMutate(commentId, {
      onSuccess: () => setOpenMenuId(null),
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
    if (openMenuId === null) return;
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

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
  const isLiked = lp.likes.some((like) => like.userId === myInfo?.data?.id);
  const likeCount = lp.likes.length;

  const handleEditStart = () => {
    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditThumbnail(lp.thumbnail || null);
    setEditTags(lp.tags.map((t) => t.name));
    setEditTagInput("");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateLp(
      {
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbnail: editThumbnail ?? undefined,
        tags: editTags,
        published: true,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditThumbnail(URL.createObjectURL(file));
  };

  const addEditTag = () => {
    const trimmed = editTagInput.trim();
    if (!trimmed || editTags.includes(trimmed)) return;
    setEditTags((prev) => [...prev, trimmed]);
    setEditTagInput("");
  };

  const handleEditTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEditTag();
    }
  };

  const removeEditTag = (tag: string) => {
    setEditTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleDeleteConfirm = () => {
    deleteLpMutate(undefined, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-gray-50 min-h-full px-6 py-10">
      {/* 비로그인 경고 모달 */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-80">
            <h2 className="text-lg font-bold text-gray-900">로그인이 필요합니다</h2>
            <p className="text-sm text-gray-500 text-center">
              상세 페이지는 로그인 후 이용할 수 있습니다.
            </p>
            <button
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-80">
            <h2 className="text-lg font-bold text-gray-900 text-center">
              {lp.title}을 삭제하시겠습니까?
            </h2>
            <p className="text-sm text-gray-500 text-center">삭제된 LP는 복구할 수 없습니다.</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 hover:text-gray-800 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-xl shadow-md px-8 py-6 flex flex-col items-center gap-4 w-[1000px] min-h-[750px]">
        {/* 수정/삭제 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editContent.trim()}
              className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          )}
          <button
            onClick={isEditing ? () => setIsEditing(false) : handleEditStart}
            className="text-sm text-gray-500 hover:text-blue-500 border border-gray-200 px-3 py-1.5 rounded-md hover:border-blue-400 transition-colors cursor-pointer"
          >
            수정
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 px-3 py-1.5 rounded-md hover:border-red-400 transition-colors cursor-pointer"
          >
            삭제
          </button>
        </div>

        {/* 비닐 레코드 */}
        <div
          onClick={() => isEditing && editFileRef.current?.click()}
          className={`relative shrink-0 flex items-center justify-center w-72 h-72 rounded-full shadow-2xl overflow-hidden ${
            isEditing ? "cursor-pointer" : "animate-[spin_8s_linear_infinite]"
          }`}
        >
          {(isEditing ? editThumbnail : lp.thumbnail) ? (
            <img
              src={isEditing ? editThumbnail! : lp.thumbnail}
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
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/20 rounded-full">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          )}
        </div>
        <input
          ref={editFileRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="hidden"
        />

        {/* 제목 */}
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 text-center border-b-2 border-blue-400 outline-none w-full bg-transparent pb-1"
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900 text-center">{lp.title}</h1>
        )}

        {/* 업로드일 */}
        <p className="text-sm text-gray-400">
          {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
        </p>

        {/* 본문 */}
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="text-sm text-gray-600 leading-relaxed w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-400 transition-colors resize-none"
          />
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap text-center">
            {lp.content}
          </p>
        )}

        {/* 태그 편집 (수정 모드) */}
        {isEditing && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={handleEditTagKeyDown}
                placeholder="태그를 입력하세요"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={addEditTag}
                disabled={!editTagInput.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {editTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeEditTag(tag)}
                      className="text-blue-400 hover:text-blue-600 cursor-pointer leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 좋아요 버튼 */}
        <button
          onClick={() => toggleLike({ isLiked, userId: myInfo?.data?.id ?? 0 })}
          disabled={isLikeLoading}
          className="absolute bottom-6 flex flex-col items-center gap-1 cursor-pointer group disabled:opacity-50"
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
          <span className={`text-sm font-medium ${isLiked ? "text-red-400" : "text-gray-400"}`}>
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
              onChange={(e) => {
                if (e.target.value.length <= 1000) setCommentInput(e.target.value);
              }}
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
              <span className="text-gray-400">{commentInput.trim().length}/1000</span>
            ) : null}
          </div>
        </div>

        {/* 댓글 아이템 */}
        {isCommentPending
          ? Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)
          : comments?.pages
              ?.flatMap((page) => page.data.data)
              .map((comment) => {
                const isMyComment = myInfo?.data?.id === comment.authorId;
                const isEditingThis = editingCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-start gap-3"
                  >
                    {/* 아바타 */}
                    <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {comment.author?.profileImage ? (
                        <img
                          src={comment.author.profileImage}
                          alt={comment.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      )}
                    </div>

                    {/* 본문 */}
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {comment.author?.name ?? "알 수 없음"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>

                      {isEditingThis ? (
                        <div className="flex items-center gap-2 mt-1">
                          <textarea
                            value={editingCommentContent}
                            onChange={(e) => setEditingCommentContent(e.target.value)}
                            rows={2}
                            className="flex-1 resize-none border border-blue-400 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleCommentEditSave(comment.id)}
                              disabled={isUpdatingComment || editingCommentContent.trim().length === 0}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdatingComment ? "저장 중" : "저장"}
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-xs border border-gray-300 text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                      )}
                    </div>

                    {/* 본인 댓글 메뉴 */}
                    {isMyComment && !isEditingThis && (
                      <div className="relative shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === comment.id ? null : comment.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                        {openMenuId === comment.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-24">
                            <button
                              onClick={() => handleCommentEditStart(comment.id, comment.content)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              disabled={isDeletingComment}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isDeletingComment ? "삭제 중..." : "삭제"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
        {isCommentFetching &&
          !isCommentPending &&
          Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`more-${i}`} />)}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};

export default LpDetailPage;
