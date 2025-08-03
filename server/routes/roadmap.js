const express = require('express');
const router = express.Router();
const axios = require('axios');
const { auth, planAndUsageGuard } = require('../middleware/auth');

router.post('/generate-roadmap', auth, planAndUsageGuard('roadmap'), async (req, res) => {
  try {
    const { topic, level, duration } = req.body;

    const prompt = `You are an award-winning curriculum designer and student success coach. Create a **concise yet comprehensive** outcome-based learning roadmap for **${topic}** aimed at a **${level}** learner. The roadmap must be realistically achievable within **${duration} months**, optimizing engagement, knowledge retention, and hands-on skill application.

IMPORTANT FORMATTING RULES:
- Use clear section headers with emojis
- Use bullet points for better readability
- Keep paragraphs short and scannable
- Use **bold** for emphasis
- Add blank lines between sections
- Include relevant emojis for visual appeal

GUIDELINES:
1. Follow a progressive Bloom's Taxonomy sequence (Remember → Understand → Apply → Analyze → Evaluate → Create)
2. Emphasize active learning via projects, peer discussion, and spaced repetition
3. Keep language concise, motivating, and student-friendly
4. Define measurable weekly outcomes and "definition of done" check-boxes
5. Reference high-quality resources by name only (no external links) and essential tools

6. End every month with a mini-capstone project and self-assessment
7. Present the monthly overview as a compact markdown table with columns **Month**, **Theme & Focus**, **Key Outcomes**\n\nHere's the structured format to follow:

FORMAT USING MARKDOWN (avoid code blocks, use lists and headers instead):

# 🎯 ${topic} Learning Roadmap — ${duration}-Month Plan

> 💡 *Insert a short motivational quote relevant to lifelong learning*

## 🗺️ Roadmap Overview

**Duration:** ${duration} months  
**Level:** ${level.charAt(0).toUpperCase() + level.slice(1)}

### 📅 Monthly Summary Table (Overview)

| Month | Theme & Focus | Key Outcomes |
|-------|---------------|--------------|

**Month 1: [Theme Name]**  
✨ *Brief theme description*
- **Focus Areas:** 
  - Area 1
  - Area 2
- **Key Outcomes:**
  - Outcome 1
  - Outcome 2

**Month 2: [Theme Name]**  
✨ *Brief theme description*
- **Focus Areas:** 
  - Area 1
  - Area 2
- **Key Outcomes:**
  - Outcome 1
  - Outcome 2

*Continue this pattern for each month*

## 📅 Monthly Planner

### 🗓️ Month 1: [Theme Name]

**🎯 Theme Overview**  
*Brief description of what this month focuses on and why it's important*

**📝 Weekly Breakdown (Weeks 1-4)**

**Week 1: [Topic]**
- **Learning Objectives:**
  - Concept 1
  - Concept 2
- **Practice & Activities:**
  - [ ] Task 1
  - [ ] Task 2
- **Resources:**
  - Resource Name - Brief description
- **Reflection & Notes:**
  - What did I learn?
  - What will I improve next week?
  - Resource Name - Brief description

**Week 2: [Topic]**
*Same structure as Week 1*

**🔧 Hands-on Project**
**Project Name**  
*Brief project description*
- **Objectives:**
  - Objective 1
  - Objective 2
- **Deliverables:**
  - Deliverable 1
  - Deliverable 2
- **Success Criteria:**
  - Criterion 1
  - Criterion 2

**📚 Recommended Resources**
- **📖 Books:**
  - Book Title - Brief description
- **🎥 Videos:**
  - Video Title - Brief description
- **📄 Articles:**
  - Article Title - Brief description

### Repeat the same structure for each remaining month

## 🛠️ Core Tools & Technologies

### Essential Tools
- **Tool Name**  
  *Brief description of what it's used for*  
  *Why it's important for this roadmap*

### Recommended Software
- **Software Name**  
  *Key features and benefits*  
  *How it supports learning*

### Development Environment
- **Environment Setup**  
  *Recommended setup instructions*  
  *Tips for configuration*

## 🎯 Key Skills to Master

### Technical Skills
- **Skill 1**  
  *Why it's important*  
  *How to practice it*
  
- **Skill 2**  
  *Why it's important*  
  *How to practice it*

### Soft Skills
- **Skill 1**  
  *Why it matters*  
  *How to develop it*

## 🏆 Capstone Project

### Project: [Project Name]

**Overview**  
*Brief project description and objectives*

**Key Features**
- Feature 1
- Feature 2
- Feature 3

**Success Criteria**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Stretch Goals**
- Goal 1
- Goal 2

**Submission Requirements**
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

**Resources**
- Resource 1
- Resource 2

## 📋 Self-Assessment Checklist

### Weekly Check-ins
- [ ] Completed all weekly tasks
- [ ] Understood key concepts
- [ ] Applied knowledge in practice
- [ ] Reached out for help when needed

### Monthly Review
- [ ] Achieved monthly goals
- [ ] Identified areas for improvement
- [ ] Updated learning plan if needed
- [ ] Celebrated progress made

### Reflection Questions
1. What was the most challenging concept this month?
2. How did you overcome these challenges?
3. What would you do differently next time?
4. What are you most proud of accomplishing?

## 📚 Additional Learning Resources

### Free Resources
- Resource Name  
  *Brief description and why it's valuable*

### Paid Courses
- Course Name  
  *Key benefits and what you'll learn*

### Communities & Forums
- Community Name  
  *How to get involved and benefits*

### Practice Platforms
- Platform Name  
  *Types of exercises and challenges available*

Guidelines:
- Prefer authoritative, ideally free resources.
- Avoid external links; mention resource names only.
- Keep tone motivating and actionable.
- Avoid unnecessary fluff.`

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