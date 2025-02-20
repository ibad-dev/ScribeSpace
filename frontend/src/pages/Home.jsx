import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import Hero from "../components/Hero.jsx";

function Home() {
  const dispatch = useDispatch();
  const { isLoading, idLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <div>
      <Hero />
    </div>
  );
}

export default Home;
