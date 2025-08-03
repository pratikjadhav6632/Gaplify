const express = require('express');
const router = express.Router();
const UserInterest = require('../models/UserInterest');
const { auth, planAndUsageGuard } = require('../middleware/auth');

// Get user's saved resources
router.get('/', auth, planAndUsageGuard('premium'), async (req, res) => {
  try {
    let userInterest = await UserInterest.findOne({ userId: req.user.userId });
    if (!userInterest) {
      userInterest = new UserInterest({ userId: req.user.userId, resources: [] });
      await userInterest.save();
    }
    res.json(userInterest.resources);
  } catch (error) {
    console.error('Error fetching user interests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a resource to user's interests
router.post('/', auth, planAndUsageGuard('premium'), async (req, res) => {
  try {

    const { resourceId, title, description, category, image, link,rating } = req.body;

    // Enhanced validation with detailed logging
    if (!resourceId || !title) {
      console.error('Missing required fields:', { 
        resourceId: resourceId || 'missing', 
        title: title || 'missing',
        fullBody: req.body 
      });
      return res.status(400).json({ 
        message: 'Resource ID and title are required',
        receivedData: { resourceId, title }
      });
    }

    // Validate data types
    if (typeof resourceId !== 'string' || typeof title !== 'string') {
      console.error('Invalid data types:', { 
        resourceId: { value: resourceId, type: typeof resourceId },
        title: { value: title, type: typeof title }
      });
      return res.status(400).json({ 
        message: 'Invalid data types for resourceId or title',
        receivedData: { resourceId, title }
      });
    }

    let userInterest = await UserInterest.findOne({ userId: req.user.userId });
   

    if (!userInterest) {
    
      userInterest = new UserInterest({ userId: req.user.userId, resources: [] });
    }

    // Check if resource already exists
    const existingResource = userInterest.resources.find(
      resource => resource.resourceId === resourceId
    );

    if (existingResource) {
      console.log('Resource already exists in cart:', resourceId);
      return res.status(400).json({ 
        message: 'Resource already saved',
        resourceId: resourceId
      });
    }

    const newResource = {
      resourceId,
      title,
      description,
      category,
      image,
      link,
      rating,
      savedAt: new Date()
    };

    userInterest.resources.push(newResource);

    try {
      await userInterest.save(); 
      res.json(userInterest.resources);
    } catch (saveError) {
      console.error('Error saving to database:', saveError);
      res.status(500).json({ 
        message: 'Database error while saving resource',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error('Error in POST /interests:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Remove a resource from user's interests
router.delete('/:resourceId', auth, planAndUsageGuard('premium'), async (req, res) => {
  try {
    const userInterest = await UserInterest.findOne({ userId: req.user.userId });
    if (!userInterest) {
      return res.status(404).json({ message: 'No saved resources found' });
    }

    userInterest.resources = userInterest.resources.filter(
      resource => resource.resourceId !== req.params.resourceId
    );

    await userInterest.save();
    res.json(userInterest.resources);
  } catch (error) {
    console.error('Error removing resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all resources from user's interests
router.delete('/clear', auth, planAndUsageGuard('premium'), async (req, res) => {
  try {
    const userInterest = await UserInterest.findOne({ userId: req.user.userId });
    if (!userInterest) {
      return res.status(404).json({ message: 'No saved resources found' });
    }

    userInterest.resources = [];
    await userInterest.save();
    res.json(userInterest.resources);
  } catch (error) {
    console.error('Error clearing resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 