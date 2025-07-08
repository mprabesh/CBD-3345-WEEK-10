// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time
// It creates the database, users, and sample data

// Switch to the blogdb database
db = db.getSiblingDB('blogdb');

// Create users collection with sample data
db.users.insertMany([
  {
    username: "john_doe",
    name: "John Doe",
    passwordHash: "$2b$10$K7L/8Y5mQH5YKk5zQJXKfeLyZwZyWXp3KXdqGFt5hQQVrZDz1YLEm", // password123
    blogs: []
  },
  {
    username: "jane_smith",
    name: "Jane Smith",
    passwordHash: "$2b$10$K7L/8Y5mQH5YKk5zQJXKfeLyZwZyWXp3KXdqGFt5hQQVrZDz1YLEm", // password123
    blogs: []
  },
  {
    username: "mike_wilson",
    name: "Mike Wilson",
    passwordHash: "$2b$10$K7L/8Y5mQH5YKk5zQJXKfeLyZwZyWXp3KXdqGFt5hQQVrZDz1YLEm", // password123
    blogs: []
  },
  {
    username: "sarah_jones",
    name: "Sarah Jones",
    passwordHash: "$2b$10$K7L/8Y5mQH5YKk5zQJXKfeLyZwZyWXp3KXdqGFt5hQQVrZDz1YLEm", // password123
    blogs: []
  },
  {
    username: "alex_brown",
    name: "Alex Brown",
    passwordHash: "$2b$10$K7L/8Y5mQH5YKk5zQJXKfeLyZwZyWXp3KXdqGFt5hQQVrZDz1YLEm", // password123
    blogs: []
  }
]);

// Get the inserted users to get their ObjectIds
const users = db.users.find({}).toArray();
const johnId = users.find(u => u.username === "john_doe")._id;
const janeId = users.find(u => u.username === "jane_smith")._id;
const mikeId = users.find(u => u.username === "mike_wilson")._id;
const sarahId = users.find(u => u.username === "sarah_jones")._id;
const alexId = users.find(u => u.username === "alex_brown")._id;

// Create blogs collection with sample data
const blogInsertResult = db.blogs.insertMany([
  {
    title: "Getting Started with Node.js",
    author: "John Doe",
    url: "https://example.com/nodejs-guide",
    likes: 15,
    user: johnId
  },
  {
    title: "MongoDB Best Practices",
    author: "Jane Smith",
    url: "https://example.com/mongodb-practices",
    likes: 23,
    user: janeId
  },
  {
    title: "React Hooks Deep Dive",
    author: "Mike Wilson",
    url: "https://example.com/react-hooks",
    likes: 42,
    user: mikeId
  },
  {
    title: "Express.js Authentication",
    author: "Sarah Jones",
    url: "https://example.com/express-auth",
    likes: 18,
    user: sarahId
  },
  {
    title: "Docker for Developers",
    author: "Alex Brown",
    url: "https://example.com/docker-guide",
    likes: 31,
    user: alexId
  },
  {
    title: "JavaScript ES6 Features",
    author: "John Doe",
    url: "https://example.com/es6-features",
    likes: 27,
    user: johnId
  },
  {
    title: "RESTful API Design",
    author: "Jane Smith",
    url: "https://example.com/restful-api",
    likes: 35,
    user: janeId
  },
  {
    title: "CSS Grid Layout",
    author: "Mike Wilson",
    url: "https://example.com/css-grid",
    likes: 19,
    user: mikeId
  },
  {
    title: "JWT Authentication Guide",
    author: "Sarah Jones",
    url: "https://example.com/jwt-auth",
    likes: 44,
    user: sarahId
  },
  {
    title: "Microservices Architecture",
    author: "Alex Brown",
    url: "https://example.com/microservices",
    likes: 38,
    user: alexId
  }
]);

// Get the inserted blogs to get their ObjectIds
const blogs = db.blogs.find({}).toArray();

// Update users with their blog references
db.users.updateOne(
  { username: "john_doe" },
  { $set: { blogs: blogs.filter(b => b.user.toString() === johnId.toString()).map(b => b._id) } }
);

db.users.updateOne(
  { username: "jane_smith" },
  { $set: { blogs: blogs.filter(b => b.user.toString() === janeId.toString()).map(b => b._id) } }
);

db.users.updateOne(
  { username: "mike_wilson" },
  { $set: { blogs: blogs.filter(b => b.user.toString() === mikeId.toString()).map(b => b._id) } }
);

db.users.updateOne(
  { username: "sarah_jones" },
  { $set: { blogs: blogs.filter(b => b.user.toString() === sarahId.toString()).map(b => b._id) } }
);

db.users.updateOne(
  { username: "alex_brown" },
  { $set: { blogs: blogs.filter(b => b.user.toString() === alexId.toString()).map(b => b._id) } }
);

// Print success message
print("✅ Database initialized successfully!");
print("👥 Created " + db.users.count() + " users");
print("📝 Created " + db.blogs.count() + " blogs");
print("🔗 Established user-blog relationships");
print("");
print("Sample users created (all with password: password123):");
print("- john_doe (John Doe)");
print("- jane_smith (Jane Smith)");
print("- mike_wilson (Mike Wilson)");
print("- sarah_jones (Sarah Jones)");
print("- alex_brown (Alex Brown)");
