const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Получение всех постов
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Добавление нового поста
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Добавление комментария к посту
router.post('/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const { text, user } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = { user, text };
    post.comments.push(comment);
    await post.save();

    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
