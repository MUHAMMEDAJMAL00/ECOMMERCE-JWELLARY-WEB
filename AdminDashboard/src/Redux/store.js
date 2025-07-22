// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // or whatever slice you're using

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
