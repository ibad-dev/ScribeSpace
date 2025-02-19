import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";

// Fetch followers action
export const fetchFollowers = createAsyncThunk(
  "followers/fetchFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("API Call to:", `${backendUrl}/users/followers/${userId}`);
      const response = await axios.get(
        `${backendUrl}/users/followers/${userId}`
      );
      console.log("API Response:", response.data);

      // Ensure we return the actual data
      return response.data.data; // Since your backend sends { data: { followersCount, followers } }
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to fetch followers"
      );
    }
  }
);

export const followersSlice = createSlice({
  name: "followers",
  initialState: {
    isLoading: false,
    followersCount: 0, // Default to 0
    followersData: [], // Default to empty array
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        console.log("Redux store updated with:", action.payload);

        state.isLoading = false;
        state.followersCount = action.payload.followersCount;
        state.followersData = action.payload.followers;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default followersSlice.reducer;
