
const Post = require('../models/Post');
const mongoose = require('mongoose');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = new Post({ title, content, user: req.user.id });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name') 
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' } 
      });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(postId)
      .populate('user', 'name') 
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' } 
      }); 

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    
    const post = await Post.findByIdAndDelete(req.params.id);

    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

