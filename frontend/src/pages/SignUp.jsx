import React, { useState } from "react";
import { toast } from "react-toastify";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { backendUrl } from "../utils/backendURL.js";
import Cookies from "js-cookie";
function SignUp() {
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [fullName, SetFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    // Temporary debug code

    if (state === "Sign Up") {
      try {
        const { data } = await axios.post(`${backendUrl}/users/register`, {
          username,
          email,
          fullName,
          password,
        });
        if (data) {
          navigate("/sign-up");
          setState("Log In");
          showToast("success", "Registered Successfully");
        } else {
          showToast("error", data.message || "Error To Register User");
        }
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message ||
            "An error occurred during registration"
        );
      }
    } else {
      try {
        const { data } = await axios.post(`${backendUrl}/users/login`, {
          email,
          password,
        });
        console.log("________________", data);
        if (data) {
          // Get token from cookie first
          const token = data.data.accessToken;

          // Store token in localStorage
          localStorage.setItem("access_token", token);

          navigate("/");
          dispatch(isAuth());
          showToast("success", "Logged in Successfully");
          // console.log("AccessToken: =====> ", token);
        } else {
          showToast("error", "Error to login");
        }
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message || "Error To Login User"
        );
      }
    }
  };

  return (
    <div className="m-2 box-border">
      <div className="flex mt-10 flex-col items-center justify-center ">
        <h2 className=" text-3xl lg:text-5xl font-semibold ">
          {state === "Sign Up" ? "Sign Up" : "Log In"}
        </h2>
        {state === "Sign Up" ? (
          <p className="lg:texl-5xl mt-3 font-medium text-zinc-800">
            Already have an account?
            <span
              onClick={() => setState("Log In")}
              className=" hover:underline mx-2 cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="lg:texl-5xl mt-3 font-medium text-zinc-800">
            Don't have an account?
            <span
              onClick={() => setState("Sign Up")}
              className=" hover:underline mx-2 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Full Name (Only for Sign Up) */}
          {state === "Sign Up" && (
            <>
              <div className="relative my-3">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer outline-none w-full border-b-2 border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                  type="text"
                  id="name"
                  required
                  name="name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-2 top-2 text-gray-400 text-lg transition-all duration-200 
          peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg 
          peer-focus:top-0 peer-focus:text-sm 
          peer-valid:top-0 peer-valid:text-sm peer-valid:text-blue-500"
                >
                  Username
                </label>
              </div>
              {/* // fullname: */}
              <div className="relative my-3">
                <input
                  value={fullName}
                  onChange={(e) => SetFullName(e.target.value)}
                  className="peer outline-none w-full border-b-2 border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                  type="text"
                  id="fullName"
                  required
                  name="fullName"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-2 top-2 text-gray-400 text-lg transition-all duration-200 
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg 
        peer-focus:top-0 peer-focus:text-sm 
        peer-valid:top-0 peer-valid:text-sm peer-valid:text-blue-500"
                >
                  Full Name
                </label>
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative my-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer outline-none w-full border-b-2 border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
              type="email"
              id="email"
              required
              name="email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 top-2 text-gray-400 text-lg transition-all duration-200 
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg 
        peer-focus:top-0 peer-focus:text-sm 
        peer-valid:top-0 peer-valid:text-sm peer-valid:text-blue-500"
            >
              Email ID
            </label>
          </div>

          {/* Password */}
          <div className="relative my-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer outline-none w-full border-b-2 border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
              type="password"
              id="password"
              minLength={6}
              required
              name="password"
            />
            <label
              htmlFor="password"
              className="absolute left-2 top-2 text-gray-400 text-lg transition-all duration-200 
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg 
        peer-focus:top-0 peer-focus:text-sm 
        peer-valid:top-0 peer-valid:text-sm peer-valid:text-blue-500"
            >
              Password
            </label>
          </div>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="text-sm hover:underline cursor-pointer my-3"
          >
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 cursor-pointer to-indigo-900 text-white text-lg font-semibold m-2 p-3 rounded-full"
          >
            {state}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
