import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems, { type CartItem } from '../constants/cartItems';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: cartItems,
  totalAmount: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.amount += 1;
    },
    decrease(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.amount <= 1) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        } else {
          item.amount -= 1;
        }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    calculateTotals(state) {
      state.totalAmount = state.items.reduce((sum, item) => sum + item.amount, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0,
      );
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
