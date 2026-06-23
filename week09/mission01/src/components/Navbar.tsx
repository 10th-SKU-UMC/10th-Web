import { BsCart3 } from 'react-icons/bs';
import useAppSelector from '../hooks/useAppSelector';

export default function Navbar() {
  const { amount } = useAppSelector((state) => state.cart);

  return (
    <nav className="flex items-center justify-between bg-[#111827] px-4 py-4 shadow-lg sm:px-8">
      <span className="text-lg font-bold tracking-widest text-white sm:text-xl">
        Noir
      </span>

      <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-5 py-2.5 text-white transition hover:bg-white/15 sm:px-6 sm:py-3">
        <BsCart3 size={18} />
        <span className="min-w-[1ch] text-sm font-bold">{amount}</span>
      </div>
    </nav>
  );
}
