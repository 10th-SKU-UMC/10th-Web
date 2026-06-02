import { useEffect } from 'react';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import CartTotals from './components/CartTotals';
import useAppDispatch from './hooks/useAppDispatch';
import useAppSelector from './hooks/useAppSelector';
import { calculateTotals } from './features/cart/cartSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  // 수량·아이템 변경이 있을 때마다 총 수량·총 금액 자동 재계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-6 sm:max-w-2xl sm:px-6 sm:py-8 lg:max-w-3xl xl:max-w-4xl">
        <CartList />
        <CartTotals />
      </main>
    </div>
  );
}
