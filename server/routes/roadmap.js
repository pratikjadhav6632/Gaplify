const express = require('express');
const router = express.Router();
const axios = require('axios');
const { auth, planAndUsageGuard } = require('../middleware/auth');

router.post('/generate-roadmap', auth, planAndUsageGuard('roadmap'), async (req, res) => {
  try {
    const { topic, level, duration } = req.body;

    const prompt = `Create a structured learning roadmap for ${topic} at ${level} level, spanning ${duration} months.
    Format the response in the following structure using markdown with clickable links and emojis:

    # 🎯 ${topic} Learning Roadmap (${duration} months)
    
    ## 📋 Overview
    [Write a brief, engaging overview of what will be covered in this roadmap. Focus on the key benefits and outcomes.]

    ## 📅 Monthly Breakdown
    
    ### Month 1: [Theme/Focus]
    #### 🎯 Key Topics
    - [Topic 1] - Brief explanation
    - [Topic 2] - Brief explanation
    
    #### 📚 Learning Resources
    - [Resource Name](https://resource-url.com) - Detailed description of what makes this resource valuable
    - [Resource Name](https://resource-url.com) - Detailed description of what makes this resource valuable
    
    #### 🛠️ Project
    [Project description with [relevant link](https://project-url.com)]
    - Project goals
    - Key features to implement
    - Learning outcomes

    [Repeat for each month with unique themes and focuses]
    
    ## 🚀 Key Skills to Master
    - [Skill 1] - Why it's important
    - [Skill 2] - Why it's important
    - [Skill 3] - Why it's important
    
    ## 🏆 Final Project
    [Description of a comprehensive final project that demonstrates all learned skills]
    - Project overview
    - Key features
    - Technologies to use
    - Learning outcomes
    - [Relevant resources and links](https://project-url.com)
    
    ## 📚 Additional Resources
    - [Resource Name](https://resource-url.com) - Detailed description
    - [Resource Name](https://resource-url.com) - Detailed description
    - [Resource Name](https://resource-url.com) - Detailed description

    Keep the response concise and well-structured. Focus on practical, actionable items.
    Include real, working URLs for resources when possible.
    Use emojis to make the content more engaging and visually appealing.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const roadmap = response.data.candidates[0].content.parts[0].text;
    
    if (!roadmap || typeof roadmap !== 'string') {
      throw new Error('Invalid roadmap data received');
    }

    // --- Persist roadmap history ---
    try {
      req.userDoc.roadmapHistory.push({
        topic,
        level,
        duration,
        roadmap
      });
      await req.userDoc.save();
    } catch (persistErr) {
      console.error('Failed to save roadmap history:', persistErr);
    }

    res.json({
      success: true,
      data: roadmap
    });

    // Increment roadmapGenCount for free users
    if (req.userDoc.planType === 'free') {
      req.userDoc.roadmapGenCount = (req.userDoc.roadmapGenCount || 0) + 1;
      await req.userDoc.save();
    }

  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate roadmap',
      details: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router; 