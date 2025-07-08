const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:password123@localhost:27017/blogdb?authSource=admin';
    await mongoose.connect(mongoUrl);
    console.log('Connected to DB successfully!!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Request logging middleware
app.use((req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
});

// Import models
const User = require('./models/user');
const Blog = require('./models/blog');

// Routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs');
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, name, password } = req.body;
    
    if (!username || !name || !password) {
      return res.status(400).json({ error: 'Username, name, and password are required' });
    }
    
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      name,
      passwordHash
    });
    
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, author, url, likes, userId } = req.body;
    
    if (!title || !author || !userId) {
      return res.status(400).json({ error: 'Title, author, and userId are required' });
    }
    
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: userId
    });
    
    const savedBlog = await blog.save();
    
    // Add blog to user's blogs array
    await User.findByIdAndUpdate(userId, { $push: { blogs: savedBlog._id } });
    
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
const PORT = process.env.PROD_PORT || 3001;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT} and DB URL is ${process.env.MONGO_URL}`);
    });
  });
}

module.exports = app;
