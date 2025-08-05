// redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://ecommerce-jwellary-backend.onrender.com";

// ✅ Async thunk for adding to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ userId, productId, quantity, price }) => {
    const res = await axios.post(`${BASE_URL}/cart`, {
      userId,
      productId,
      quantity,
      price,
    });
    return res.data; // cart item
  }
);

// ✅ Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const res = await axios.get(`${BASE_URL}/cart/${userId}`);
  return res.data;
});

// ✅ Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async ({ userId, cartItemId }) => {
    const res = await axios.delete(`${BASE_URL}/cart/${cartItemId}`);
    const updatedCart = await axios.get(`${BASE_URL}/cart/${userId}`);
    return updatedCart.data;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // Option 1: Push (may cause duplicate if backend doesn't dedupe)
        state.cartItems.push(action.payload);

        // Option 2: Update if exists
        // const index = state.cartItems.findIndex(
        //   (item) => item.productId?._id === action.payload.productId?._id
        // );
        // if (index !== -1) {
        //   state.cartItems[index] = action.payload;
        // } else {
        //   state.cartItems.push(action.payload);
        // }

        state.cartCount = state.cartItems.length;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.cartCount = action.payload.length;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.cartCount = action.payload.length;
      });
  },
});

export const { setCartItems, updateCartCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
