import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js"; // Import correctly
import followersReducer from "../features/followersSlice.js";
import followingsReducer from "../features/followingSlice.js"
export const store = configureStore({
  reducer: {
    auth: authReducer, // Set reducer properly
    followers: followersReducer,
    following:followingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
