import { useEffect } from "react";
import { useStore } from "../store/useStore";
import Modal from "../components/Modal";

export default function CartPage() {
  const {
    cartItems,
    amount,
    total,
    isOpen,
    increase,
    decrease,
    calculateTotals,
    openModal,
  } = useStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  if (amount < 1) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gray-50">
        <nav className="flex w-full justify-center bg-blue-600 px-8 py-4 shadow-md">
          <div className="flex w-full max-w-3xl items-center justify-between text-white">
            <h1 className="text-2xl font-bold tracking-wider">Zustand Cart</h1>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-sm font-bold shadow-sm">
                0
              </div>
            </div>
          </div>
        </nav>
        <main className="w-full max-w-3xl px-4 py-32 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-wide text-gray-800">
            장바구니가 비어 있습니다
          </h2>
          <p className="text-gray-500">선택하신 음반 상품이 없습니다.</p>
        </main>
      </div>
    );
  }
  return (
    <>
      {isOpen && <Modal />}

      <div className="flex min-h-screen flex-col items-center bg-gray-50">
        {/* 상단 네비게이션 */}
        <nav className="flex w-full justify-center bg-blue-600 px-8 py-4 shadow-md">
          <div className="flex w-full max-w-3xl items-center justify-between text-white">
            <h1 className="text-2xl font-bold tracking-wider">Zustand Cart</h1>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-sm font-bold shadow-sm">
                {amount}
              </div>
            </div>
          </div>
        </nav>

        <main className="w-full max-w-3xl px-4 py-12">
          <h2 className="mb-8 text-center text-3xl font-bold uppercase tracking-widest text-gray-800">
            당신의 장바구니
          </h2>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold tracking-wide text-gray-800">
                      {item.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-500">{item.singer}</p>
                    <p className="font-medium text-blue-600">
                      ₩{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={() => increase(item.id)}
                    className="p-1 text-blue-600 transition hover:text-blue-800"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  <p className="text-lg font-medium text-gray-800">
                    {item.amount}
                  </p>

                  <button
                    onClick={() => decrease(item.id)}
                    className="p-1 text-blue-600 transition hover:text-blue-800"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-12 border-t-2 border-gray-200 pt-6">
            <div className="mb-6 flex items-center justify-between text-xl font-bold text-gray-800">
              <span>총 금액</span>
              <span>₩{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => openModal()}
                className="rounded-lg border-2 border-red-500 px-8 py-2 font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500 hover:text-white"
              >
                장바구니 초기화
              </button>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
