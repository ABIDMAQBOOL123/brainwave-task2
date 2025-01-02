import { useRecoilValue } from "recoil";
import { authState } from "../Atom"; // Import authState atom
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const CreatePostForm = () => {
  const { token, authorized } = useRecoilValue(authState); // Get token from Recoil atom
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required!");
      return;
    }

    if (!token) {
      setError("Authentication token is missing!");
      return;
    }

    try {
      console.log(token);
      console.log({ title, content });
      setIsLoading(true); // Start loading

      // Use axios instead of fetch
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        { title, content },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response) {
        const data = response.data;
        // Redirect to the newly created post page
        navigate(`/posts/${data._id}`);
      } else {
        setError(response.data.message || "Failed to create post");
      }
    } catch (error) {
      setError("An error occurred while creating the post.");
      console.error(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Create a New Post
        </h1>

        {error && (
          <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Post Content
            </label>
            <textarea
              id="content"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter post content"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating Post..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
