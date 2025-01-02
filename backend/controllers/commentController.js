const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');


exports.addComment = async (req, res) => {

  try {
    
    const { content } = req.body;

  
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

  
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

  
    const comment = new Comment({ content, user: req.user.id, post: req.params.postId });
    await comment.save();

    
    post.comments.push(comment._id);
    await post.save();

    
    const savedComment = await Comment.findById(comment._id).populate('user', 'name');
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid Comment ID' });
    }

    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    
    const post = await Post.findById(comment.post);
    post.comments.pull(commentId);
    await post.save();

  
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
