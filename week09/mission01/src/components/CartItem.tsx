import useAppDispatch from '../hooks/useAppDispatch';
import { increase, decrease, removeItem, calculateTotals } from '../store/cartSlice';
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
    <div className="flex items-center gap-5 px-6 py-5">
      {/* 앨범 썸네일 */}
      <img
        src={item.img}
        alt={item.title}
        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover shadow-md"
      />

      {/* 앨범 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-base font-semibold text-white">{item.title}</p>
        <p className="truncate text-sm text-gray-400">{item.singer}</p>
        <p className="mt-1 text-sm font-bold text-violet-400">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>

      {/* 수량 조절 + 삭제 */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d2d44] text-lg text-white transition hover:bg-violet-600"
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
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d2d44] text-lg text-white transition hover:bg-violet-600"
          aria-label="수량 증가"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:text-red-400"
          aria-label="아이템 삭제"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
