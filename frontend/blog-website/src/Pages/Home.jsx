import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRecoilState } from "recoil";
import { authState } from "../Atom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [isAuthenticated, setAuthState] = useRecoilState(authState);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        Toastify({
          text: "Error fetching posts.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    Cookies.remove("x-auth-token");
    setAuthState(false);
    Toastify({
      text: "Logged out successfully!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #4caf50, #8bc34a)",
      close: true,
    }).showToast();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Header */}
      <header className="bg-transparent p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">BlogSite</h1>
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } md:flex md:items-center md:space-x-6 text-lg font-medium`}
          >
            <Link to="/" className="hover:text-indigo-300 transition-all">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="hover:text-indigo-300 transition-all"
                >
                  Create Post
                </Link>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-indigo-300 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-indigo-300 transition-all"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow mt-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-indigo-200">
          Latest Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300"
              >
                <Link to={`/posts/${post._id}`} className="block">
                  <h3 className="text-2xl font-semibold text-indigo-700 hover:text-indigo-500">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mt-4">
                    {post.content.slice(0, 100)}...
                  </p>
                  <span className="text-gray-400 text-sm mt-4 block">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-lg text-indigo-300">
              No posts available
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 text-center mt-8">
        <p className="text-lg">&copy; 2024 BlogSite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
