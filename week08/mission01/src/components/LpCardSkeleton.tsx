const LpCardSkeleton = () => (
  <div className="mb-2 break-inside-avoid animate-pulse">
    <div className="aspect-square w-full rounded-sm bg-gray-800" />
  </div>
);

export const LpGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <LpCardSkeleton key={i} />
    ))}
  </>
);

export default LpCardSkeleton;
