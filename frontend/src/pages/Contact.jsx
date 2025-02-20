import React, { useState } from "react";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
import { assets } from "../assets/asset.js";
function Contact() {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, name, msg].some((i) => i === "")) {
      showToast("error", "Please fill all fields");
    } else {
      try {
        const response = await axios.post(
          `${backendUrl}/contact/`,
          {
            email,
            msg,
            name,
          },
          { withCredentials: true }
        );

        if (response.data) {
          showToast("success", response.data.message);
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
    <div className=" flex flex-col gap-y-3">
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Get in touch
        </h1>
        <p className="lg:text-xl text-lg mt-2">
          We'd love to hear from you! Whether you're a writer looking for
          support, a reader with feedback, or just someone who wants to say
          hello, please don't hesitate to contact us.
        </p>
      </div>
      <div className="lg:flex lg:mx-0 mx-4 justify-around">
        <form
          onSubmit={handleSubmit}
          className="lg:mx-4 lg:mb-0 mb-12 lg:w-xl  "
        >
          <h1 className="lg:text-4xl font-semibold text-sky-800 mb-9 text-2xl">
            Contact Form
          </h1>
          <label htmlFor="name" className="lg:text-2xl text-lg font-semibold">
            Name
          </label>
          <input
            value={name}
            placeholder="Write Blog title"
            onChange={(e) => setName(e.target.value)}
            className=" outline-none  mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
            type="text"
            id="name"
            name="name"
          />
          <label htmlFor="email" className="lg:text-2xl text-lg font-semibold">
            Email
          </label>
          <input
            value={email}
            placeholder="Add email here"
            className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <label
            htmlFor="message"
            className="lg:text-2xl text-lg font-semibold"
          >
            Message
          </label>
          <input
            value={msg}
            placeholder="Add Message here"
            onChange={(e) => setMsg(e.target.value)}
            className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
            type="text"
            id="message"
            name="message"
          />

          <button
            type="submit"
            className="lg:text-xl text-sm font-semibold lg:mt-8 mt-9 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-full lg:w-40"
          >
            Submit
          </button>
        </form>
        <div className="flex gap-y-6 justify-center lg:h-90  flex-col rounded-xl lg:w-xl lg:p-5 p-3 shadow-2xl">
          <div className="flex texl-lg items-center lg:gap-x-5 gap-x-3 lg:text-2xl">
            <img src={assets.mail} className="text-black lg:w-8 w-6" alt="" />
            <span className="font-semibold lg:ml-1 ml-3">Email Us: </span>
            <p className="">scibespace@gmail.com</p>
          </div>

          <div className="flex texl-lg items-center lg:gap-x-5 gap-x-3 lg:text-2xl">
            <img src={assets.phone} className="text-black lg:w-10 w-9" alt="" />
            <span className="font-semibold lg:ml-0 ml-3">Phone: </span>
            <p className="lg:ml-4 ml-6 ">+1 (212) 555-1234</p>
          </div>

          <div className="flex texl-lg items-center lg:gap-x-5 gap-x-3 lg:text-2xl">
            <img
              src={assets.location}
              className="text-black lg:w-10 w-9"
              alt=""
            />
            <span className="font-semibold">Location: </span>
            <p className="">
              Platform Name 123 Main Street, Suite 456 New York, NY 10001 USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
