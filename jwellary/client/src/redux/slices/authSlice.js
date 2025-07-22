// redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Try loading user from localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user"));
const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  user: userFromStorage || null,
  token: tokenFromStorage || "",
  isAuthenticated: !!userFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);

      // Redirect
      if (action.payload.user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
