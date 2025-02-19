import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";

// 1. Action to check if user is authenticated
export const isAuth = createAsyncThunk("isAuth", async () => {
  const token = localStorage.getItem("access_token");

  // If there's a token, send it in the request headers
  const { data } = await axios.get(`${backendUrl}/users/isAuthenticated`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
});

// 2. Create the authSlice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isLoggedIn: false,
    user: null,
    error: null,
  },
  extraReducers: (builder) => {
    // Handle checking authentication status
    builder.addCase(isAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(isAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = action.payload.authenticated;
      if (action.payload.authenticated) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    });
    builder.addCase(isAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = action.error.message;
    });
  },
});

export default authSlice.reducer;
