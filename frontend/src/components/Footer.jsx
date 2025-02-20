import React, { useState } from "react";
import { showToast } from "../utils/toast";
import axios from "axios";
import { backendUrl } from "../utils/backendURL";
import { toast } from "react-toastify";
function Footer() {
  const [email, setEmail] = useState("");
  const handleSub = async () => {
    if (email === "") {
      showToast("error", "please write something to subscribe");
    } else {
      try {
        const response = await axios.post(  
          `${backendUrl}/sub`,
          { email },
          {
            withCredentials: true,
          }
        );
        if (response) {
          showToast("success", response.data.message);

          console.log(response.data);
        } else {
          showToast("error", response.data.message);
        }
      } catch (error) {
        console.error(error);
        showToast("error", error.message);
      }
    }
  };
  return (
    <div className="">
      <footer className="dark:bg-gray-900  dark:text-white py-10">
        <div className="max-w-6xl mx-auto grid  grid-cols-1 md:grid-cols-4 gap-10 px-6">
          {/* Branding */}
          <div>
            <h2 className="text-xl font-bold">ScribeSpace</h2>
            <p className="text-sm mt-2">
              Your go-to platform for engaging, high-quality content. Share your
              stories, inspire others, and explore thought-provoking blogs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:underline">
                  Explore Blogs
                </a>
              </li>
              <li>
                <a href="/write" className="hover:underline">
                  Write a Blog
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          {/* <div className="">
            <h3 className="text-lg font-semibold ">Follow Us</h3>
            <div className="mt-2 flex gap-3">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400">
                Instagram
              </a>
              <a href="#" className="hover:text-blue-400">
                LinkedIn
              </a>
            </div>
          </div> */}

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm mt-2">
              Subscribe to get the latest blog updates directly to your inbox.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-3 p-2 w-full rounded-md text-black"
            />
            <button
              onClick={handleSub}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 dark:text-gray-400">
          &copy; 2025 ScribeSpace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Footer;
