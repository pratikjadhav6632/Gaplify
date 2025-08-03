const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://gaplify-y3vj.vercel.app', // Your Vercel frontend
    'http://localhost:3000' // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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