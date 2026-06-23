import { BsCart3 } from 'react-icons/bs';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { openModal } from '../features/modal/modalSlice';
import CartItem from './CartItem';

export default function CartList() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#1a1a2e] py-16 text-center">
        <BsCart3 size={48} className="text-gray-500" />
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
            <div className="mx-4 border-t border-white/[0.07] sm:mx-6" />
          )}
        </div>
      ))}

      {/* 전체 삭제 버튼 */}
      <div className="flex justify-center px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full max-w-xs rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 transition hover:border-violet-500 hover:text-violet-400 sm:w-auto sm:px-16 sm:py-3"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}
