const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const server = http.createServer(app);
// Use specific origin for CORS to avoid issues with Socket.io credentials if needed later
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost and IP
    credentials: true // Important for cookies
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB (non-blocking)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algoarena')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.warn('⚠️  MongoDB Connection Failed:', err.message);
        console.warn('⚠️  Server will run but database operations will fail!');
        console.warn('⚠️  Please install MongoDB or fix your connection.');
    });

// Socket.io Logic
io.on('connection', (socket) => {
    // ... existing socket logic ...
    console.log('User connected:', socket.id);

    // Join a room (Lobby)
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    // Code Change Event
    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit('code-update', code);
    });

    // Language Change Event
    socket.on('language-change', ({ roomId, language }) => {
        socket.to(roomId).emit('language-update', language);
    });
    
    // Cursor Position Event (basic)
    socket.on('cursor-change', ({ roomId, position }) => {
        socket.to(roomId).emit('cursor-update', { userId: socket.id, position });
    });

    // Voice Ready Event (PeerJS)
    socket.on('voice-ready', ({ roomId, peerId, username }) => {
        socket.to(roomId).emit('voice-ready', { peerId, username });
    });

    // Chat Message Event
    socket.on('send-chat-message', ({ roomId, message, username, color }) => {
        const chatData = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            message,
            username,
            color,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        // Emit to everyone in the room INCLUDING the sender
        io.to(roomId).emit('receive-chat-message', chatData);
    });

    socket.on('disconnecting', () => {
        console.log('User disconnecting:', socket.id);
        // Find rooms the user was in and notify
        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                socket.to(room).emit('user-left', { id: socket.id });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Import Routes
const codeRoutes = require('./routes/codeRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/code', codeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});