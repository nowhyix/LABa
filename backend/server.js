const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/Post'); // Импорт модели Post

const app = express();


app.use(bodyParser.json());
app.use(cors());

// Подсасываюсь к MongoDB
mongoose.connect('mongodb://localhost:27017/embroidery')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const posts = require('./routes/posts');
app.use('/api/posts', posts);

// Обработчик для лайка поста
app.post('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;

  try {
    console.log(`Received like request for post ID: ${postId}`);
    const post = await Post.findById(postId);
    if (!post) {
      console.log(`Post with ID: ${postId} not found`);
      return res.status(404).json({ error: 'Post not found' });
    }

    // Увеличиваем рейтинг на 1
    post.rating += 1;
    await post.save();

    console.log(`Updated rating for post ID: ${postId}, new rating: ${post.rating}`);
    // Возвращаем обновленный пост с новым рейтингом
    res.json({ rating: post.rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Server running');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
