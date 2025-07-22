// redux/slices/addressSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressInfo: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.addressInfo = action.payload;
    },
    clearAddress: (state) => {
      state.addressInfo = null;
    },
  },
});

export const { setAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
