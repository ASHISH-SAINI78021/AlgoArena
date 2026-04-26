const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// Get all unique tags
router.get('/tags/all', async (req, res) => {
    try {
        const tags = await Problem.distinct('tags');
        res.json(tags.filter(Boolean).sort());
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

// Get all problems (list view with pagination and filters)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search, difficulty, tag } = req.query;

        const query = {};
        
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (difficulty && difficulty !== 'All Difficulty') {
            query.difficulty = difficulty;
        }
        if (tag) {
            query.tags = tag;
        }

        const skip = (page - 1) * limit;

        const totalProblems = await Problem.countDocuments(query);
        const problems = await Problem.find(query, 'title slug difficulty tags')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            problems,
            totalPages: Math.ceil(totalProblems / limit),
            currentPage: page,
            totalProblems
        });
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
