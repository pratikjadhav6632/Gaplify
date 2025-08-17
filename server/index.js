const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration
const whitelist = process.env.NODE_ENV === 'production' 
  ? ['https://www.gaplify.in', 'https://gaplify.in', 'https://gaplify.onrender.com', 'https://skillbridge-ai.vercel.app', 'https://skillbridge-ai-git-main.vercel.app', 'https://skillbridge-ai-git-develop.vercel.app', '*.vercel.app']
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];

console.log('CORS Whitelist:', whitelist);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin matches any whitelist entry
    const isAllowed = whitelist.some(allowedOrigin => {
      // Exact match
      if (origin === allowedOrigin) return true;
      // Wildcard subdomain match (e.g., *.vercel.app)
      if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.slice(2);
        return origin.endsWith(domain);
      }
      return false;
    });

    if (isAllowed) {
      console.log("CORS allowed for:", origin);
      callback(null, true);
    } else {
      console.warn("CORS blocked for:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};


// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillBridge AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const analysisRoutes = require('./routes/analysis');
const feedbackRoutes = require('./routes/feedback');
const roadmapRoutes = require('./routes/roadmap');
const userInterestsRoutes = require('./routes/userInterests');
const chatbotRoute = require('./routes/chatbot');
const paymentRoutes = require('./routes/payment');
const emailRoutes = require('./routes/email');


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api', roadmapRoutes);
app.use('/api/interests', userInterestsRoutes);
app.use('/api/chatbot', chatbotRoute);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', emailRoutes);

const PORT = process.env.PORT || 5000;

// When running locally we start the listener. On Vercel (serverless) we just export the app.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express instance for Vercel Serverless Functions
module.exports = app; 