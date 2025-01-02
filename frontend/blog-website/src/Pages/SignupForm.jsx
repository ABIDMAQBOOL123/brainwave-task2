import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js"; // Add Toastify for notifications
import "toastify-js/src/toastify.css";

const SignupForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) {
        // Show success Toast notification
        Toastify({
          text: "Signup successful! Redirecting to login...",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          close: true,
        }).showToast();

        setTimeout(() => {
          navigate("/login");
        }, 200);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        Toastify({
          text: error.response.data.message || "Signup failed!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      } else {
        Toastify({
          text: "Something went wrong! Please try again later.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className={`w-full text-white py-2 px-4 rounded-md mt-6 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-500 hover:underline font-semibold"
          onClick={switchToLogin}
        >
          Log in
        </a>
      </div>
    </div>
  );
};

export default SignupForm;
