// API Configuration
// This file can be modified for different environments

const config = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:5000'
  },
  
  // Production environment
  production: {
    apiUrl: 'https://<your-render-backend-service>.onrender.com' // Change this to your Render backend URL
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export the appropriate configuration
export const apiConfig = config[environment] || config.development;

// Export the API URL for use in components
export const API_URL =
  import.meta.env.MODE === 'production'
    ? config.production.apiUrl
    : config.development.apiUrl;