// API Configuration
// This file can be modified for different environments

const config = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:5000'
  },
  
  // Production environment
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://your-custom-domain.com'
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export the appropriate configuration
export const apiConfig = config[environment] || config.development;

// Export the API URL for use in components
export const API_URL = apiConfig.apiUrl;

console.log('API Configuration:', {
  environment,
  apiUrl: API_URL
}); 