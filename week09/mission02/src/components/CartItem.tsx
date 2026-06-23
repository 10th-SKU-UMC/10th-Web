import useAppDispatch from '../hooks/useAppDispatch';
import { increase, decrease, removeItem, calculateTotals } from '../features/cart/cartSlice';
import type { CartItem as CartItemType } from '../constants/cartItems';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    dispatch(increase(item.id));
    dispatch(calculateTotals());
  };

  const handleDecrease = () => {
    dispatch(decrease(item.id));
    dispatch(calculateTotals());
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
    dispatch(calculateTotals());
  };

  return (
    <div className="flex items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
      {/* 앨범 썸네일 */}
      <img
        src={item.img}
        alt={item.title}
        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-md sm:h-16 sm:w-16 sm:rounded-xl"
      />

      {/* 앨범 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-white sm:text-base">
          {item.title}
        </p>
        <p className="truncate text-xs text-gray-400 sm:text-sm">{item.singer}</p>
        <p className="mt-1 text-xs font-bold text-violet-400 sm:text-sm">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>

      {/* 수량 조절 + 삭제 */}
      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d2d44] text-base text-white transition hover:bg-violet-600 sm:h-9 sm:w-9 sm:text-lg"
          aria-label="수량 감소"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-bold text-white">
          {item.amount}
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d2d44] text-base text-white transition hover:bg-violet-600 sm:h-9 sm:w-9 sm:text-lg"
          aria-label="수량 증가"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:text-red-400 sm:ml-1 sm:h-9 sm:w-9"
          aria-label="아이템 삭제"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
