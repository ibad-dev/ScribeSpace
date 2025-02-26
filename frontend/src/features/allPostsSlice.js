import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendUrl } from '../utils/backendURL.js';

export const fetchAllPosts = createAsyncThunk(
  'fetchPosts/fetchAllPosts',
  async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${backendUrl}/posts/get-all-posts`);
    return response.data 
  }
);

const allPostsSlice = createSlice({
  name: 'fetchPosts',
  initialState: {
    error: null,
    isLoading: false,
    posts: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchAllPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      console.error(action.error.message);
    });
  },
});

export default allPostsSlice.reducer;