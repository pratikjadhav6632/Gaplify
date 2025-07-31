const express = require('express');
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
require('dotenv').config();

const router = express.Router();

// Function to clean up unwanted stars and structure the response
function cleanGeminiResponse(text) {
  if (!text) return '';
  let cleaned = text
    .replace(/\*\*/g, '') // Remove all double asterisks (bold markdown)
    .replace(/^\s*\*\s?/gm, '• ') // Replace leading * with bullet
    .replace(/\*\s?/g, '') // Remove any remaining single asterisks
    .replace(/\n{2,}/g, '\n'); // Remove extra newlines
  return cleaned.trim();
}

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Add a system prompt for concise, accurate, well-structured answers
  const systemPrompt = "You are Gaplify's educational and motivational AI assistant.\n\nMission: Empower students and early-career professionals by identifying the gap between their current skill set and industry demands and bridging it through personalised learning paths, mentorship, and curated resources.\n\nGuidelines:\n• Reply concisely, accurately, and in a clear structure (short paragraphs, bullet points, or numbered steps).\n• Use an encouraging tone aligned with Gaplify’s motto: \"Bridge the gap, build your future\".\n• When helpful, reference Gaplify features such as AI-driven skill analysis, personalised roadmaps, mentor matching, and the resource hub.\n• Provide practical, actionable advice and avoid unnecessary elaboration.";

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n' + message }] }
        ]
      })
    });
    const data = await geminiRes.json();
    
    let botText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      (data?.error?.message ? `Gemini API error: ${data.error.message}` : "Sorry, I couldn't get a response. Please try again.");
    botText = cleanGeminiResponse(botText);
    res.json({ text: botText });
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to Gemini API.' });
  }
});

module.exports = router; 