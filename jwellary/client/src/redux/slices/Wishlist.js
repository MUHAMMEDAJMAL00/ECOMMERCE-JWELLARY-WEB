import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ GET Wishlist items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId) => {
    const res = await axios.get(`http://localhost:3001/wishlist/${userId}`);
    return res.data;
  }
);

// ✅ ADD to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId, price, aed }) => {
    const res = await axios.post("http://localhost:3001/wishlist", {
      userId,
      productId,
      price,
      aed,
    });
    return res.data;
  }
);

// ✅ REMOVE from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (itemId) => {
    await axios.delete(`http://localhost:3001/wishlist/lists/${itemId}`);
    return itemId;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load wishlist";
      })

      // Add
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Remove
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
