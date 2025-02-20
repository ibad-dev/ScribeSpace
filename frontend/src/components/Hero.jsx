import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="bg-gray-100 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800">
            Share Your Thoughts, Inspire the World!
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Create and share your ideas effortlessly. Start your blog today!
          </p>

          <div className="mt-6">
            <button
              onClick={() => navigate("/create-post")}
              className="bg-blue-600 text-white cursor-pointer px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
            > 
              Start Writing
            </button>
            <button
              onClick={() => navigate("/blogs")}
              className="bg-gray-300 text-gray-800 cursor-pointer px-6 py-3 rounded-lg text-lg ml-4 hover:bg-gray-400"
            >
              Explore Blogs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
