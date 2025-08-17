// API Configuration
// This file can be modified for different environments

const config = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:5000' // Local backend when running locally
  },
  
  // Staging environment
  staging: {
    apiUrl: 'https://gaplify-staging.onrender.com' // Change this to your staging backend URL
  },
  
  // Production environment
  production: {
    apiUrl: 'https://gaplify.onrender.com' // Change this to your Render backend URL
  }
};

// Get current environment
const environment = import.meta.env.PROD ? 'production' : (import.meta.env.MODE || 'development');

// Export the appropriate configuration
export const apiConfig = config[environment] || config.development;

// Export the API URL for use in components
export const API_URL = config[environment]?.apiUrl || config.development.apiUrl;