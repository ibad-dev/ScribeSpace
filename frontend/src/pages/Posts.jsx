import React, { useState, useEffect } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import Navbar from "../components/Navbar.jsx";

function Posts() {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    console.log("nav log in", isLoggedIn);

    if (isLoggedIn === false) {
      dispatch(isAuth()); // Dispatch the action to check if the user is authenticated
    }
  }, [dispatch, isLoggedIn]);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // Store image in state

  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(input.trim()) && tags.length < 5) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImage(file); // Store the image in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || tags.length === 0) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    if (image) {
      // If an image is selected, call the image upload method
      await handleImageUpload(image);
    } else {
      // Otherwise, post the blog without an image
      await postBlog();
    }
  };

  const postBlog = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/posts/create-post`,
        {
          tags,
          title,
          content,
        },
        { withCredentials: true }
      );

      if (response) {
        showToast("success", response.data.message);
        navigate("/profile");
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };

  const handleImageUpload = async (image) => {
    if (!image) {
      showToast("error", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tags", JSON.stringify(tags)); // Convert tags array to JSON string
    formData.append("title", title);
    formData.append("content", content);

    try {
      const response = await axios.post(
        `${backendUrl}/posts/create-post`,
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
        navigate("/profile");
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };

  return (
    <>
      <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl my-2 text-center">
        Write a New Post
      </h1>
      {isLoggedIn === false && (
        <div className="relative mx-auto p-10  border-2 h-[45vh] shodow-md">
          <h1 className="lg:text-3xl text-xl font-semibold tracking-tighter">
            Please Create Account first to write something
          </h1>
          <button
            onClick={() => navigate("/sign-up")}
            className="outline-none bg-blue-600 hover:bg-blue-800 font-semibold lg:text-2xl text-xl w-70 rounded-lg  p-3 mt-10 text-white"
          >
           Create Account
          </button>
        </div>
      )}

      {isLoggedIn && (
        <div className="">
          <div className=" p-5 flex-col gap-y-3  lg:w-4xl relative">
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="title"
                className="lg:text-2xl text-lg font-semibold"
              >
                Title:
              </label>
              <input
                value={title}
                placeholder="Write Blog title"
                onChange={(e) => setTitle(e.target.value)}
                className=" outline-none  mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
                type="text"
                id="title"
                name="title"
              />
              <label
                htmlFor="content"
                className="lg:text-2xl text-lg font-semibold"
              >
                Content:
              </label>
              <textarea
                value={content}
                placeholder="Write Content of Blog"
                onChange={(e) => setContent(e.target.value)}
                className="outline-none rounded-md mt-3 lg:w-full h-[45vh] mb-3 w-80 border-2 border-gray-600 p-2 text-lg bg-transparent focus:border-blue-500 resize-none"
                id="content"
                name="content"
              />
              <label
                htmlFor="categories"
                className="lg:text-2xl text-lg font-semibold"
              >
                Add Topics:
              </label>
              <input
                value={input}
                placeholder="Add Topics of Blog"
                onChange={(e) => setInput(e.target.value)}
                className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
                type="text"
                id="categories"
                onKeyDown={handleKeyDown}
                name="categories"
              />
              <div className="flex gap-x-2 mb-8">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center w-fit cursor-pointer bg-gray-200 px-3 py-1 rounded-full text-sm lg:text-xl font-medium"
                  >
                    {tag}

                    <img
                      src={assets.close}
                      onClick={() => removeTag(tag)}
                      width={26}
                      alt=""
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
              <label
                htmlFor=""
                className="lg:text-2xl text-lg mt-4 font-semibold"
              >
                Add Image To Blog:{" "}
              </label>
              <input
                onChange={handleFileChange}
                type="file"
                name="image"
                id="image"
                className="hidden"
              />
              <label
                htmlFor="image"
                className="lg:text-xl text-sm font-semibold mt-4 lg:mx-6 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-40"
              >
                Upload Photo
              </label>

              <button
                type="submit"
                className="lg:text-xl text-sm font-semibold lg:mt-4 mt-9 right-4 lg:absolute bottom-4 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-full lg:w-40"
              >
                Post{" "}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Posts;
