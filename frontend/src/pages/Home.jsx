import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";

function Home() {
  const dispatch = useDispatch();
  const { isLoading, idLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <div>
      <Navbar />
      {/* Render based on auth status */}
    </div>
  );
}

export default Home;
