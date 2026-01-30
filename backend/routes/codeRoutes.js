const express = require('express');
const router = express.Router();
const axios = require('axios');

// Piston API Endpoint
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

router.post('/execute', async (req, res) => {
    const { language, source, version } = req.body;

    // Map common language names to Piston versions if needed
    // For now we assume frontend sends correct Piston-compatible data
    // OR we default to latest.
    
    try {
        const response = await axios.post(PISTON_API, {
            language: language,
            version: version || "*",
            files: [
                {
                    content: source
                }
            ]
        });

        res.json(response.data);
    } catch (error) {
        console.error("Execution Error:", error.message);
        res.status(500).json({ error: "Failed to execute code" });
    }
});

const CodeData = require('../models/CodeData');
const auth = require('../middleware/auth');

// New: Fetch all codes for the logged-in user
router.get('/user-codes', auth, async (req, res) => {
    try {
        const codes = await CodeData.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(codes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user codes" });
    }
});

router.post('/save', async (req, res) => {
    const { roomId, code, language, userId, fileName } = req.body;
    try {
        // Check if fileName is already used by a DIFFERENT room
        if (fileName) {
            const existingFile = await CodeData.findOne({ fileName, roomId: { $ne: roomId } });
            if (existingFile) {
                return res.status(400).json({ error: "File name already exists. Please choose a unique name." });
            }
        }

        const updateData = { code, language };
        if (userId) updateData.userId = userId;
        if (fileName) updateData.fileName = fileName;

        const savedData = await CodeData.findOneAndUpdate(
            { roomId },
            updateData,
            { upsert: true, new: true }
        );
        res.json(savedData);
    } catch (error) {
        res.status(500).json({ error: "Failed to save code" });
    }
});

router.get('/:roomId', async (req, res) => {
    try {
        const data = await CodeData.findOne({ roomId: req.params.roomId });
        res.json(data || { code: "", language: "javascript" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch code" });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const code = await CodeData.findById(req.params.id);
        if (!code) return res.status(404).json({ error: "Code not found" });
        
        // Ensure only owner can delete
        if (code.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this code" });
        }

        await CodeData.findByIdAndDelete(req.params.id);
        res.json({ message: "Code deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete code" });
    }
});

module.exports = router;
