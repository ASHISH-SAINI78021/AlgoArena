const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log(`[Auth Middleware] Checking ${req.url}. Auth Header present: ${!!authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`[Auth Middleware] DENIED: Missing or invalid header for ${req.url}`);
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token is not valid" });
    }
};
