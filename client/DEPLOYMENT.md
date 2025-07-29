# Deployment Configuration Guide

## API URL Configuration

This application is configured to work with different environments (development and production) using environment variables.

### Development Environment

For local development, the API URL is automatically set to `http://localhost:5000`.

### Production Environment

For production deployment on your custom domain, you need to set the `VITE_API_URL` environment variable.

#### Option 1: Environment Variable (Recommended)

Create a `.env` file in the client directory:

```bash
# .env
VITE_API_URL=https://your-custom-domain.com
```

#### Option 2: Build-time Configuration

You can also set the environment variable during the build process:

```bash
VITE_API_URL=https://your-custom-domain.com npm run build
```

#### Option 3: Modify Configuration File

Edit `src/config/api.js` and change the production URL:

```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  
  production: {
    apiUrl: 'https://your-custom-domain.com'  // Change this to your domain
  }
};
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com` |

### Deployment Steps

1. **Set the API URL** using one of the methods above
2. **Build the application**:
   ```bash
   npm run build
   ```
3. **Deploy the `dist` folder** to your hosting provider
4. **Ensure your backend server** is running on the specified domain

### Important Notes

- The axios interceptor automatically adds authentication tokens to requests
- 401 errors are handled globally and will redirect to login
- Make sure your backend CORS settings allow requests from your frontend domain
- The API URL should include the protocol (http:// or https://)

### Troubleshooting

If you're getting 401 errors after deployment:

1. Check that the API URL is correctly set
2. Verify your backend server is running
3. Check browser console for detailed error messages
4. Ensure CORS is properly configured on your backend
5. Verify that authentication tokens are being sent correctly 