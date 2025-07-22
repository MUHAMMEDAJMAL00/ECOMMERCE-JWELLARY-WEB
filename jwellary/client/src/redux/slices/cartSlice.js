// redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk for adding to cart (POST request)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ userId, productId, quantity, price }) => {
    const res = await axios.post("http://localhost:3001/cart", {
      userId,
      productId,
      quantity,
      price,
    });
    return res.data; // backend should return the cart item
  }
);

const initialState = {
  cartItems: [],
  cartCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.cartCount = action.payload.length;
    },
    updateCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
    },
    addToCart: (state, action) => {
      const exists = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (exists) {
        exists.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      state.cartCount = state.cartItems.length;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.cartItems.push(action.payload);
      state.cartCount = state.cartItems.length;
    });
  },
});

export const { setCartItems, updateCartCount, clearCart, addToCart } =
  cartSlice.actions;

export default cartSlice.reducer;
