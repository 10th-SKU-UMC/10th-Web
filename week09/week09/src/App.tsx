import { useEffect } from "react";
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import CartTotals from "./components/CartTotals";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { usePlaylistStore } from "./store/usePlaylistStore";

function App() {
  const { cartItems, calculateTotals } = usePlaylistStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 네비바 */}
      <Navbar />

      {/* 본문 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 페이지 타이틀 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">담아둔 음반 목록</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            수량을 조절하거나 삭제할 수 있어요
          </p>
        </div>

        {/* 음반 리스트 */}
        <CartList />

        {/* 총 수량 & 총 금액 */}
        <CartTotals />
      </div>

      {/* 푸터 - 전체 삭제 버튼 중앙 배치 */}
      <Footer />

      {/* 확인 모달 - isOpen이 true일 때만 렌더링 */}
      <Modal />
    </div>
  );
}

export default App;
