import React, { useState, useEffect } from "react";
import { assets } from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../features/authSlice.js";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
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
  const [draft, setDraft] = useState(false);
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
      if (draft === false) {
        const response = await axios.post(
          `
        ${backendUrl}/posts/create-post/publish`,
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
      } else {
        const response = await axios.post(
          `
            ${backendUrl}/posts/create-post/save-as-draft`,
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
      if (draft === false) {
        const response = await axios.post(
          `
        ${backendUrl}/posts/create-post/publish`,
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
      } else {
        const response = await axios.post(
          `
        ${backendUrl}/posts/create-post/save-as-draft`,
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
      }
    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };
  // TipTap Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }), // Allow H1, H2, H3
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "outline-none focus:ring-0 min-h-[200px] p-3", // Ensure focus styling
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

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
          <div className=" p-5 flex-col gap-y-3  tiptap lg:w-4xl relative">
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
              <div className="border-2 border-gray-600 p-3 rounded-md">
                {/* Toolbar */}
                <div className="flex gap-2 mb-2 flex-wrap">
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("bold")
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    Bold
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("italic")
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    Italic
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("heading", { level: 1 })
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("heading", { level: 3 })
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                  >
                    H3
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("bulletList")
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    • Bullet List
                  </button>

                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md ${
                      editor?.isActive("orderedList")
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    1,2,3 List
                  </button>
                </div>

                {/* TipTap Editor Content */}
                {editor && (
                  <EditorContent
                    editor={editor}
                    className="border p-3 min-h-[200px]"
                  />
                )}
              </div>

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
              <button
                type="submit"
                onClick={() => {
                  setDraft(true);
                }}
                className="lg:text-xl text-sm font-semibold lg:mt-6 mt-9 right-45 lg:absolute bottom-4 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-full lg:w-60"
              >
                Save as draft
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Posts;
