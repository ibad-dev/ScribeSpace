import React, { useState, useEffect } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
function Posts() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
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
  return (
    <>
      <div className="">
        <div className="flex border-2 p-5 flex-col gap-y-3 border-amber-300 h-screen lg:w-4xl">
          <label htmlFor="title" className="lg:text-2xl text-lg font-semibold">
            Title:
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
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
            onChange={(e) => setContent(e.target.value)}
            className="outline-none mt-3 lg:w-full lg:h-full mb-3 w-80 border-2 border-gray-600 p-2 text-lg bg-transparent focus:border-blue-500 resize-none"
            id="content"
            name="content"
          />
          <label
            htmlFor="categories"
            className="lg:text-2xl text-lg font-semibold"
          >
            Categories:
          </label>
          <input
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
            type="text"
            id="categories"
            name="categories"
          />
          <label htmlFor="" className="lg:text-2xl text-lg mt-4 font-semibold">
            Add Image To Blog:{" "}
          </label>
          <input
            type="file"
            name="image"
            id="image"
            className="hidden"
            onChange={handleFileChangeForUpload}
          />
          <label
            htmlFor="image"
            className="lg:text-xl text-sm font-semibold mt-4 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-40"
          >
            Upload Photo
          </label>
        </div>
      </div>
    </>
  );
}

export default Posts;
