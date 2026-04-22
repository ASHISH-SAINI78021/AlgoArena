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
    'explain', 'review', 'mistake', 'wrong', 'problem', 'issue', 'help',
    // Languages
    'js', 'javascript', 'python', 'java', 'cpp', 'c++', 'html', 'css', 'react', 'node',
    // Logic/Math
    'logic', 'syntax', 'add', 'subtract', 'calculate', 'compute', 'sum', 'math',
    'string', 'int', 'boolean', 'if', 'else', 'for', 'while'
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
    const { prompt, currentCode, language, problemContext, type = 'general' } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API Key is not configured on the server." });
    }

    // Validate that the prompt is coding-related
    if (!isValidCodingPrompt(prompt)) {
      return res.status(400).json({ 
        error: "This AI assistant only helps with coding tasks. Please ask a programming-related question." 
      });
    }

    const contextString = problemContext 
      ? `User is solving problem: "${problemContext.title}"
Description: ${problemContext.description}
Constraints: ${problemContext.constraints || 'N/A'}`
      : 'No specific problem context provided.';

    const isExplanationRequested = needsExplanation(prompt);

    let systemPrompt = "";
    if (type === 'hint') {
      systemPrompt = `Analyze the user's code direction for the problem: "${problemContext?.title || 'Unknown'}". 
If they are off-track, point it out gently. Give a small conceptual hint. DO NOT give full code.
Current User Code:
${currentCode}`;
    } else {
      systemPrompt = isExplanationRequested 
        ? `You are an expert coding assistant for GhostCode. Analyze the user's code and provide helpful feedback.
Context: ${contextString}
User is working in: ${language}
Current code in editor:
${currentCode}

User Request: ${prompt}

INSTRUCTIONS:
1. Provide a clear explanation with:
   - What the issue/mistake is
   - Why it's a problem
   - How to fix it
2. ALWAYS wrap code in markdown code blocks
3. Be conversational like ChatGPT.`
        : `You are a coding assistant for GhostCode. Generate clean, executable code.
Context: ${contextString}
User is working in: ${language}
Current code in editor:
${currentCode}

User Request: ${prompt}

CRITICAL: Wrap code in markdown code blocks.`;
    }

    // OpenRouter API call using OpenAI-compatible endpoint
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openrouter/auto', // Auto-select best available model
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ghostcode.com',
        'X-Title': 'GhostCode Code Editor'
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

exports.analyzeComplexity = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API Key is not configured." });
    }

    const systemPrompt = `You are a performance analyst. Analyze the following ${language} code and provide its Time and Space complexity.
Be extremely concise. Format as:
Time Complexity: O(...)
Space Complexity: O(...)
Brief Explanation: ... (max 20 words)`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: code }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ghostcode.com',
        'X-Title': 'GhostCode Code Editor'
      }
    });

    const analysis = response.data.choices[0].message.content.trim();
    res.json({ analysis });
    
  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze complexity." });
  }
};

exports.ghostReview = async (req, res) => {
  console.log(`\n👻 [Ghost] Incoming review request for problem: ${req.body.problemContext?.title || 'Unknown'}`);
  try {
    const { code, language, problemContext, userCursors } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API Key not configured." });
    }

    const systemPrompt = `You are a "Ghost Participant" in a collaborative coding session on GhostCode. 
Problem: ${problemContext?.title || 'Unknown'}
Context: ${problemContext?.description || ''}

The user has been sitting inactive, which means they are STUCK. Your goal is to PROACTIVELY guide them through ghost writing. 
You MUST intervene unless their code is already a complete, working solution.

INSTRUCTIONS:
1. If the user's code is mostly empty boilerplate, or incomplete, YOU MUST set "shouldIntervene" to true.
2. ALWAYS try to step in and write the next 1-3 lines of code using "codeToInsert" to get them unstuck (e.g., set up a variable, write the loop statement, or add an edge case check). DO NOT solve the entire problem for them—just 'ghost write' the immediate next step.
3. Provide a SHORT, encouraging comment (max 15 words) explaining what you just wrote or hinting at what they should do next.
4. Specify the exact "lineNumber" where your "codeToInsert" belongs.

Format your response STRICTLY as JSON:
{
  "shouldIntervene": true/false,
  "comment": "your short encouraging hint here",
  "codeToInsert": "1-3 lines of code to un-stick the user",
  "lineNumber": 5,
  "column": 1
}

CRITICAL: Try your best to provide "codeToInsert". Do not just give a hint. Act as a spooky pair-programmer who takes control of the keyboard for a second.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Current Code:\n${code}\n\nUser Cursor Positions: ${JSON.stringify(userCursors)}` }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const ghostAction = JSON.parse(response.data.choices[0].message.content);
    console.log(`[Ghost] Action: shouldIntervene=${ghostAction.shouldIntervene}, hint=${ghostAction.comment}${ghostAction.codeToInsert ? `, code=${ghostAction.codeToInsert}` : ''}`);
    res.json(ghostAction);
    
  } catch (error) {
    console.error("AI Ghost Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Ghost is sleeping..." });
  }
};
