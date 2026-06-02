import { usePlaylistStore } from '../store/usePlaylistStore';

function Navbar() {
  const { amount } = usePlaylistStore();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* 로고 */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold text-gray-900 text-lg">UMC Playlist</span>
        </div>

        {/* 장바구니 아이콘 + 수량 뱃지 */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>

          {amount > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold
                             w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {amount > 99 ? '99+' : amount}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
