const LpCardSkeleton = () => (
  <div className="animate-pulse break-inside-avoid">
    <div className="aspect-square w-full bg-gray-800" />
  </div>
);

export const LpGridSkeleton = () => (
  <>
    {Array.from({ length: 12 }).map((_, i) => (
      <LpCardSkeleton key={i} />
    ))}
  </>
);

export default LpCardSkeleton;
