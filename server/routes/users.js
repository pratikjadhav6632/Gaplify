const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Update user skills
router.post('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid skills data. Skills must be an array.' 
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    user.skills = skills;
    await user.save();

    res.json({ 
      success: true,
      message: 'Skills updated successfully', 
      skills: user.skills 
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating skills', 
      error: error.message 
    });
  }
});

// Get full user profile (including skills)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

// Get analysis & roadmap history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('analysisHistory roadmapHistory');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, analysisHistory: user.analysisHistory, roadmapHistory: user.roadmapHistory });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
  }
});

// Get user skills
router.get('/skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
});

module.exports = router; 