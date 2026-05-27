interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({ message, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-message"
    >
      <div className="relative w-80 rounded-xl bg-[#2a2a2a] px-8 py-8 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
          aria-label="닫기"
        >
          ✕
        </button>

        <p id="confirm-modal-message" className="mb-8 text-center text-base text-white">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-md bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            예
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-pink-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
