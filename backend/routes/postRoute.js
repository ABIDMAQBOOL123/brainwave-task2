const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyOwnership = require("../middlewares/verifyOwnership")

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPost);

router.put('/:id', authMiddleware,verifyOwnership, updatePost);
router.delete('/:id', authMiddleware,verifyOwnership, deletePost);

module.exports = router;
