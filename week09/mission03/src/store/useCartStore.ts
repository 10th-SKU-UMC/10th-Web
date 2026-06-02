import { create } from 'zustand';
import cartItemsData, { type CartItem } from '../constants/cartItems';

interface CartStore {
  // 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;

  // 카트 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  // 초기 상태
  cartItems: cartItemsData,
  amount: cartItemsData.reduce((sum, item) => sum + item.amount, 0),
  total: cartItemsData.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0,
  ),
  isOpen: false,

  // 카트 액션
  increase: (id) =>
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );
      return { cartItems };
    }),

  decrease: (id) =>
    set((state) => {
      const cartItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0);
      return { cartItems };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => ({
      amount: state.cartItems.reduce((sum, item) => sum + item.amount, 0),
      total: state.cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0,
      ),
    })),

  // 모달 액션
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useCartStore;
