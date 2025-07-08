# Blog App with Service Container Testing

A Node.js blog application demonstrating GitHub Actions workflows with MongoDB service containers for testing.

## 🎯 **Project Purpose**

This project demonstrates how to:
- Create a **Node.js application** that uses a database
- Set up **GitHub Actions workflow** with a **service container** for the database
- Test the application code against the service container database
- Configure the application to connect to database at `localhost` during CI/CD

## 🏗️ **Architecture**

### **Development Environment**
- **Application**: Node.js Express API (not containerized)
- **Database**: MongoDB running in Docker container
- **Connection**: App connects to `localhost:27017`

### **CI/CD Testing Environment**
- **Application**: Node.js code tested directly
- **Database**: MongoDB service container in GitHub Actions
- **Connection**: App connects to `localhost:27017` (service container)

## 🚀 Features

- **Node.js Express API** (application code, not containerized)
- **MongoDB service container** for testing in CI/CD
- **GitHub Actions workflow** with service container integration
- **Automated testing** against service container database
- **Localhost database connection** during testing
- **Sample data initialization** in service container

## 📋 Prerequisites

- Node.js 20+
- MongoDB (for local development)
- Docker (for local MongoDB container)
- Git and GitHub account

## 🛠️ Local Development

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd CBD-3345-SVC-CONTAINER
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required environment variables:**
```env
PROD_PORT=3001
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password-here
MONGO_DATABASE=blogdb
SECRET_KEY=your-super-secret-jwt-key-here
MONGO_URL=mongodb://admin:your-secure-password-here@localhost:27017/blogdb?authSource=admin
```

**⚠️ Security Note:** Never commit the `.env` file to version control!

### 3. Start MongoDB (using Docker)
```bash
docker compose up -d mongo
```

### 4. Run Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Verify Setup
- API Health: `http://localhost:3001/api/ping`
- Get Users: `http://localhost:3001/api/users`
- Get Blogs: `http://localhost:3001/api/blogs`

## 🧪 Testing

### Run Tests Locally
```bash
npm install
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Integration Tests
```bash
npm run test:integration
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/ci-cd.yml` file defines a complete CI/CD pipeline:

#### 1. **Test Job** with MongoDB Service Container
- Spins up MongoDB as a service container
- Runs database initialization scripts
- Executes unit and integration tests
- Performs API health checks

#### 2. **Build Job**
- Builds Docker image
- Pushes to Docker Hub registry
- Uses build cache for efficiency

#### 3. **Deploy Job**
- Deploys to production (placeholder)
- Only runs on main branch

### Service Container Configuration

```yaml
services:
  mongo:
    image: mongo:latest
    ports:
      - 27017:27017
    env:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: blogdb
    options: >-
      --health-cmd "mongosh --eval 'db.runCommand({ping: 1})' --quiet"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String (unique, required),
  name: String (required),
  passwordHash: String (required),
  blogs: [ObjectId] (references to Blog documents)
}
```

### Blogs Collection
```javascript
{
  title: String (required),
  author: String (required),
  url: String,
  likes: Number,
  user: ObjectId (reference to User document)
}
```

## 🏗️ Project Structure

```
CBD-3345-SVC-CONTAINER/
├── .github/workflows/
│   └── ci-cd.yml                 # GitHub Actions workflow
├── mongo-init/
│   └── 01-init-data.js          # Database initialization script
├── tests/
│   ├── setup.js                 # Test configuration
│   ├── api.test.js              # Unit tests
│   └── integration.test.js      # Integration tests
├── models/
│   ├── user.js                  # User model
│   └── blog.js                  # Blog model
├── docker-compose.yaml          # Docker Compose configuration
├── package.json                 # Node.js dependencies and scripts
├── .env                         # Environment variables
└── README.md                    # This file
```

## 🎯 Sample Data

The application comes with pre-populated sample data:

### Users (5 total)
- `john_doe` (John Doe)
- `jane_smith` (Jane Smith)
- `mike_wilson` (Mike Wilson)
- `sarah_jones` (Sarah Jones)
- `alex_brown` (Alex Brown)

### Blogs (10 total)
- Various tech-related blog posts
- Each user has 2 blog posts
- All passwords are: `password123`

## 🔧 Configuration

### Environment Variables
- `PROD_PORT`: Application port (default: 3001)
- `MONGO_URL`: MongoDB connection string
- `SECRET_KEY`: JWT signing secret
- `NODE_ENV`: Environment (development/test/production)

### Docker Compose Services
- **api**: Node.js application container
- **mongo**: MongoDB database container
- **Networking**: Custom bridge network
- **Volumes**: Persistent MongoDB data storage

## 🚀 Deployment

### GitHub Actions Secrets Required
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token

### Triggering the Pipeline
```bash
git add .
git commit -m "Add CI/CD pipeline with service container"
git push origin main
```

## 📈 Monitoring

Monitor your GitHub Actions workflow:
1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. View workflow runs and logs
4. Check test results and deployment status

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB service is healthy
   - Verify connection string format
   - Ensure authentication credentials are correct

2. **Tests Failing**
   - Check database initialization
   - Verify test environment variables
   - Review test timeouts

3. **Docker Build Issues**
   - Verify Dockerfile exists
   - Check Docker Hub credentials
   - Review build context

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔐 Security Configuration

### GitHub Secrets Setup

Before running the CI/CD pipeline, you **must** set up GitHub Secrets:

1. **Go to your GitHub repository**
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Add the following secrets:**

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SECRET_KEY` | JWT signing secret | `your-super-secret-jwt-key-here` |
| `MONGO_USERNAME` | MongoDB root username | `admin` |
| `MONGO_PASSWORD` | MongoDB root password | `your-secure-password-123` |
| `MONGO_DATABASE` | MongoDB database name | `blogdb` |

### Local Development Security

```bash
# Use .env.example as template
cp .env.example .env

# Edit with your local values (DO NOT COMMIT THIS FILE)
nano .env
```

**📖 For detailed security setup, see [SECURITY.md](SECURITY.md)**
# CBD-3345-WEEK-10
