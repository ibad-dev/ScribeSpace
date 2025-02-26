import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset";
import { useNavigate, NavLink } from "react-router-dom";
import { backendUrl } from "../utils/backendURL.js";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
function Navbar({ fromPost }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHamburgerArea, setShowHamburgerArea] = useState(false);
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    console.log("nav log in", isLoggedIn);

    if (isLoggedIn === false) {
      dispatch(isAuth()); // Dispatch the action to check if the user is authenticated
    }
  }, [dispatch, isLoggedIn]);
 

  const handleProfile = () => {
    setShowDropdown((prevState) => !prevState); // Toggle dropdown visibility
  };
  async function logout() {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/logout`,
        {}, // Empty object since you're not sending any data in the request body
        {
          withCredentials: true, // Correctly passing withCredentials as part of the config
        }
      );
      if (data) {
        showToast("success", data.message);
        localStorage.removeItem("access_token"); // Remove the token from localStorage
        navigate("/sign-up"); // Redirect to the sign-up page
      } else {
        showToast("error", data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message || "Error to logout user");
    }
  }

  // console.log("user data:", user); // Check if the user is populated
  const sendVerifyEmail = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/verify-otp`,
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }, // Empty object since you're not sending any data in the request body
        {
          withCredentials: true, // Correctly passing withCredentials as part of the config
        }
      );
      if (data) {
        showToast("success", data.message);
        navigate("/verify-email"); // Redirect to the sign-up page
      } else {
        showToast("error", data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message || "Error to logout user");
    }
  };

  //for mobile resposiveness:
  const handleHamburger = () => {
    setShowHamburgerArea((prev) => !prev);
    console.log("CLICKED");
  };
  return (
    <div className="flex justify-between items-center m-2 gap-x-3">
      {showHamburgerArea === false && (
        <>
          <h1 className="text-3xl lg:text-4xl font-semibold text-black dark:text-white">
            ScribeSpace
          </h1>
        </>
      )}
      <ul className="hidden lg:flex text-2xl font-semibold  justify-center gap-7">
        <li className="list-none cursor-pointer  transition-all duration-75">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-700" : "text-gray-700"
              } hover:text-blue-800 `
            }
          >
            Home
          </NavLink>
        </li>
        <li className="list-none cursor-pointetransition-all duration-75">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-700" : "text-gray-700"
              } hover:text-blue-800 `
            }
          >
            About Us
          </NavLink>
        </li>
        <li className="list-none cursor-pointer  transition-all duration-75">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-700" : "text-gray-700"
              } hover:text-blue-800 `
            }
          >
            Contact Us
          </NavLink>
        </li>
        <li className="list-none cursor-pointer  transition-all duration-75">
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-700" : "text-gray-700"
              } hover:text-blue-800 `
            }
          >Blogs
          </NavLink>
        </li>
      </ul>
      <div className="flex ">
        {isLoggedIn && (
          <button
            onClick={() => navigate("/create-post")}
            className="text-xl hidden lg:block bg-blue-600 rounded-md font-semibold hover:bg-blue-700 text-white cursor-pointer w-32 h-12 mx-5  "
          >
            Create Post
          </button>
        )}
        <div className="lg:hidden">
          {showHamburgerArea === false && (
            <img
              className="lg:hidden "
              src={assets.hamburger}
              onClick={handleHamburger}
              width={30}
              alt=""
            />
          )}
          {showHamburgerArea && (
            <>
              <div className="w-screen h-screen relative  p-0 m-0 ">
                <img
                  className="absolute z-10 top-1 right-2"
                  src={assets.close}
                  onClick={() => handleHamburger()}
                  width={40}
                  alt=""
                />
                {isLoggedIn ? (
                  // User has a profile image
                  user.profileImage !== "" ? (
                    <div className="relative w-32 flex">
                      <img
                        src={user.profileImage}
                        width={65}
                        className="cursor-pointer inline-block"
                        onClick={handleProfile}
                        alt="Profile"
                      />

                      {showDropdown && (
                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-md w-40">
                          <ul className="text-black">
                            <li
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                navigate("/profile");
                                setShowDropdown(false);
                              }}
                            >
                              View Profile
                            </li>
                            {!user.isAccountVerified && (
                              <li
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  sendVerifyEmail();
                                  setShowDropdown(false);
                                }}
                              >
                                Verify Email
                              </li>
                            )}
                            <li
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={logout}
                            >
                              Log Out
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    // User does not have a profile image, show initial
                    <div className="relative">
                      <h2
                        className="text-2xl font-semibold 
                  text-white bg-blue-600 rounded-full 
                  w-16 h-16 flex items-center justify-center cursor-pointer"
                        onClick={handleProfile}
                      >
                        {user.fullName
                          .split(" ")
                          .map((word) => word[0].toUpperCase())
                          .join(" ") || user.username.charAt(0)}
                      </h2>
                      {showDropdown && (
                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-md w-40">
                          <ul className="text-black">
                            <li
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                navigate("/profile");
                                setShowDropdown(false);
                              }}
                            >
                              View Profile
                            </li>
                            {!user.isAccountVerified && (
                              <li
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  sendVerifyEmail();
                                  setShowDropdown(false);
                                }}
                              >
                                Verify Email
                              </li>
                            )}
                            <li
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                logout();
                                setShowDropdown(false);
                              }}
                            >
                              Log Out
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="text-xl bg-blue-600 rounded-md hover:bg-blue-700 text-white cursor-pointer px-4 py-2 "
                  >
                    Get Started
                  </button>
                )}
                <ul className="flex text-xl  flex-col mt-10 font-semibold  justify-center gap-5">
                  <li className="list-none cursor-pointer  transition-all duration-75">
                    <NavLink
                      to="/"
                      onClick={handleHamburger}
                      className={({ isActive }) =>
                        `${
                          isActive ? "text-blue-700" : "text-gray-700"
                        } hover:text-blue-800 `
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="list-none cursor-pointetransition-all duration-75">
                    <NavLink
                      to="/about"
                      onClick={handleHamburger}
                      className={({ isActive }) =>
                        `${
                          isActive ? "text-blue-700" : "text-gray-700"
                        } hover:text-blue-800 `
                      }
                    >
                      About Us
                    </NavLink>
                  </li>
                  <li className="list-none cursor-pointer  transition-all duration-75">
                    <NavLink
                      to="/contact"
                      onClick={handleHamburger}
                      className={({ isActive }) =>
                        `${
                          isActive ? "text-blue-700" : "text-gray-700"
                        } hover:text-blue-800 `
                      }
                    >
                      Contact Us
                    </NavLink>
                  </li>
                  <li className="list-none cursor-pointer  transition-all duration-75">
                    <NavLink
                      to="/blogs"
                      onClick={handleHamburger}
                      className={({ isActive }) =>
                        `${
                          isActive ? "text-blue-700" : "text-gray-700"
                        } hover:text-blue-800 `
                      }
                    >
                      Blogs
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        {isLoggedIn ? (
          // User has a profile image
          user.profileImage !== "" ? (
            <div className="relative hidden lg:block">
              <img
                src={user.profileImage}
                width={65}
                className="cursor-pointer rounded-full bg-center bg-no-repeat"
                onClick={handleProfile}
                alt="Profile"
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40">
                  <ul className="text-black">
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() =>{navigate("/profile") 
                        setShowDropdown(false)}}
                    >
                      View Profile
                    </li>
                    {!user.isAccountVerified && (
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={sendVerifyEmail}
                      >
                        Verify Email
                      </li>
                    )}
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={logout}
                    >
                      Log Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // User does not have a profile image, show initial
            <div className="relative hidden lg:block">
              <h2
                className="text-2xl lg:text-2xl tracking-tighter font-semibold 
                          text-white bg-blue-600 rounded-full 
                          w-16 h-16 flex items-center justify-center cursor-pointer"
                onClick={handleProfile}
              >
                {user.fullName
                  .split(" ")
                  .map((word) => word[0].toUpperCase())
                  .join(" ") || user.username.charAt(0)}
              </h2>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40">
                  <ul className="text-black">
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => navigate("/profile")}
                    >
                      View Profile
                    </li>
                    {!user.isAccountVerified && (
                      <li
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={sendVerifyEmail}
                      >
                        Verify Email
                      </li>
                    )}
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={logout}
                    >
                      Log Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )
        ) : (
          <button
            onClick={() => navigate("/sign-up")}
            className="lg:text-xl lg:bg-blue-600 lg:rounded-md hidden lg:block lg:hover:bg-blue-700 lg:text-white lg:cursor-pointer lg:px-4 lg:py-2 "
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
