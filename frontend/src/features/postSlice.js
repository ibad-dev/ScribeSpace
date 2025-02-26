import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";

// Fetch following action
export const postDetailById = createAsyncThunk(
  "posts/postDetailById",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${backendUrl}/posts/post-details/${postId}`
      );

      return response.data;
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to fetch post details"
      );
    }
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    isLoading: false,
    postData: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postDetailById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postDetailById.fulfilled, (state, action) => {
        console.log("Redux store updated with:", action.payload);
        state.isLoading = false;
        state.postData = action.payload;
      })
      .addCase(postDetailById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
