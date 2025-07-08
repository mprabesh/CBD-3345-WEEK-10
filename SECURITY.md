# Security Configuration Guide

## 🔐 GitHub Secrets Setup

To secure your environment variables, you need to set up GitHub Secrets instead of hardcoding sensitive values in your workflow files.

### 📋 Required Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SECRET_KEY` | JWT signing secret | `your-super-secret-jwt-key-here` |
| `MONGO_USERNAME` | MongoDB root username | `admin` |
| `MONGO_PASSWORD` | MongoDB root password | `your-secure-password-123` |
| `MONGO_DATABASE` | MongoDB database name | `blogdb` |

### 🔧 How to Add Secrets

1. **Go to your GitHub repository**
2. **Click Settings** (top menu)
3. **Navigate to Secrets and variables** → **Actions**
4. **Click "New repository secret"**
5. **Add each secret** with the name and value from the table above

### 🛡️ Security Best Practices

#### ✅ **DO:**
- Use GitHub Secrets for all sensitive data
- Use strong, unique passwords
- Rotate secrets regularly
- Use different secrets for different environments (dev, staging, prod)
- Use environment-specific secrets for different branches

#### ❌ **DON'T:**
- Never commit secrets to your repository
- Don't use weak passwords
- Don't share secrets in plain text
- Don't use the same secrets across multiple projects

### 🔄 Environment-Specific Secrets

For different environments, you can use environment-specific secrets:

```yaml
# For production environment
production:
  SECRET_KEY: ${{ secrets.PROD_SECRET_KEY }}
  MONGO_PASSWORD: ${{ secrets.PROD_MONGO_PASSWORD }}

# For staging environment  
staging:
  SECRET_KEY: ${{ secrets.STAGING_SECRET_KEY }}
  MONGO_PASSWORD: ${{ secrets.STAGING_MONGO_PASSWORD }}
```

### 🔍 Local Development Security

For local development, create a `.env` file (already in .gitignore):

```env
# .env file (DO NOT COMMIT THIS FILE)
PROD_PORT=3001
SECRET_KEY=your-local-secret-key
MONGO_USERNAME=admin
MONGO_PASSWORD=your-local-password
MONGO_DATABASE=blogdb
MONGO_URL=mongodb://admin:your-local-password@localhost:27017/blogdb?authSource=admin
```

### 🚨 Security Checklist

- [ ] All secrets are stored in GitHub Secrets
- [ ] No hardcoded passwords in code
- [ ] `.env` file is in `.gitignore`
- [ ] Strong passwords are used
- [ ] Secrets are environment-specific
- [ ] Regular secret rotation is planned

### 🔧 Additional Security Measures

#### 1. **IP Restrictions** (if using cloud databases)
```yaml
# Example for MongoDB Atlas
MONGO_URL: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### 2. **Environment Protection Rules**
- Set up environment protection rules in GitHub
- Require reviewers for production deployments
- Add deployment restrictions

#### 3. **Audit Logging**
- Monitor secret access in GitHub Actions logs
- Set up alerts for failed authentication attempts
- Regular security audits

### 🔄 Secret Rotation Strategy

1. **Monthly rotation** of critical secrets
2. **Automated rotation** using GitHub Actions
3. **Immediate rotation** if secrets are compromised
4. **Documentation** of rotation procedures

### 📝 Example Secure Workflow

```yaml
name: Secure CI/CD Pipeline

on:
  push:
    branches: [ main ]

env:
  NODE_ENV: production
  SECRET_KEY: ${{ secrets.SECRET_KEY }}

jobs:
  secure-test:
    runs-on: ubuntu-latest
    
    services:
      mongo:
        image: mongo:latest
        env:
          MONGO_INITDB_ROOT_USERNAME: ${{ secrets.MONGO_USERNAME }}
          MONGO_INITDB_ROOT_PASSWORD: ${{ secrets.MONGO_PASSWORD }}
          
    steps:
      - uses: actions/checkout@v4
      
      - name: Test with secure env
        env:
          MONGO_URL: mongodb://${{ secrets.MONGO_USERNAME }}:${{ secrets.MONGO_PASSWORD }}@localhost:27017/${{ secrets.MONGO_DATABASE }}?authSource=admin
        run: npm test
```

### 🆘 Emergency Procedures

If secrets are compromised:

1. **Immediately revoke** the compromised secrets
2. **Generate new secrets** with different values
3. **Update GitHub Secrets** with new values
4. **Redeploy applications** with new secrets
5. **Audit logs** for unauthorized access
6. **Document the incident** for future reference

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
