const LpCardSkeleton = () => {
  return (
    <div className="relative block overflow-hidden rounded-sm aspect-square bg-gray-400 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-600 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <div className="h-3 bg-gray-500 rounded w-3/4" />
        <div className="h-2.5 bg-gray-500 rounded w-1/2" />
        <div className="h-2.5 bg-gray-500 rounded w-1/4" />
      </div>
    </div>
  );
};

export default LpCardSkeleton;
