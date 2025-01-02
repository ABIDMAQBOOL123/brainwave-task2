
const Post = require('../models/Post'); 

const verifyOwnership = async (req, res, next) => {
  try {
    const postId = req.params.id; 
    const userId = req.user.id; 

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to modify this post" });
    }

    next();
  } catch (error) {
    console.error("Error verifying ownership:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyOwnership;
