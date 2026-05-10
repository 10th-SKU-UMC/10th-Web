import { useEffect, useState } from "react";
import PlusButton from "../components/PlusButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { getLpList } from "../api/lp";
import type { ResponseLpListDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";

export default function LpPage() {
  const [lpList, setLpList] = useState<ResponseLpListDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLpList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLpList({
          limit: 30,
          order: PAGINATION_ORDER.desc,
        });
        setLpList(data);
      } catch {
        setError("LP 목록을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLpList();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {lpList?.data.data.map((lp) => (
          <div
            key={lp.id}
            className="group relative rounded-xl overflow-hidden shadow-lg bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-48 object-cover transition duration-300 group-hover:blur-sm group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="font-bold text-white text-center break-keep">
                {lp.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <PlusButton />
      </div>
    </div>
  );
}
