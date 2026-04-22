const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    description: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    sampleTestCases: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String }
    }],
    testCases: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: true }
    }],
    boilerplates: {
        javascript: { type: String },
        python: { type: String },
        cpp: { type: String },
        java: { type: String }
    },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
