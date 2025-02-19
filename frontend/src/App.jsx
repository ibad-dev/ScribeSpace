import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "./features/authSlice.js"; //

// import the isAuth action

import { useEffect } from "react";
import Profile from "./pages/Profile.jsx";
import Posts from "./pages/Posts.jsx";

function App() {
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for token in localStorage on page load
    console.log("loggedin=======", isLoggedIn);
    if (isLoggedIn) {
      const token = localStorage.getItem("access_token");
      if (token) {
        // If token exists, dispatch isAuth action to authenticate user
        dispatch(isAuth());
      }
    }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<Posts />} />
      </Routes>
    </>
  );
}

export default App;
