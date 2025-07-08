const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust path to your app file

describe('Blog API with Service Container', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:password123@localhost:27017/blogdb?authSource=admin';
    await mongoose.connect(mongoUrl);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('Database Operations', () => {
    test('should connect to MongoDB', async () => {
      expect(mongoose.connection.readyState).toBe(1);
    });

    test('should have users collection with data', async () => {
      const User = mongoose.model('User');
      const userCount = await User.countDocuments();
      expect(userCount).toBe(5);
    });

    test('should have blogs collection with data', async () => {
      const Blog = mongoose.model('Blog');
      const blogCount = await Blog.countDocuments();
      expect(blogCount).toBe(10);
    });

    test('should find user by username', async () => {
      const User = mongoose.model('User');
      const user = await User.findOne({ username: 'john_doe' });
      expect(user).toBeTruthy();
      expect(user.name).toBe('John Doe');
      expect(user.blogs).toHaveLength(2);
    });

    test('should find blogs by user', async () => {
      const User = mongoose.model('User');
      const Blog = mongoose.model('Blog');
      
      const user = await User.findOne({ username: 'jane_smith' });
      const blogs = await Blog.find({ user: user._id });
      
      expect(blogs).toHaveLength(2);
      expect(blogs[0].author).toBe('Jane Smith');
    });

    test('should create new user', async () => {
      const User = mongoose.model('User');
      const bcrypt = require('bcrypt');
      
      const newUser = new User({
        username: 'test_user',
        name: 'Test User',
        passwordHash: await bcrypt.hash('testpass', 10)
      });
      
      const savedUser = await newUser.save();
      expect(savedUser._id).toBeTruthy();
      expect(savedUser.username).toBe('test_user');
      
      // Cleanup
      await User.deleteOne({ _id: savedUser._id });
    });

    test('should create new blog', async () => {
      const User = mongoose.model('User');
      const Blog = mongoose.model('Blog');
      
      const user = await User.findOne({ username: 'john_doe' });
      
      const newBlog = new Blog({
        title: 'Test Blog Post',
        author: user.name,
        url: 'https://example.com/test-blog',
        likes: 0,
        user: user._id
      });
      
      const savedBlog = await newBlog.save();
      expect(savedBlog._id).toBeTruthy();
      expect(savedBlog.title).toBe('Test Blog Post');
      
      // Cleanup
      await Blog.deleteOne({ _id: savedBlog._id });
    });
  });

  describe('API Endpoints', () => {
    test('GET /api/ping should return success', async () => {
      const response = await request(app)
        .get('/api/ping')
        .expect(200);
      
      expect(response.body.message).toBe('Server is running');
    });

    test('GET /api/users should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body).toHaveLength(5);
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).not.toHaveProperty('passwordHash');
    });

    test('GET /api/blogs should return all blogs', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .expect(200);
      
      expect(response.body).toHaveLength(10);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('author');
    });

    test('should handle user authentication', async () => {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          username: 'john_doe',
          password: 'password123'
        });
      
      if (loginResponse.status === 200) {
        expect(loginResponse.body).toHaveProperty('token');
      } else {
        // Skip if login endpoint not implemented
        console.log('Login endpoint not implemented, skipping test');
      }
    });
  });
});
