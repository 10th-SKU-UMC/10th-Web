import { create } from "zustand";
import cartItems from "../constants/cartItems";

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: number;
  img: string;
  amount: number;
}

interface AppState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;

  increase: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  openModal: () => void;
  closeModal: () => void;
}

const initialAmount = cartItems.reduce((acc, item) => acc + item.amount, 0);
const initialTotal = cartItems.reduce(
  (acc, item) => acc + item.price * item.amount,
  0,
);

export const useStore = create<AppState>((set) => ({
  cartItems: cartItems,
  amount: initialAmount,
  total: initialTotal,
  isOpen: false,

  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount >= 1),
    })),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => {
      let totalAmount = 0;
      let totalPrice = 0;
      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.price * item.amount;
      });
      return { amount: totalAmount, total: totalPrice };
    }),

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
