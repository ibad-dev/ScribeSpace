import React, { useState, useEffect } from "react";
import { assets } from "../assets/asset";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import DOMPurify from "dompurify";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { showToast } from "../utils/toast.js";
function ReadBlog() {
  const [response, setResponse] = useState("");
  const { postData } = useSelector((state) => state.posts);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [followText, setFollowText] = useState(false);
  const [commentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState("");
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const token = localStorage.getItem("access_token");
  const [likeText, setLikeText] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn && user === null) {
      dispatch(isAuth());
    }
  }, [dispatch, isLoggedIn, user]);
  useEffect(() => {
    if (response?.data && user) {
      console.log(user._id);
      const userId = response?.data?.details?.author[0]?._id;
      axios
        .get(`${backendUrl}/users/followers/${userId}`)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            const followdata = response?.data?.data?.followers?.filter(
              (follower) => follower?._id === user._id
            );

            console.log(followdata);
            if (followdata) {
              console.log(followdata);
              setFollowText(true);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [response?.data, user]);
  useEffect(() => {
    if (response?.data) {
      const postid = response?.data?.details?._id;
      console.log("POSTID: ", postid);
      axios
        .get(`${backendUrl}/likes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const likeData = response?.data?.data?.likes?.filter(
            (like) => like.post._id === postid
          );
          console.log(likeData);
          if (likeData.length > 0) {
            setLikeText(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, response?.data]);

  useEffect(() => {
    if (postData !== response) {
      setResponse(postData);
    }
  }, [postData, response]);

  const getComments = async (postId) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.get(`${backendUrl}/comments/${postId}`);
      setComments(data);
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message ||
          "An error occurred during fetching comments"
      );
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    if (comment === "") {
      showToast("error", "Comment can't be empty");
    } else {
      try {
        const { data } = await axios.post(
          `${backendUrl}/comments/`,
          {
            content: comment,
            postId: response?.data?.details?._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) {
          showToast("success", data.message || "Comment added Successfully");
          setComment("");
          setShowCommentBox(false);
        } else {
          showToast("error", data.message || "Error To Add comment");
        }
      } catch (error) {
        console.log(error);
        showToast(
          "error",
          error.response?.data?.message || "An error occurred "
        );
      }
    }
  };
  const removeComment = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/comments/${commentId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        showToast("success", data.message || "Comment deleted Successfully");

        setShowCommentBox(false);
      } else {
        showToast("error", data.message || "Error To Delete comment");
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message || "An error occurred to delete comment"
      );
    }
  };
  console.log("COMMENTS: ", comments);
  const updateComment = async (commentId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/comments/${commentId}`,
        { content: editComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        showToast("success", data.message || "Comment Edited Successfully");

        setShowCommentBox(false);
      } else {
        showToast("error", data.message || "Error To Edit comment");
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message || "An error occurred to edit comment"
      );
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/likes/toggle`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        showToast("success", data?.message);

        setLikeText((prev) => !prev);
      } else {
        showToast("error", data.message || "Error To Like Post");
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message || "An error occurred to Like post"
      );
    }
  };
  const handleFollow = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/toggle-follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        showToast("success", data?.message);

        setFollowText((prev) => !prev);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message || "An error occurred to Follow User"
      );
    }
  };

  return (
    <>
      <div className="flex lg:flex-row flex-col">
        <div className="w-full lg:w-4xl flex flex-col items-center overflow-auto bg-gray-50">
          {/* Author Section */}
          <div className="flex m-0 h-20 gap-x-6 items-center box-border w-full max-w-4xl px-4">
            <img
              src={
                response?.data?.details?.author[0]?.profileImage || assets.user
              }
              className="rounded-full bg-center w-14 h-14 object-cover"
              alt="userImage"
            />
            <h2 className="text-2xl font-semibold">
              {response?.data?.details?.author[0]?.username}
            </h2>
            <span
              onClick={() =>
                handleFollow(response?.data?.details?.author[0]?._id)
              }
              className="font-semibold lg:text-2xl text-xl text-blue-700 cursor-pointer"
            >
              {followText ? "Unfollow" : "Follow"}
            </span>
          </div>

          {/* Blog Title */}
          <div className="flex flex-col gap-y-4 w-full max-w-4xl px-4">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
              {response?.data?.details?.title}
            </h1>

            {/* Blog Image */}
            <img
              className="w-full h-[70vh] object-cover bg-center rounded-xl"
              src={response?.data?.details?.image}
              alt="Blog Cover"
            />

            {/* Blog Content with Styled HTML */}
            <div
              className="prose content prose-lg lg:prose-2xl text-gray-800 p-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(response?.data?.details?.content),
              }}
            ></div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  getComments(response?.data?.details?._id);
                  setShowCommentBox(true);
                }}
                className="rounded-lg bg-blue-500 m-4 lg:w-60 text-white font-semibold px-4 py-2 hover:bg-blue-600 cursor-pointer lg:text-2xl"
              >
                View Comments
              </button>

              {isLoggedIn && user._id && (
                <button
                  onClick={() => {
                    handleLike(response?.data?.details?._id);
                  }}
                  className="rounded-lg bg-blue-500 m-4 lg:w-60 text-white font-semibold px-4 py-2 hover:bg-blue-600 cursor-pointer lg:text-2xl"
                >
                  {likeText ? "Liked" : "Like"}
                </button>
              )}
            </div>
          </div>
        </div>
        {commentBox && (
          <div className=" lg:w-xl">
            {isLoggedIn === false && (
              <p className="text-lg lg:text-2xl font-medium">
                Please login to add comment
              </p>
            )}
            {isLoggedIn && (
              <form onSubmit={handleComment}>
                <label
                  className="font-semibold lg:text-2xl lg-xl m-2"
                  htmlFor="comment"
                >
                  Add Comment
                </label>
                <input
                  placeholder="add comment here "
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  className="outline-none w-full border-b-2 focus:border-b-blue-500 transition-all p-3 duration-150 my-2"
                  type="text"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500  text-white m-2 font-semibold px-4 py-1 hover:bg-blue-600 cursor-pointer lg:text-2xl"
                >
                  Add
                </button>
              </form>
            )}
            <h1 className="lg:text-3xl text-2xl font-semibold m-2">Comments</h1>
            {comments &&
              comments.data &&
              comments?.data.map((comm) => (
                <div key={comm._id} className="my-4 shadow-md">
                  <div className="flex justify-between lg:justify-around">
                    <div className="flex gap-x-12  lg:w-lg items-center ">
                      {comm.author?.profileImage !== "" ? (
                        <img
                          src={comm.author?.profileImage}
                          className="rounded-full bg-center lg:w-13 w-10"
                          alt="userImage"
                        />
                      ) : (
                        <img
                          src={assets.user}
                          alt="userImage"
                          className="  lg:w-13  w-9"
                        />
                      )}
                      <h2 className="lg:text-2xl text-xl font-semibold">
                        {comm.author?.username}
                      </h2>
                      {isLoggedIn && user._id == comm.author._id && (
                        <button
                          onClick={() => {
                            if (editingCommentId === comm._id) {
                              updateComment(comm._id);
                              setEditingCommentId(null); // Close edit box after saving
                            } else {
                              setEditingCommentId(comm._id);
                              setEditComment(comm.content); // Load existing comment into input field
                            }
                          }}
                          className="rounded-lg bg-green-500 m-4 text-white font-semibold px-4 py-1 hover:bg-green-600 cursor-pointer lg:text-2xl"
                        >
                          {editingCommentId === comm._id ? "Save" : "Edit"}
                        </button>
                      )}
                    </div>
                    {isLoggedIn && user._id == comm.author._id && (
                      <img
                        src={assets.remove}
                        width={32}
                        className="cursor-pointer"
                        onClick={() => removeComment(comm._id)}
                        alt=""
                      />
                    )}
                  </div>

                  <div className="text-lg lg:text-2xl m-2">
                    {editingCommentId !== comm._id && comm.content}
                    {isLoggedIn &&
                      user._id == comm.author._id &&
                      editingCommentId === comm._id && (
                        <input
                          placeholder="Edit comment here"
                          onChange={(e) => setEditComment(e.target.value)}
                          value={editComment}
                          className="outline-none w-full border-b-2 focus:border-b-blue-500 transition-all p-3 duration-150 my-2"
                          type="text"
                        />
                      )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ReadBlog;
