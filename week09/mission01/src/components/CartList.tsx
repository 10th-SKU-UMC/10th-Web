import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearCart, calculateTotals } from '../store/cartSlice';
import CartItem from './CartItem';

export default function CartList() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(calculateTotals());
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#1a1a2e] py-16 text-center">
        <p className="text-4xl">🛒</p>
        <p className="text-lg font-semibold text-white">장바구니가 비어 있습니다.</p>
        <p className="text-sm text-gray-500">음반을 담아보세요!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#1a1a2e] shadow-2xl">
      {cartItems.map((item, i) => (
        <div key={item.id}>
          <CartItem item={item} />
          {i < cartItems.length - 1 && (
            <div className="mx-6 border-t border-white/[0.07]" />
          )}
        </div>
      ))}

      {/* 전체 삭제 버튼 */}
      <div className="flex justify-center px-6 py-5">
        <button
          type="button"
          onClick={handleClearCart}
          className="rounded-xl border border-white/20 px-10 py-2.5 text-sm font-semibold text-white/80 transition hover:border-violet-500 hover:text-violet-400"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}
