import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { authState } from "../Atom";

const LoginForm = ({ switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response && response.data && response.data.token) {
        const token = response.data.token;
        console.log("JWT Token:", token);
        const tokenFromCookies = Cookies.get("x-auth-token");

        // console.log("JWT Token from Cookies: ", tokenFromCookies);
        // const tokenFromHeader = response.headers["authorization"];
        // console.log("JWT Token from Authorization Header: ", tokenFromHeader); // Log the token here

        Cookies.set("x-auth-token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        setAuthState({
          isAuthenticated: true, // Set the authentication status to true
          token, // Store the token in the Recoil state
        });
        console.log(Cookies.get("x-auth-token"));

        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          navigate("/");
        }, 200);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Something went wrong! Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-6 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <div className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="text-blue-500 hover:underline font-semibold"
          onClick={switchToSignup}
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
