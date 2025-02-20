import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {showToast} from "../utils/toast.js"
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../utils/backendURL.js";

function ResetPassword() {
  

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const inputRefs = useRef([]);
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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/users/send-reset-otp`,
        { email }
      );
      if (data) {
        setIsEmailSent(true);
        showToast("success",data.message)
    } else {
        showToast("error",data.message)
      }
    } catch (error) {
        console.error("Error during request:", error);
      showToast("error", error.response?.data?.message || "Invalid email or password")
    }
  };
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value).join("");
    setOtp(otpArray);
    setIsOtpSent(true);
  };
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/users/reset-password`,
        { newPassword, email, otp }
      );
      if (data) {
        showToast("success",data.message)
        navigate("/sign-up");
    } else {
        showToast("error",data.message)
      }
    } catch (error) {
      console.log(error);
      showToast("error","something went wrong")
    }
  };

  return (

    <>
   
    <div className="flex items-center gap-5 justify-center mt-20">
     
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="w-96 p-8 text-sm  rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-semibold dark:text-white text-center mb-4">
            Reset Password
          </h1>
          <p className="mb-6 text-zinc-700 text-center">
            Enter your email to reset your password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full border-1 text-black dark:text-white">
           
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent dark:text-white outline-none w-full"
              type="email"
              placeholder="Email id"
              required
              name="email"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r w-full from-indigo-500 to-indigo-900 text-white cursor-pointer font-semibold m-2 p-3 mt-7 rounded-full"
          >
            Send Email
          </button>
        </form>
      )}
      {!isOtpSent && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="w-96 p-8 text-sm rounded-lg shadow-md"
        >
          <h1 className="text-2xl dark:text-white font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="mb-6 text-zinc-800 dark:text-white  text-center">
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
            Submit
          </button>
        </form>
      )}

      {isOtpSent && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="w-96 p-8 text-sm  rounded-lg shadow-md"
        >
          <h1 className="text-2xl dark:text-white font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="mb-6 dark:text-white text-zinc-800 text-center">
            Enter your new password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full border-1">
            
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent dark:text-white outline-none w-full"
              type="password"
              placeholder="New Password"
              required
              minLength={6}
              name="newPassword"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r w-full from-indigo-500 to-indigo-900 text-white cursor-pointer font-semibold m-2 p-3 mt-7 rounded-full"
          >
            Submit
          </button>
        </form>
      )}
    </div>
    </>
  );
}

export default ResetPassword;
