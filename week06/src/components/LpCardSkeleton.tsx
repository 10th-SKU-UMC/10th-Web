type Props = {
  count?: number;
};

export default function LpCardSkeleton({ count = 10 }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden shadow-lg bg-gray-800 animate-pulse"
        >
          <div className="w-full h-48 bg-gray-700" />
          <div className="p-3">
            <div className="h-4 w-3/4 bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
