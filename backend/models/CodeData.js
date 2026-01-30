const mongoose = require('mongoose');

const CodeDataSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    fileName: { type: String, unique: true, sparse: true },
    code: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CodeData', CodeDataSchema);
