import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { useNavigate } from "react-router-dom";
import { postDetailById } from "../features/postSlice.js";
import { useDispatch, useSelector } from "react-redux";
function DraftPosts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const publishPost = async (postId) => {
    console.log(postId);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/posts/publish/${postId}`,
        {}
      );
      if (data) {
        showToast("success", data.message);
      } else {
        showToast("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Error to publish");
    }
  };
  const fetchPublishedPosts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/posts/saved-posts`,

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

  return (
    <>
      {isLoading ? (
        <p className="lg:text-3xl text-xl lg:p-5 p-3 m-2 font-semibold">
          Loading...
        </p>
      ) : (
        <div className=" lg:m-3">
          <h1 className="lg:hidden text-3xl text-center my-2 font-semibold tracking-tighter">
            Saved Posts
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
                className="flex lg:flex-col  lg:justify-normal cursor-pointer justify-between lg:w-[40vw]"
                onClick={() => navigate("/profile/published-blogs")}
              >
                <div className="flex gap-x-12 items-center ">
                  {res.author.profileImage !== "" ? (
                    <img
                      src={res.author.profileImage}
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
                    {res.author.username}
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
                {}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo amet sapiente debitis ab tempore unde laborum. Dolorem
                ea corporis quod laborum esse?
              </h1>
              <div className="flex lg:hidden gap-x-4">
                {" "}
                <button
                  onClick={() => {
                    publishPost(res._id);
                  }}
                className="lg:text-xl text-sm mt-2 lg:hidden block font-semibold mb-2  bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer py-2 w-40 "
                >
                  Publish
                </button>
                <button
                  onClick={() => {
                    dispatch(postDetailById(res._id));
                    navigate("/edit-post");
                  }}
                  className="lg:text-xl text-sm mt-2 lg:hidden block font-semibold mb-2  bg-green-600 rounded-md  hover:bg-green-700 text-white cursor-pointer py-2 w-40 "
                >
                  Edit
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    dispatch(postDetailById(res._id));
                    navigate("/edit-post");
                  }}
                  className="lg:text-xl text-sm mt-2 lg:block hidden font-semibold mb-2  bg-green-600 rounded-md  hover:bg-green-700 text-white cursor-pointer py-2 w-40 "
                >
                  Edit
                </button>
                <img
                  src={res.image}
                  className="lg:w-40 lg:h-40 hidden lg:block bg-center rounded-lg w-20 h-20"
                  alt=""
                />
                <button
                  onClick={() => {
                    publishPost(res?._id);
                  }}
                  className="lg:text-xl text-sm mt-2 lg:block hidden font-semibold   bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer py-2 w-40 "
                >
                  Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default DraftPosts;
