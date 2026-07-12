import React, { useState } from "react";
import assets from "../assets/chat-app-assets/assets.js";
import {useAuth} from '../../context/Authcontext.jsx'

export default function LoginPage() {
  const [currState, setCurrState] = useState("Sign up");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [filled, setFilled] = useState(false);
  const {login,logout}=useAuth();

  const onSubmitHandler = async(e) => {
    e.preventDefault();

    if (currState === "Sign up" && !filled) {
      setFilled(true);
      return;
    }
     await  login(currState==="Sign up"?"signup":"login",{name:fullName,email,password,bio});


    // Signup/Login API will go here
    console.log({
      FullName:fullName,
      email,
      password,
      bio,
    });
  };


  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left */}
      <img
        src={assets.logo_big}
        alt=""
        className="w-[min(30vw,250px)]"
      />

      {/* Right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[360px]"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}

          {filled && currState === "Sign up" && (
            <img
              src={assets.arrow_icon}
              alt=""
              onClick={() => setFilled(false)}
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* Step 1 */}
        {currState === "Sign up" && !filled && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
          />
        )}

        {/* Email + Password */}
        {!filled && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            />
          </>
        )}

        {/* Step 2 */}
        {currState === "Sign up" && filled && (
          <textarea
            rows={4}
            placeholder="Provide a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent resize-none"
          />
        )}

        <button
          type="submit"
          className="py-3 rounded-md bg-gradient-to-r from-purple-400 to-violet-600 cursor-pointer"
        >
          {currState === "Sign up"
            ? filled
              ? "Create Account"
              : "Next"
            : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="text-sm">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setFilled(false);
                }}
                className="text-violet-500 cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setFilled(false);
                }}
                className="text-violet-500 cursor-pointer font-medium"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}