import { usePlaylistStore } from '../store/usePlaylistStore';

function CartTotals() {
  const { amount, total } = usePlaylistStore();

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* 구분선 */}
      <div className="h-px bg-gray-100 mb-4" />

      <div className="flex justify-between items-center">
        {/* 총 수량 */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">총 수량</p>
          <p className="text-xl font-bold text-gray-800">
            {amount.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">개</span>
          </p>
        </div>

        {/* 세로 구분선 */}
        <div className="w-px h-10 bg-gray-200" />

        {/* 총 금액 */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">총 금액</p>
          <p className="text-xl font-bold text-indigo-600">
            ₩ {total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartTotals;
