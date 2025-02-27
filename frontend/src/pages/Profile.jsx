import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import DraftPosts from "./DraftPosts.jsx";
import Followers from "../components/Followers.jsx";
import Following from "../components/Following.jsx";
import PostsBox from "../components/PostsBox.jsx";
function Profile() {
  const [showFollowersBox, setShowFollowersBox] = useState(false);
  const [showFollowingBox, setShowFollowingBox] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, SetFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEditBox, setShowEditBox] = useState(false);
  const handleEdit = () => {
    setShowEditBox(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token && !isLoggedIn) {
      dispatch(isAuth()); // Fetch user details again
    }
  }, [dispatch, isLoggedIn, user]); // Runs when `isLoggedIn` changes

  if (isLoading) {
    return <p>Loading...</p>; // Show loading while fetching user data
  }

  if (!user) {
    return <p>User not found. Please log in again.</p>; // Handle missing user case
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    if (username === "" && fullName === "" && bio === "") {
      showToast("error", "All Fields can't be empty");
    } else {
      try {
        const { data } = await axios.patch(
          `${backendUrl}/users/update-account-details`,
          {
            username,
            bio,
            fullName,
          }
        );
        if (data) {
          navigate("/profile");
          showToast("success", "Account updated Successfully");
        } else {
          showToast("error", data.message || "Error To update User");
        }
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message ||
            "An error occurred during registration"
        );
      }
    }
  };

  const handleFileChangeForUpdate = (e) => {
    handleImageUpload(e.target.files[0], "update-profile-pic");
  };
  const handleFileChangeForUpload = (e) => {
    handleImageUpload(e.target.files[0], "set-profile-pic");
  };

  const handleImageUpload = async (image, route) => {
    if (!image) {
      showToast("error", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", image);
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        `${backendUrl}/users/${route}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        showToast("success", response.data.message);
        setShowEditBox(false);
        navigate("/profile");
        console.log(response.data);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };
  const handleAddBio = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${backendUrl}/users/add-bio`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        showToast("success", response.data.message);
        navigate("/profile");
        console.log(response.data);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };

  const deleteProfilePic = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.delete(
        `${backendUrl}/users/delete-profile-pic`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        showToast("success", response.data.message);
        navigate("/profile");
        console.log(response.data);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };
  const handleChangePassowrd = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(`${backendUrl}/users/change-password`, {
        oldPassword,
        newPassword,
      });
      if (response) {
        showToast("success", response.data.message);
        navigate("/profile");

        console.log(response.data);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };
  // console.log("__",user)
  return (
    <>
      <div
        className={`flex flex-col ${
          showEditBox && "lg:h-[140vh] h-[240vh]"
        } lg:flex-row w-screen`}
      >
        {/* Left Section */}
        <div className="lg:flex hidden flex-col  overflow-auto lg:h-[133vh]  lg:w-3xl">
          <h1 className="text-2xl flex justify-between lg:text-5xl p-5 capitalize">
            {user.fullName}
            <button
              onClick={() => {
                setShowDraft((prev) => !prev);
              }}
              className="lg:text-xl text-sm mt-2 font-semibold   bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer py-2 w-32 "
            >
              {showDraft ? "Published" : "Drafts"}
            </button>
          </h1>

          <div>
            <h2 className="text-2xl tracking-tighter lg:text-4xl font-semibold p-5">
              {showDraft ? "Saved Blogs" : "Published Blogs"}
            </h2>
            <div className="">
              {showDraft === false ? <PostsBox /> : <DraftPosts  />}
            </div>
          </div>
        </div>

        {/* Right Section */}

        <div className="m-1">
          {showEditBox === false ? (
            <>
              <div
                className={`flex  ${
                  (showFollowersBox || showFollowingBox) && "hidden"
                }`}
              >
                <div className=" h-50 ">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      className="cursor-pointer w-28 h-28 rounded-full bg-center"
                      alt="Profile"
                    />
                  ) : (
                    <img
                      src={assets.user}
                      className="cursor-pointer w-28 h-28 rounded-full"
                      alt="Profile"
                    />
                  )}
                  <div className="flex lg:block flex-col gap-y-2">
                    <button
                      onClick={handleEdit}
                      className="lg:text-xl text-sm mt-2 font-semibold   bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={() => navigate("/create-post")}
                      className="lg:text-xl lg:hidden text-sm  font-semibold lg:mt-2  bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                    >
                      Create Post
                    </button>
                  </div>
                </div>
                <div className="  h-20 lg:h-10 text-xl lg:text-2xl  mt-7 lg:mt-3 ">
                  <span
                    className="cursor-pointer font-semibold hover:underline  lg:inline block "
                    onClick={() => setShowFollowersBox(true)}
                  >
                    Followers: {user.followers.length}
                  </span>
                  <span
                    className="cursor-pointer font-semibold hover:underline lg:inline block lg:px-17 px-0"
                    onClick={() => setShowFollowingBox(true)}
                  >
                    Following: {user.following.length}
                  </span>
                  {user.bio && (
                    <div className=" h-36 mt-3 shadow-lg hidden lg:w-96 overflow-auto p-2 lg:block">
                      <h2 className="lg:text-3xl texl-lg inline-block  font-semibold">
                        Bio:{" "}
                      </h2>
                      <span className="ml-3 lg:text-lg text-sm">
                        {user.bio}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {showFollowersBox && (
                <div className=" lg:w-lg relative">
                  <img
                    src={assets.close}
                    onClick={() => setShowFollowersBox(false)}
                    alt="close"
                    className="lg:absolute lg:w-12 w-10 lg:top-3 lg:right-3 cursor-pointer"
                  />
                  <div>
                    <Followers userId={user._id} />
                  </div>
                </div>
              )}
              {showFollowingBox && (
                <div className=" lg:w-lg relative">
                  <img
                    src={assets.close}
                    onClick={() => setShowFollowingBox(false)}
                    alt="close"
                    width={45}
                    className="lg:absolute lg:w-12 w-10 lg:top-3 lg:right-3 cursor-pointer"
                  />
                  <div>
                    <Following userId={user._id} />
                  </div>
                </div>
              )}
              {user.bio && (
                <div className=" h-36 my-3 mx-2 shadow-lg lg:hidden lg:w-96 overflow-auto p-2 block">
                  <h2 className="lg:text-2xl  texl-lg inline-block  font-semibold">
                    Bio:{" "}
                  </h2>
                  <span className="ml-3 lg:text-lg text-sm">{user.bio} </span>
                </div>
              )}
            </>
          ) : (
            <div
              className={` flex lg:h-screen w-lg  h-[242vh]   border-b-blue-800`}
            >
              <div className="m-4 relative">
                <img
                  src={assets.close}
                  onClick={() => setShowEditBox(false)}
                  alt="close"
                  width={45}
                  className="right-0 absolute cursor-pointer"
                />
                {user.profileImage === "" ? (
                  <div className="flex items-center">
                    <img
                      src={assets.user}
                      className="cursor-pointer w-28 h-28 rounded-full"
                      alt="Profile"
                    />

                    <input
                      type="file"
                      name="profileImage"
                      id="profileImage"
                      className="hidden"
                      onChange={handleFileChangeForUpload}
                    />
                    <label
                      htmlFor="profileImage"
                      className="lg:text-xl text-sm bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                    >
                      Upload Photo
                    </label>
                  </div>
                ) : (
                  <div>
                    <img
                      src={user.profileImage}
                      className="cursor-pointer w-28 h-28 mb-3 rounded-full"
                      alt="Profile"
                    />

                    <input
                      type="file"
                      name="profileImage"
                      id="profileImage"
                      className="hidden"
                      onChange={handleFileChangeForUpdate}
                    />
                    <label
                      htmlFor="profileImage"
                      className="lg:text-xl text-sm bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                    >
                      Update Photo
                    </label>
                    <button
                      onClick={deleteProfilePic}
                      className="lg:text-xl text-sm bg-red-600 rounded-md mx-3  hover:bg-red-700 text-white cursor-pointer px-4 py-2"
                    >
                      Delete Photo
                    </button>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="mt-3 flex flex-col lg:block"
                >
                  <label
                    htmlFor="fullName"
                    className="lg:text-2xl text-lg font-semibold"
                  >
                    Full Name:
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => SetFullName(e.target.value)}
                    className=" outline-none mt-3 lg:w-full mb-3 w-80 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                    type="text"
                    id="fullName"
                    name="fullName"
                  />

                  <label
                    htmlFor="username"
                    className="lg:text-2xl text-lg font-semibold"
                  >
                    Username:
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer outline-none mt-3 w-80  lg:w-full mb-3 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                    type="text"
                    id="username"
                    name="username"
                  />

                  {user.bio && (
                    <>
                      <label
                        htmlFor="bio"
                        className="lg:text-2xl text-lg font-semibold"
                      >
                        Bio:
                      </label>
                      <input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="peer outline-none mt-3 lg:w-full w-80  mb-3 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                        type="text"
                        id="bio"
                        maxLength={500}
                        name="bio"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    className="lg:text-xl text-sm w-36 lg:w-40 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                  >
                    Update Profile
                  </button>
                </form>
                {(!("bio" in user) || user.bio === "") && (
                  <form
                    onSubmit={handleAddBio}
                    className="mt-3 flex flex-col lg:block"
                  >
                    <label
                      htmlFor="bio"
                      className="lg:text-2xl  text-lg font-semibold"
                    >
                      Bio:
                    </label>
                    <input
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="peer outline-none mt-3 lg:w-full mb-3 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                      type="text"
                      id="bio"
                      maxLength={500}
                      name="bio"
                    />
                    <button
                      type="submit"
                      className="lg:text-xl w-36 text-sm bg-blue-600 lg:w-40 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2"
                    >
                      Add Bio
                    </button>
                  </form>
                )}
                <form
                  className="mt-3 flex flex-col lg:block"
                  onSubmit={handleChangePassowrd}
                >
                  <label
                    htmlFor="oldPassword"
                    className="lg:text-2xl text-lg font-semibold"
                  >
                    Old Password
                  </label>
                  <input
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="peer outline-none mt-3 lg:w-full mb-3 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    minLength={6}
                    required
                  />
                  <label
                    htmlFor="newPassword"
                    className="lg:text-2xl text-lg font-semibold"
                  >
                    New Password
                  </label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="peer outline-none mt-3 lg:w-full mb-3 border-2 rounded-md border-gray-400 p-2 text-lg bg-transparent focus:border-blue-500"
                    type="password"
                    minLength={6}
                    id="newPassword"
                    name="newPassword"
                    required
                  />
                  <button
                    type="submit"
                    className="lg:text-xl text-sm bg-blue-600 lg:w-44 rounded-md w-36  hover:bg-blue-700 text-white cursor-pointer lg:px-2 px-4 py-2"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="border-2 overflow-auto lg:hidden">
        <button
              onClick={() => {
                setShowDraft((prev) => !prev);
              }}
              className="lg:text-xl text-sm mt-2 font-semibold   bg-blue-600 rounded-lg hover:bg-blue-700 text-white cursor-pointer mx-2   py-2 w-24 "
            >
              {showDraft ? "Published" : "Drafts"}
            </button>
          {showDraft === false ? <PostsBox /> : <DraftPosts />}
        </div>
      </div>
    </>
  );
}
export default Profile;
