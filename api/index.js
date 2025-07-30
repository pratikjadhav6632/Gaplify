// Vercel Serverless Function entry point wrapping the existing Express app
const serverless = require('serverless-http');

// Import the Express instance exported from the server folder
const app = require('../server/index');

module.exports = serverless(app);
