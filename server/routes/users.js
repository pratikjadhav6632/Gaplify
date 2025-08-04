const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

    // Create a map to track unique skills (case-insensitive)
    const uniqueSkills = new Map();
    
    // Process skills, keeping only the last occurrence of each skill (case-insensitive)
    skills.forEach(skill => {
      if (skill && skill.name) {
        const normalizedSkillName = skill.name.trim().toLowerCase();
        uniqueSkills.set(normalizedSkillName, {
          name: skill.name.trim(),  // Keep original case for display
          proficiency: skill.proficiency || 'Beginner',
          _id: skill._id || new mongoose.Types.ObjectId()
        });
      }
    });

    // Convert back to array
    user.skills = Array.from(uniqueSkills.values());
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

// Remove a specific skill
router.delete('/skills/:skillId', auth, async (req, res) => {
  try {
    const { skillId } = req.params;
    
    if (!skillId) {
      return res.status(400).json({ 
        success: false,
        message: 'Skill ID is required' 
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Find the index of the skill to remove
    const skillIndex = user.skills.findIndex(skill => skill._id.toString() === skillId);
    
    if (skillIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Skill not found' 
      });
    }

    // Remove the skill
    user.skills.splice(skillIndex, 1);
    await user.save();

    res.json({ 
      success: true,
      message: 'Skill removed successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Error removing skill:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error removing skill', 
      error: error.message 
    });
  }
});

module.exports = router; 