import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js"; // Import correctly
import followersReducer from "../features/followersSlice.js";
import followingsReducer from "../features/followingSlice.js";
import postReducer from "../features/postSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer, // Set reducer properly
    followers: followersReducer,
    following: followingsReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
