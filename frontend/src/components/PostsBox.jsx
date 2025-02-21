import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import Navbar from "../components/Navbar.jsx";
import Followers from "../components/Followers.jsx";
import Following from "../components/Following.jsx";
function PostsBox({ userid }) {
  console.log(userid);
  return <div>

  </div>;
}

export default PostsBox;







