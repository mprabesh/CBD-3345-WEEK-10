const mongoose = require('mongoose');
const request = require('supertest');

describe('Integration Tests - Blog App with Service Container', () => {
  let app;
  
  beforeAll(async () => {
    // Connect to test database
    const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:password123@localhost:27017/blogdb?authSource=admin';
    
    try {
      await mongoose.connect(mongoUrl);
      console.log('Connected to test database');
    } catch (error) {
      console.error('Failed to connect to test database:', error);
      throw error;
    }
    
    // Import app after database connection
    app = require('../app');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Full Application Flow', () => {
    test('should perform complete user and blog operations', async () => {
      // 1. Get all users
      const usersResponse = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(usersResponse.body).toHaveLength(5);
      
      // 2. Get all blogs
      const blogsResponse = await request(app)
        .get('/api/blogs')
        .expect(200);
      
      expect(blogsResponse.body).toHaveLength(10);
      
      // 3. Check user-blog relationships
      const johnUser = usersResponse.body.find(user => user.username === 'john_doe');
      const johnBlogs = blogsResponse.body.filter(blog => blog.author === 'John Doe');
      
      expect(johnUser).toBeTruthy();
      expect(johnBlogs).toHaveLength(2);
      
      // 4. Test API health
      await request(app)
        .get('/api/ping')
        .expect(200);
    });

    test('should handle database operations correctly', async () => {
      const User = mongoose.model('User');
      const Blog = mongoose.model('Blog');
      
      // Test user creation
      const newUser = new User({
        username: 'integration_test_user',
        name: 'Integration Test User',
        passwordHash: 'hashedpassword123'
      });
      
      const savedUser = await newUser.save();
      expect(savedUser._id).toBeTruthy();
      
      // Test blog creation
      const newBlog = new Blog({
        title: 'Integration Test Blog',
        author: savedUser.name,
        url: 'https://example.com/integration-test',
        likes: 5,
        user: savedUser._id
      });
      
      const savedBlog = await newBlog.save();
      expect(savedBlog._id).toBeTruthy();
      
      // Test relationships
      const userWithBlogs = await User.findById(savedUser._id);
      userWithBlogs.blogs.push(savedBlog._id);
      await userWithBlogs.save();
      
      const populatedUser = await User.findById(savedUser._id).populate('blogs');
      expect(populatedUser.blogs).toHaveLength(1);
      expect(populatedUser.blogs[0].title).toBe('Integration Test Blog');
      
      // Cleanup
      await Blog.deleteOne({ _id: savedBlog._id });
      await User.deleteOne({ _id: savedUser._id });
    });

    test('should validate data integrity', async () => {
      const User = mongoose.model('User');
      const Blog = mongoose.model('Blog');
      
      // Verify all users have unique usernames
      const users = await User.find();
      const usernames = users.map(user => user.username);
      const uniqueUsernames = [...new Set(usernames)];
      expect(usernames).toHaveLength(uniqueUsernames.length);
      
      // Verify all blogs have valid user references
      const blogs = await Blog.find().populate('user');
      blogs.forEach(blog => {
        expect(blog.user).toBeTruthy();
        expect(blog.user.name).toBe(blog.author);
      });
      
      // Verify user-blog relationships
      const usersWithBlogs = await User.find().populate('blogs');
      usersWithBlogs.forEach(user => {
        user.blogs.forEach(blog => {
          expect(blog.author).toBe(user.name);
        });
      });
    });
  });
});
