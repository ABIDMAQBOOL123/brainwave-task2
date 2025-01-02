import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, authorized } = useRecoilValue(authState);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Blog Posts
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-xl text-gray-600">Loading posts...</span>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                {post.content.slice(0, 150)}...
              </p>
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
