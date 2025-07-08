// Test setup file
const mongoose = require('mongoose');

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console.log during tests to reduce noise
const originalLog = console.log;
global.console = {
  ...console,
  log: jest.fn(),
  error: originalLog,
  warn: originalLog,
  info: originalLog,
};

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.MONGO_URL = process.env.MONGO_URL || 'mongodb://admin:password123@localhost:27017/blogdb?authSource=admin';
});

// Global test cleanup
afterAll(async () => {
  // Close any remaining connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
