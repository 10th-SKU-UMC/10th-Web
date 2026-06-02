import type { CartItemType } from "../constants/cartItems";
import { usePlaylistStore } from "../store/usePlaylistStore";

interface CartItemProps {
  item: CartItemType;
}

function CartItem({ item }: CartItemProps) {
  const { increase, decrease, removeItem } = usePlaylistStore();

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
      {/* 앨범 이미지 */}
      <img
        src={item.img}
        alt={item.title}
        className="w-20 h-20 rounded-xl object-cover shrink-0 shadow"
      />

      {/* 곡 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{item.singer}</p>
        <p className="text-sm font-bold text-indigo-600 mt-1">
          ₩ {item.price.toLocaleString()}
        </p>
      </div>

      {/* 수량 조절 + 삭제 */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        {/* 수량 증가 버튼 */}
        <button
          onClick={() => increase(item.id)}
          className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg
                     hover:bg-indigo-200 active:scale-95 transition-all flex items-center justify-center"
        >
          +
        </button>

        {/* 현재 수량 */}
        <span className="text-sm font-bold text-gray-700 w-6 text-center">
          {item.amount}
        </span>

        {/* 수량 감소 버튼 */}
        <button
          onClick={() => decrease(item.id)}
          className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg
                     hover:bg-indigo-200 active:scale-95 transition-all flex items-center justify-center"
        >
          -
        </button>

        {/* 개별 삭제 버튼 */}
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default CartItem;
