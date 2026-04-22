const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate', aiController.generateCode);
router.post('/analyze-complexity', aiController.analyzeComplexity);
router.post('/ghost-review', aiController.ghostReview);

module.exports = router;
