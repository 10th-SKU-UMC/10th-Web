import { useDispatch } from "react-redux";
import { closeModal } from "../features/modal/modalSlice";
import { clearCart } from "../features/cart/cartSlice";

export default function Modal() {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-80 rounded-xl bg-white p-6 text-center shadow-2xl">
        <h4 className="mb-6 text-lg font-bold text-gray-900">
          장바구니의 모든 음반을
          <br />
          삭제하시겠습니까?
        </h4>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => dispatch(closeModal())}
            className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            아니요
          </button>

          <button
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
            className="rounded-lg border-2 border-red-500 bg-red-500 px-6 py-2 font-semibold text-white transition hover:bg-red-600 hover:border-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
