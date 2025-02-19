import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../utils/backendURL";
import { showToast } from "../utils/toast";

function VerifyEmail() {
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const otp = inputRefs.current.map((input) => input.value).join("");
    console.log(otp);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/users/verify-email`, {
        otp,
      });
      if (data) {
        showToast("success", data.message);

        navigate("/");
      } else {
        showToast("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Error to verify email");
    }
  };
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1) {
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      } else {
        inputRefs.current[index].blur();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const pasteText = text.split("");
    inputRefs.current.forEach((input, index) => {
      input.value = pasteText[index] || "";
    });
  };
  const handleResend = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/users/verify-otp`,
        {},

        { withCredentials: true }
      );
      if (data) {
        navigate("/verify-email");
        showToast("success", data.message);
      } else {
        showToast("error", data.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <h1 className="text-3xl lg:text-4xl font-semibold m-2 dark:text-white ">
        ScribeSpace
      </h1>
      <div className="flex items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="w96 p-8 text-sm rounded-lg shadow-md"
        >
          <h1 className="text-2xl dark:text-white font-semibold text-center mb-4">
            Verify Email
          </h1>
          <p className="mb-6 dark:text-white text-center">
            Please check your email for the verification code.
          </p>
          <div className="flex mb-8 justify-between">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  className="w-10 h-10 rounded-md text-center text-2xl bg-slate-800 text-white flex items-center justify-center"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r w-full from-indigo-500 to-indigo-900 text-white cursor-pointer font-semibold m-2 p-3 rounded-full"
          >
            Verify
          </button>
          <p className="mb-6 dark:text-white text-center">
            Didn't recive a code?{" "}
            <span
              className=" cursor-pointer mx-1 hover:underline"
              onClick={handleResend}
            >
              Resend
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default VerifyEmail;
