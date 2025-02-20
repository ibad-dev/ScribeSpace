import React, { useState } from "react";
import { showToast } from "../utils/toast.js";
import axios from "axios";
import { backendUrl } from "../utils/backendURL.js";
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
    <div className="border-2 flex flex-col gap-y-3">
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Get in touch
        </h1>
        <p className="lg:text-xl text-lg my-2">
          We'd love to hear from you! Whether you're a writer looking for
          support, a reader with feedback, or just someone who wants to say
          hello, please don't hesitate to contact us.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="lg:mx-4">
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
          placeholder="add email here"
          className=" outline-none mt-3 lg:w-full mb-3 w-80 border-b-2 border-b-gray-600 p-2 text-lg bg-transparent focus:border-blue-500"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <label htmlFor="message" className="lg:text-2xl text-lg font-semibold">
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
          className="lg:text-xl text-sm font-semibold lg:mt-4 mt-9 right-4 lg:absolute bottom-4 bg-blue-600 rounded-md  hover:bg-blue-700 text-white cursor-pointer px-4 py-2 w-full lg:w-40"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;
