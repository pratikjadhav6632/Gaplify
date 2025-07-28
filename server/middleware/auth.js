const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

const User = require('../models/User');

// Middleware to check plan and usage limits
const planAndUsageGuard = (type) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.userDoc = user;
    if (user.planType === 'premium') {
      return next();
    }
    if (user.planType === 'free') {
      if (type === 'analysis' && user.skillAnalysisCount >= 1) {
        return res.status(403).json({ message: 'Free plan limit reached for skill analysis. Upgrade to premium.' });
      }
      if (type === 'roadmap' && user.roadmapGenCount >= 1) {
        return res.status(403).json({ message: 'Free plan limit reached for roadmap generation. Upgrade to premium.' });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error in plan/usage guard', error: error.message });
  }
};

module.exports = { auth, planAndUsageGuard }; 