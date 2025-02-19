import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";

// Fetch following action
export const fetchFollowing = createAsyncThunk(
  "following/fetchFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("API Call to:", `${backendUrl}/users/following/${userId}`);
      const response = await axios.get(
        `${backendUrl}/users/following/${userId}`
      );
      console.log("API Response:", response.data);

      // Ensure we return the actual data
      return response.data.data; // Since your backend sends { data: { followersCount, followers } }
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to fetch follwings"
      );
    }
  }
);

export const followingSlice = createSlice({
  name: "following",
  initialState: {
    isLoading: false,
    followingCount: 0, // Default to 0
    followingData: [], // Default to empty array
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        console.log("Redux store updated with:", action.payload);

        state.isLoading = false;
        state.followingCount = action.payload.followingCount;
        state.followingData = action.payload.following;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default followingSlice.reducer;
