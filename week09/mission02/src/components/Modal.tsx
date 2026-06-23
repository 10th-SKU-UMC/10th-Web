import useAppDispatch from '../hooks/useAppDispatch';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart, calculateTotals } from '../features/cart/cartSlice';

export default function Modal() {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(calculateTotals());
    dispatch(closeModal());
  };

  return (
    /* 오버레이 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* 모달 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        className="mx-4 w-full max-w-sm rounded-2xl bg-[#1a1a2e] p-8 shadow-2xl"
      >
        <p className="mb-8 text-center text-base font-semibold text-white">
          정말 삭제하시겠습니까?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
