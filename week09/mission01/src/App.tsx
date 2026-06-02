import { useEffect } from 'react';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import CartTotals from './components/CartTotals';
import useAppDispatch from './hooks/useAppDispatch';
import useAppSelector from './hooks/useAppSelector';
import { calculateTotals } from './store/cartSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  // 수량·아이템 변경이 있을 때마다 총 수량·총 금액 자동 재계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] font-sans">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <CartList />
        <CartTotals />
      </main>
    </div>
  );
}
