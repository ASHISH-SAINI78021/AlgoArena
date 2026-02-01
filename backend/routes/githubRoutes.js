const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const authenticateToken = require('../middleware/auth');

// Public route to get auth URL (frontend needs this to redirect)
router.get('/auth', githubController.getAuthUrl);

// Protected routes (require user to be logged in to app)
router.post('/callback', authenticateToken, githubController.callback);
router.get('/status', authenticateToken, githubController.status);
router.post('/push', authenticateToken, githubController.pushCode);

module.exports = router;
