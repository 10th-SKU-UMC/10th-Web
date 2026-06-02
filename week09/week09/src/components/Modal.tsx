import { usePlaylistStore } from "../store/usePlaylistStore";

function Modal() {
  const { isOpen, closeModal, confirmClear } = usePlaylistStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-4">
        <p className="text-lg font-bold text-gray-800">정말 삭제하시겠어요?</p>
        <p className="text-sm text-gray-500">전체 음반이 장바구니에서 제거돼요</p>

        <div className="flex gap-3 mt-2 w-full">
          <button
            onClick={closeModal}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600
                       text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"
          >
            아니요
          </button>

          <button
            onClick={confirmClear}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white
                       text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
