const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth, planAndUsageGuard } = require('../middleware/auth');
const json5 = require('json5'); // Import json5

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to clean and parse JSON using json5 as a fallback
function cleanAndParseJson(text) {
  
  // Attempt standard JSON.parse first (most efficient if valid)
  try {
    const parsedJson = JSON.parse(text);
    console.log('cleanAndParseJson: Standard JSON.parse successful.');
    return parsedJson;
  } catch (initialError) {
    

    let cleanedText = text;

    try {
      // 1. Remove markdown fences (```json, ```) and trim
      cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '').trim();
      

      // 2. Normalize all whitespace characters to a single space
      // This includes non-breaking spaces, tabs, newlines, etc.
      cleanedText = cleanedText.replace(/[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g, ' ');
      

      // 3. Find the *first* opening brace and the *last* closing brace
      // This is crucial to isolate the JSON object from any surrounding text.
      const firstBraceIndex = cleanedText.indexOf('{');
      const lastBraceIndex = cleanedText.lastIndexOf('}');

      if (firstBraceIndex === -1 || lastBraceIndex === -1 || lastBraceIndex < firstBraceIndex) {
        throw new Error('No valid JSON object (enclosed in {}) found in response after initial cleaning.');
      }

      // Extract only the content within the outermost curly braces
      cleanedText = cleanedText.substring(firstBraceIndex, lastBraceIndex + 1).trim(); // Trim again
      

      // Add this check:
      if (!cleanedText || cleanedText.length < 10) {
        throw new Error('AI response is empty or too short to be valid JSON.');
      }

      // --- Apply json5 for more forgiving parsing ---
      // json5 can handle unquoted keys, trailing commas, comments, etc.
      // We don't need manual regex for these common issues if json5 is used.
      const json5ParsedResult = json5.parse(cleanedText);
     
      return json5ParsedResult;

    } catch (cleaningAndParseError) {
      console.error('cleanAndParseJson: Error during comprehensive JSON cleaning and parsing with json5 fallback:', cleaningAndParseError);
      console.error('cleanAndParseJson: Original text (before any cleaning):', text);
      console.error('cleanAndParseJson: Cleaned text before json5 failure:', cleanedText); // Log the last state of cleanedText
      throw new Error('Failed to parse JSON response even after comprehensive cleaning and json5 fallback.');
    }
  }
}


router.post('/career', auth, planAndUsageGuard('analysis'), async (req, res) => {
  try {
    const { skills, targetRole } = req.body;

    if (!skills || !Array.isArray(skills) || !targetRole || targetRole.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both skills and a target role.'
      });
    }

    // Format skills for the prompt
    const skillsList = skills.map(skill =>
      `${skill.name} (${skill.proficiency}% proficiency)`
    ).join(', ');

    // Create the prompt for Gemini - **SIGNIFICANTLY IMPROVED PROMPT**
    const prompt = `
      You are a career development expert with 10+ years of experience. Analyze the following skills and provide a detailed career path analysis for becoming a ${targetRole}.

      Current Skills:
      ${skillsList}

      RESPONSE FORMAT INSTRUCTIONS:
      1.  You **MUST** respond with a single, valid JSON object.
      2.  **ABSOLUTELY NO** extra text, markdown fences (like \`\`\`json), comments, explanations, or any other characters outside the pure JSON object.
      3.  The JSON object **MUST** strictly adhere to the following exact structure:
          {
            "skillsGap": [
              {
                "skill": "skill name",
                "description": "detailed description of the gap and why it's important"
              }
            ],
            "roadmap": [
              {
                "title": "step title",
                "description": "detailed description of the step",
                "resources": [
                  {
                    "name": "resource name",
                    "description": "brief description of the resource"
                  }
                ]
              }
            ],
            "timeline": "estimated timeline description"
          }
      4.  All property names **MUST** be enclosed in double quotes (e.g., "skillsGap").
      5.  All string values **MUST** be enclosed in double quotes.
      6.  Use commas to separate array elements and object properties.
      7.  **DO NOT** include trailing commas (e.g., {"key": "value", } is invalid).
      8.  Include at least 2-3 resources per roadmap step.

      Focus on:
      - Analyze the specific requirements for the role "${targetRole}"
      - Identify missing or underdeveloped skills needed for this exact role
      - Provide a structured learning path with specific steps
      - Give a realistic timeline estimate based on current skill levels
    `;

    const MAX_RETRIES = 2; // Number of times to retry Gemini API call
    let attempt = 0;
    let analysis;
    let rawResponseText;

    while (attempt <= MAX_RETRIES) {
      try {
     
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or "gemini-1.5-flash" if you have access and prefer
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            response_mime_type: "application/json",
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000,
          },
        });

        const response = await result.response;
        rawResponseText = response.text();
       

        analysis = cleanAndParseJson(rawResponseText);

        // If parsing is successful, break the loop
        break;

      } catch (parseError) {
        console.error(`Attempt ${attempt + 1} failed to parse Gemini response:`, parseError.message);
        console.error('Raw response that caused error:', rawResponseText);
        attempt++;

        if (attempt > MAX_RETRIES) {
          throw new Error('All retries failed to get a valid JSON response from Gemini.');
        }
        // Add a small delay before retrying to avoid hammering the API
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 1s, 2s delay
      }
    }


    // Validate the structure of the analysis after successful parsing
    if (!analysis.skillsGap || !Array.isArray(analysis.skillsGap) ||
        !analysis.roadmap || !Array.isArray(analysis.roadmap) ||
        !analysis.timeline || typeof analysis.timeline !== 'string') {
      console.error('Parsed analysis has invalid top-level structure:', analysis);
      throw new Error('AI response is missing required top-level properties (skillsGap, roadmap, timeline) or they are not in the correct format.');
    }

    // Deeper validation (optional, but recommended for robustness)
    analysis.roadmap.forEach((step, index) => {
        if (!step.title || !step.description || !Array.isArray(step.resources)) {
            console.error(`Roadmap step ${index} has invalid structure:`, step);
            throw new Error(`Roadmap step ${index} is missing required properties (title, description, resources).`);
        }
        step.resources.forEach((resource, resIndex) => {
            if (!resource.name || !resource.description) {
                console.error(`Resource ${resIndex} in roadmap step ${index} has invalid structure:`, resource);
                throw new Error(`Resource ${resIndex} in roadmap step ${index} is missing required properties (name, url, description).`);
            }
           
        });
    });


    // --- Persist analysis history ---
    try {
      // Merge skills into user.skills (avoid duplicates by name)
      const existingSkillNames = new Set(req.userDoc.skills.map(s => s.name.toLowerCase()));
      skills.forEach(skl => {
        if (!existingSkillNames.has(skl.name.toLowerCase())) {
          req.userDoc.skills.push(skl);
        }
      });

      req.userDoc.analysisHistory.push({
        skills,
        targetRole,
        analysis
      });
    } catch (persistErr) {
      console.error('Failed to update user analysis history:', persistErr);
    }

    await req.userDoc.save();

    res.json({
      success: true,
      ...analysis
    });

    // Increment skillAnalysisCount for free users
    if (req.userDoc.planType === 'free') {
      req.userDoc.skillAnalysisCount = (req.userDoc.skillAnalysisCount || 0) + 1;
      await req.userDoc.save();
    }

  } catch (error) {
    console.error('Analysis endpoint error:', error);

    let statusCode = 500;
    let errorMessage = 'Error analyzing career path';

    if (error.message.includes('404') || error.message.includes('not found')) {
      errorMessage = 'AI model not available. Please try again later.';
    } else if (error.message.includes('Failed to parse JSON response')) {
      statusCode = 500; // Still a server-side parsing issue
      errorMessage = error.message; // Use the specific error message from parsing
    } else if (error.message.includes('Invalid analysis structure') || error.message.includes('AI response is missing required top-level properties')) {
      statusCode = 500;
      errorMessage = error.message;
    } else if (error.message.includes('All retries failed')) {
        statusCode = 500;
        errorMessage = error.message;
    }


    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
});

module.exports = router;