import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../../constants/cartItems";

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: number;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

const initialAmount = cartItems.reduce((acc, item) => acc + item.amount, 0);
const initialTotal = cartItems.reduce(
  (acc, item) => acc + item.price * item.amount,
  0,
);

const initialState: CartState = {
  cartItems: cartItems,
  amount: initialAmount,
  total: initialTotal,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount -= 1;
      }
      state.cartItems = state.cartItems.filter((item) => item.amount >= 1);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    calculateTotals: (state) => {
      let totalAmount = 0; // 여기서 왜 let을 써야하나?
      let totalPrice = 0;

      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.price * item.amount;
      });

      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
