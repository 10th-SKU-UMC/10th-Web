const CommentSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-start gap-3 animate-pulse">
      {/* 프로필 이미지 */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-gray-200" />

      {/* 내용 */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
