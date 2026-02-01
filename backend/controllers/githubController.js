const axios = require('axios');
const User = require('../models/User');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// 1. Get Auth URL
exports.getAuthUrl = (req, res) => {
  // Redirect to FRONTEND callback page
  // In production, this should be the deployed frontend URL
  const frontendUrl = req.headers.origin || 'http://localhost:5173';
  const redirectUri = `${frontendUrl}/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo user`;
  res.json({ url });
};

// 2. Handle Callback & Save Token
exports.callback = async (req, res) => {
  const { code, userId } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Exchange code for token
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = response.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: "Failed to obtain access token from GitHub" });
    }

    // Save to user (if userId provided, meaning we are connecting from settings)
    // NOTE: In a real flow, you might handle this differently (e.g., via session or passing state)
    // Here we assume the frontend sends the user ID or we get it from an authenticated request context if possible.
    // However, the callback often comes from a redirect where we might lose auth headers if not careful.
    // Strategy: The frontend will receive the code from the redirect params, THEN call this API endpoint with the code and the auth header.
    
    // We expect this endpoint to be called BY THE FRONTEND after it grabs the code from the URL.
    // So we can use req.user (from auth middleware)
    
    // START_MODIFICATION: We assume this is a protected route called by frontend
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    await User.findByIdAndUpdate(req.user.id, { githubAccessToken: accessToken });

    res.json({ message: "GitHub connected successfully", accessToken }); // sending token back just in case, but usually stored in DB is enough
  } catch (error) {
    console.error("GitHub Auth Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to authenticate with GitHub" });
  }
};

// 3. Check Connection Status
exports.status = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.githubAccessToken) {
      return res.json({ connected: false });
    }
    
    // verify token is still valid by fetching user profile
    try {
        const ghUser = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${user.githubAccessToken}` }
        });
        res.json({ connected: true, username: ghUser.data.login });
    } catch (e) {
        // Token invalid
        await User.findByIdAndUpdate(req.user.id, { githubAccessToken: null });
        res.json({ connected: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Push Code
exports.pushCode = async (req, res) => {
  const { repoName, fileName, content, message, branch = 'main' } = req.body;
  
  if (!repoName || !fileName || !content) {
    return res.status(400).json({ error: "Repository name, file name, and content are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.githubAccessToken) {
      return res.status(401).json({ error: "GitHub not connected" });
    }

    const token = user.githubAccessToken;
    const headers = { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
    };

    // 1. Get GitHub Username
    let owner;
    try {
        const userRes = await axios.get('https://api.github.com/user', { headers });
        owner = userRes.data.login;
    } catch (e) {
        return res.status(401).json({ error: "Invalid GitHub token" });
    }

    const fullRepo = `${owner}/${repoName}`;
    const apiUrl = `https://api.github.com/repos/${fullRepo}/contents/${fileName}`;

    // 2. Check if file exists (to get SHA for update)
    let sha;
    try {
      const fileRes = await axios.get(apiUrl, { headers });
      sha = fileRes.data.sha;
    } catch (error) {
      // If 404, file doesn't exist, which is fine (we will create it)
      if (error.response?.status !== 404) {
          // If 404 on the REPO itself, we might need to create the repo?
          // Let's check if the repo exists first.
          try {
             await axios.get(`https://api.github.com/repos/${fullRepo}`, { headers });
          } catch (repoErr) {
             if (repoErr.response?.status === 404) {
                 // Create Repo
                 try {
                     await axios.post('https://api.github.com/user/repos', {
                         name: repoName,
                         private: false, // Default to public? or allow user input?
                         auto_init: true // Initialize so we can push file
                     }, { headers });
                     // Wait a bit for init? 
                 } catch (createErr) {
                     return res.status(400).json({ error: "Repository not found and failed to create it: " + createErr.message });
                 }
             } else {
                 throw error; // Other error
             }
          }
      }
    }

    // 3. Create or Update File
    const payload = {
      message: message || `Update ${fileName} from AlgoArena`,
      content: Buffer.from(content).toString('base64'),
      branch,
    };
    if (sha) payload.sha = sha;

    const commitRes = await axios.put(apiUrl, payload, { headers });

    res.json({ 
        success: true, 
        message: sha ? "File updated successfully" : "File created successfully",
        htmlUrl: commitRes.data.content.html_url
    });

  } catch (error) {
    console.error("GitHub Push Error:", error.response?.data || error.message);
    res.status(500).json({ 
        error: "Failed to push to GitHub", 
        details: error.response?.data?.message || error.message 
    });
  }
};
