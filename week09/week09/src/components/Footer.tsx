import { usePlaylistStore } from "../store/usePlaylistStore";

function Footer() {
  const { openModal } = usePlaylistStore();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8 flex justify-center">
        <button
          onClick={openModal}
          className="px-6 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-semibold
                     hover:bg-red-100 active:scale-95 transition-all border border-red-100"
        >
          전체 삭제
        </button>
      </div>
    </footer>
  );
}

export default Footer;
