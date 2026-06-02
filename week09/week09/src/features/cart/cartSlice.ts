import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../../constants/cartItems";
import type { CartItemType } from "../../constants/cartItems";

interface CartState {
  cartItems: CartItemType[];
  amount: number; // 총 수량
  total: number; // 총 금액
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 수량 +1
    increase(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },

    // 수량 -1 (amount가 1이면 아이템 제거)
    decrease(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) {
        if (item.amount === 1) {
          state.cartItems = state.cartItems.filter(
            (i) => i.id !== action.payload,
          );
        } else {
          item.amount -= 1;
        }
      }
    },

    // 특정 아이템 삭제
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    },

    // 장바구니 전체 비우기 (수량·금액도 0으로 리셋)
    clearCart(state) {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    // 총 수량 & 총 금액 재계산
    calculateTotals(state) {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
