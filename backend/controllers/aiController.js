const axios = require('axios');

// Simple prompt validation to check if it's coding-related
const isValidCodingPrompt = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Coding-related keywords
  const codingKeywords = [
    'function', 'code', 'algorithm', 'program', 'script', 'class', 'method',
    'variable', 'loop', 'array', 'object', 'api', 'database', 'query',
    'bug', 'fix', 'debug', 'error', 'implement', 'create', 'write',
    'sort', 'search', 'optimize', 'refactor', 'test', 'validate',
    'explain', 'review', 'mistake', 'wrong', 'problem', 'issue', 'help'
  ];
  
  // Check if prompt contains any coding keywords
  const hasCodingKeyword = codingKeywords.some(keyword => lowerPrompt.includes(keyword));
  
  // Reject if prompt is too short or contains no coding keywords
  if (prompt.trim().length < 5) return false;
  
  return hasCodingKeyword || lowerPrompt.includes('how to') || lowerPrompt.includes('help me');
};

// Detect if user wants explanation vs just code
const needsExplanation = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  const explanationKeywords = [
    'explain', 'why', 'how', 'what', 'review', 'mistake', 'wrong', 
    'error', 'problem', 'issue', 'bug', 'point out', 'find', 'check',
    'analyze', 'where', 'which', 'tell me', 'show me'
  ];
  return explanationKeywords.some(keyword => lowerPrompt.includes(keyword));
};

exports.generateCode = async (req, res) => {
  try {
    const { prompt, currentCode, language } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API Key is not configured on the server." });
    }

    // Validate that the prompt is coding-related
    if (!isValidCodingPrompt(prompt)) {
      return res.status(400).json({ 
        error: "This AI assistant only helps with coding tasks. Please ask a programming-related question." 
      });
    }

    const wantsExplanation = needsExplanation(prompt);

    const fullPrompt = wantsExplanation 
      ? `You are an expert coding assistant for AlgoArena. Analyze the user's code and provide helpful feedback.

User is working in: ${language}
Current code in editor:
${currentCode}

User Request: ${prompt}

INSTRUCTIONS:
1. If the user asks you to review, explain, or point out mistakes, provide a clear explanation with:
   - What the issue/mistake is
   - Why it's a problem
   - How to fix it
2. ALWAYS wrap code in markdown code blocks using triple backticks
3. Format like this:

Here's what's wrong...

\`\`\`${language}
// corrected code here
\`\`\`

4. Be conversational and helpful like ChatGPT

Provide a helpful response:`
      : `You are a coding assistant for AlgoArena. Generate clean, executable code.

User is working in: ${language}
Current code in editor:
${currentCode}

User Request: ${prompt}

CRITICAL: You MUST wrap your code in markdown code blocks like this:

\`\`\`${language}
// your code here
\`\`\`

Generate the code:`;

    // OpenRouter API call using OpenAI-compatible endpoint
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openrouter/auto', // Auto-select best available model
      messages: [
        {
          role: 'user',
          content: fullPrompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://algoarena.com',
        'X-Title': 'AlgoArena Code Editor'
      }
    });

    const generatedCode = response.data.choices[0].message.content;
    res.json({ generatedCode: generatedCode.trim() });
    
  } catch (error) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to generate code from AI.",
      details: error.response?.data?.error?.message || error.message
    });
  }
};
