import useAppSelector from '../hooks/useAppSelector';

export default function Navbar() {
  const { amount } = useAppSelector((state) => state.cart);

  return (
    <nav className="flex items-center justify-between bg-[#111827] px-8 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎵</span>
        <span className="text-xl font-bold tracking-tight text-white">
          Ohtani Ahn
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-white">
        <span className="text-lg">🛒</span>
        <span className="text-sm font-bold">{amount}</span>
      </div>
    </nav>
  );
}
