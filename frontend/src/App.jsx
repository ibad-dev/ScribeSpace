import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "./features/authSlice.js"; //
import { Outlet } from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

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
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
