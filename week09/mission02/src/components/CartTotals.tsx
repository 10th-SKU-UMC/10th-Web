import useAppSelector from '../hooks/useAppSelector';

export default function CartTotals() {
  const { amount, total } = useAppSelector((state) => state.cart);

  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#1c2333] px-5 py-4 shadow-xl sm:px-7 sm:py-5">
      <div className="text-sm text-gray-400">
        총 수량&nbsp;
        <span className="text-base font-bold text-white">{amount}개</span>
      </div>
      <div className="text-sm text-gray-400">
        총 금액&nbsp;
        <span className="text-lg font-extrabold text-violet-400 sm:text-xl">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
