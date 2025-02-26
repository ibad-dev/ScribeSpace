import React, { useState, useEffect } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { fetchAllPosts } from "../features/allPostsSlice.js";
import { postDetailById } from "../features/postSlice.js";
export default function Blogs() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { posts } = useSelector((state) => state.fetchPosts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [category, setCategory] = useState("");
  useEffect(() => {
    dispatch(fetchAllPosts()).then(() => {
      setIsLoading(false);
    });
  }, []);

  let uniqueCategories = [];
  if (posts && posts.data) {
    uniqueCategories = Array.from(
      new Set(
        posts.data.flatMap((post) =>
          post.categories.flatMap((category) => category.split(","))
        )
      )
    );
    console.log("CATE", uniqueCategories);
  }
  console.log("RES:==== ", posts);
  // console.log("RESDATA: ", response.posts);
  useEffect(() => {
    if (posts && posts.data) {
      if (category !== "") {
        const res = posts.data.filter((tag) =>
          tag.categories.some((cat) => cat.includes(category))
        );
        setFilteredPosts(res);
      }
    }
  }, [category, posts]);

  console.log("FILTERED: ", filteredPosts);

  console.log("CATEGORY: ", category);
  return (
    <>
      <div className="flex border-2 py-2 gap-x-2 overflow-auto">
        <span
          onClick={() => {
            setCategory();
          }}
          className="rounded-md cursor-pointer lg:text-xl text-sm font-medium px-2 py-1 bg-zinc-200"
        >
          All
        </span>
        {uniqueCategories.map((tag) => (
          <span
            key={Math.random()}
            onClick={() => {
              setCategory(tag);
            }}
            className="rounded-md cursor-pointer lg:text-xl text-sm font-medium px-2 py-1 bg-zinc-200"
          >
            {tag}
          </span>
        ))}
      </div>
      {isLoading && (
        <p className="lg:text-3xl text-xl lg:p-5 p-3 m-2 font-semibold">
          Loading...
        </p>
      )}

      {filteredPosts.length > 0 ? (
        <div className=" lg:m-3">
          <h1 className="lg:hidden text-3xl text-center my-2 font-semibold tracking-tighter">
            Published Posts
          </h1>

          {filteredPosts.map((res) => (
            <div
              key={res._id}
              className="lg:flex block lg:my-4 my-3 gap-y-3 gap-x-2 shadow-md   p-1 lg:p-4"
            >
              <div
                className="flex lg:flex-col  lg:justify-normal justify-between cursor-pointer lg:w-[40vw]"
                onClick={() => navigate("/profile/published-blogs")}
              >
                <div className="flex gap-x-12 items-center ">
                  {res.author[0]?.profileImage !== "" ? (
                    <img
                      src={res.author[0]?.profileImage}
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
                    {res.author[0]?.username}
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
              <button
                  onClick={() => {
                    dispatch(postDetailById(res._id));
                    navigate("/read-blog");
                  }}
                  className="bg-green-500 hover:bg-green-600 m-2 lg:hidden rounded-md cursor-pointer py-1 px-2   font-semibold text-xl"
                >
                  View
                </button>
                <div className="lg:flex flex-col hidden">
                  <img
                    src={res.image}
                    className="lg:w-40 lg:h-40 hidden lg:block bg-center rounded-lg w-20 h-20"
                    alt=""
                  />
                  <button
                    onClick={() => {
                    dispatch(postDetailById(res._id));
                      navigate("/read-blog");
                    }}
                    className="bg-green-500 hover:bg-green-600 m-2 lg:block hidden rounded-md cursor-pointer py-1 px-4   font-semibold text-xl"
                  >
                    View
                  </button>
                </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className=" lg:m-3">
          <h1 className="lg:hidden text-3xl text-center my-2 font-semibold tracking-tighter">
            Published Posts
          </h1>

          {posts?.data?.map((res) => (
            <>
              <div
                key={res._id}
                className="lg:flex block lg:my-4 my-3 gap-y-3 gap-x-2 shadow-md   p-1 lg:p-4"
              >
                <div
                  className="flex lg:flex-col  lg:justify-normal justify-between cursor-pointer lg:w-[40vw]"
                  onClick={() => navigate("/profile/published-blogs")}
                >
                  <div className="flex gap-x-12 items-center ">
                    {res.author[0]?.profileImage !== "" ? (
                      <img
                        src={res.author[0]?.profileImage}
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
                      {res.author[0]?.username}
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

                <button
                  onClick={() => {
                    dispatch(postDetailById(res._id));
                    navigate("/read-blog");
                  }}
                  className="bg-green-500 hover:bg-green-600 m-2 lg:hidden rounded-md cursor-pointer py-1 px-2   font-semibold text-xl"
                >
                  View
                </button>
                <div className="lg:flex flex-col hidden">
                  <img
                    src={res.image}
                    className="lg:w-40 lg:h-40 hidden lg:block bg-center rounded-lg w-20 h-20"
                    alt=""
                  />
                  <button
                    onClick={() => {
                    dispatch(postDetailById(res._id));
                      navigate("/read-blog");
                    }}
                    className="bg-green-500 hover:bg-green-600 m-2 lg:block hidden rounded-md cursor-pointer py-1 px-4   font-semibold text-xl"
                  >
                    View
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
}
