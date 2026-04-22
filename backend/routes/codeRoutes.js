const express = require('express');
const router = express.Router();
const axios = require('axios');

// Wandbox API Endpoint (Free Alternative to Piston)
const WANDBOX_API = 'https://wandbox.org/api/compile.json';

const getWandboxCompiler = (lang) => {
    switch (lang.toLowerCase()) {
        case 'c++':
        case 'c++ (gcc)':
        case 'cpp':
            return 'gcc-head';
        case 'python':
        case 'python 3':
            return 'cpython-3.12.7';
        case 'javascript':
        case 'js':
        case 'node.js':
            return 'nodejs-20.17.0';
        case 'java':
            return 'openjdk-jdk-22+36';
        case 'c':
        case 'c (gcc)':
            return 'gcc-head-c';
        case 'rust':
            return 'rust-1.82.0';
        default:
            return 'gcc-head';
    }
};

router.post('/execute', async (req, res) => {
    const { language, source, stdin } = req.body;

    try {
        const compiler = getWandboxCompiler(language || "");
        const response = await axios.post(WANDBOX_API, {
            compiler: compiler,
            code: source,
            stdin: stdin || ""
        });

        const data = response.data;
        
        // Map Wandbox format to Piston format to maintain frontend compatibility
        let stdout = data.program_output || "";
        let stderr = (data.compiler_error || "") + (data.program_error || "");
        let combinedOutput = "";
        
        if (data.compiler_error) combinedOutput += data.compiler_error + "\n";
        if (data.program_message) combinedOutput += data.program_message;

        res.json({
            language: language,
            version: "*",
            run: {
                stdout: stdout,
                stderr: stderr,
                code: parseInt(data.status) || 0,
                output: combinedOutput.trim() || stdout || stderr
            }
        });
    } catch (error) {
        console.error("Execution Error:", error.response ? error.response.data : error.message);
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
