import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { FaTrash } from "react-icons/fa"; // Import the trash icon from react-icons

const PostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );
        setPost(response.data); // Set the post data in the state
      } catch (error) {
        console.error("Error fetching post:", error);

        Toastify({
          text: "Failed to load post. Please try again!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      }
    };

    fetchPost();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) {
      Toastify({
        text: "Comment cannot be empty!",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #f093fb, #f5576c)",
        close: true,
      }).showToast();
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { content: newComment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        const newCommentData = response.data;
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newCommentData], // Add new comment to the existing list
        }));
        setNewComment("");
        Toastify({
          text: "Comment added successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          close: true,
        }).showToast();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);

      Toastify({
        text: "Failed to add comment. Please try again!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          withCredentials: true,
        }
      );

      if (response) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter(
            (comment) => comment._id !== commentId
          ),
        }));
        Toastify({
          text: "Comment deleted successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);

      Toastify({
        text: "Failed to delete comment. Please try again!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
    }
  };

  const handleEditClick = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);

      if (response) {
        Toastify({
          text: "Post deleted successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting post:", error);

      Toastify({
        text: "Failed to delete post. Please try again!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {post ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{post.content}</p>
            {/* Edit button */}
            <button
              onClick={handleEditClick}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300"
            >
              Edit Post
            </button>
            {/* Delete button */}
            <button
              onClick={handleDeletePost}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ml-4"
            >
              Delete Post
            </button>
          </div>

          {/* Comment Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Comments
            </h3>

            {/* Comment form */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a comment..."
              ></textarea>
              <button
                onClick={handleCommentSubmit}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Add Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex justify-between items-start bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {comment.user.name}
                      </p>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Loading post...</p>
      )}
    </div>
  );
};

export default PostPage;
