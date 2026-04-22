const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// Get all problems (list view)
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find({}, 'title slug difficulty tags');
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch problems" });
    }
});

// Get single problem by slug
router.get('/:slug', async (req, res) => {
    try {
        const problem = await Problem.findOne({ slug: req.params.slug });
        if (!problem) return res.status(404).json({ error: "Problem not found" });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch problem" });
    }
});

module.exports = router;
