import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { useNavigate } from "react-router-dom";

function PostsBox() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchPublishedPosts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/posts/published-posts`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  console.log("RES: ", response);
  // console.log("RESDATA: ", response.posts);
  const handleDeletePosts = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/posts/delete-post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        showToast("success", data.messaga || "post deleted successfully");
        fetchPublishedPosts()
      } else {
        showToast("success", data.messaga);
      }
    } catch (error) {
      showToast("error", error.message || "error to delete post");
    }
  };
  return (
    <>
      {isLoading ? (
        <p className="lg:text-3xl text-xl lg:p-5 p-3 m-2 font-semibold">
          Loading...
        </p>
      ) : (
        <div className=" lg:m-3">
          <h1 className="lg:hidden text-3xl text-center my-2 font-semibold tracking-tighter">
            Published Posts
          </h1>
          <p className="lg:text-3xl text-xl font-medium tracking-tight">
            Total Blogs: {response?.data?.postCount}
          </p>
          {response?.data?.posts.map((res) => (
            <div
              key={res._id}
              className="lg:flex block lg:my-4 my-3 gap-y-3 gap-x-2 shadow-md   p-1 lg:p-4"
            >
              <div
                className="flex lg:flex-col  lg:justify-normal justify-between cursor-pointer lg:w-[40vw]"
                onClick={() => navigate("/profile/published-blogs")}
              >
                <div className="flex gap-x-12 items-center ">
                  {res.author[0].profileImage !== "" ? (
                    <img
                      src={res.author[0].profileImage}
                      className="rounded-full bg-center lg:w-18 w-10"
                      alt="userImage"
                    />
                  ) : (
                    <img
                      src={assets.user}
                      alt="userImage"
                      className="  lg:w-18  w-10"
                    />
                  )}
                  <h2 className="lg:text-2xl text-xl font-semibold">
                    {res.author[0].username}
                  </h2>
                </div>
                <h1 className="font-semibold hidden lg:block text-lg lg:text-2xl tracking-tighter">
                  {res.title}
                </h1>
                <img
                  src={res.image}
                  className="lg:w-40 lg:h-40 lg:hidden bg-center rounded-lg w-19 h-19"
                  alt=""
                />
              </div>
              <h1 className="font-semibold lg:hidden text-lg lg:text-2xl tracking-tighter">
                {res.title}
              </h1>

              <div className="flex  flex-col">
                {" "}
                <img
                  src={res.image}
                  className="lg:w-40 lg:h-40 hidden lg:block bg-center rounded-lg w-20 h-20"
                  alt=""
                />
                <button
                  onClick={() => handleDeletePosts(res._id)}
                  className="bg-red-600 hover:bg-red-700 text-xl lg:text-2xl text-white font-semibold rounded-lg my-2 lg:w-38 cursor-pointer w-28 py-1 px-2 "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PostsBox;
