const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const { ExpressPeerServer } = require('peer');

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- Proxy & Security Settings ---
app.set('trust proxy', 1); // Trust Render's proxy for secure cookies

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174', // Sometimes vite uses 5174
  'http://127.0.0.1:5174',
  'https://algo-arena-abq7.vercel.app',
  'https://algo-arena-88dw.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Use specific origin for CORS to avoid issues with Socket.io credentials if needed later
const wss = new WebSocket.Server({ noServer: true });

// --- Master WebSocket Gatekeeper (Monkey-Patching server.emit) ---
const originalEmit = server.emit;
server.emit = function (event, ...args) {
  if (event === 'upgrade') {
    const [request, socket, head] = args;
    const { pathname } = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    
    if (pathname.startsWith('/yjs')) {
      console.log(`[Gatekeeper] Intercepting Yjs: ${pathname}`);
      wss.handleUpgrade(request, socket, head, (ws) => {
        const roomName = pathname.replace(/^\/yjs\/?/, '') || 'default';
        console.log(`[Gatekeeper] Handshake Complete -> Room: ${roomName}`);
        setupWSConnection(ws, request, { docName: roomName });
      });
      return true; // Stop other listeners from running!
    }
  }
  return originalEmit.apply(this, [event, ...args]);
};

const io = new Server(server, {
    cors: {
        origin: allowedOrigins, 
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    proxied: true, // Match standalone config for reverse proxies
    key: 'peerjs'
});

peerServer.on('connection', (client) => {
    console.log('🎙️ Voice Peer connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
    console.log('🎙️ Voice Peer disconnected:', client.getId());
});

// Attach Voice Middleware
app.use('/voice-peer', peerServer);

app.use(express.json());
app.use(cookieParser());

// --- Global Request Logger ---
// --- Global Request Logger ---
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n🔥 [INCOMING] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Cookies:', req.cookies);
  
  if (req.method === 'POST') {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    console.log('Body:', logBody);
  }

  // Log response status
  const oldJson = res.json;
  res.json = function(data) {
    console.log(`🟢 [RESPONSE] ${req.method} ${req.url} -> ${res.statusCode} (took ${Date.now() - start}ms)`);
    if (res.statusCode === 401) {
        console.log('❌ 401 Error Detail:', data);
    }
    return oldJson.apply(res, arguments);
  };

  const oldSend = res.send;
  res.send = function(data) {
      if (!req.url.startsWith('/socket.io')) {
        console.log(`🟢 [RESPONSE] ${req.method} ${req.url} -> ${res.statusCode} (took ${Date.now() - start}ms)`);
      }
      return oldSend.apply(res, arguments);
  };

  next();
});

// --- MongoDB Connection Logic ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ghostcode';

// Masked URI for logging
const maskedURI = mongoURI.replace(/\/\/.*@/, '//****:****@');
console.log(`🔌 [DB] Attempting to connect to: ${maskedURI}`);

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected to GhostCode'))
    .catch(err => {
        console.error('💥 [DB] Initial Connection Failed:', err.message);
        console.warn('⚠️  Server will run but database operations will fail!');
    });

// API Root
app.get('/', (req, res) => {
    res.send('Welcome to GhostCode API');
});

// Shared Duel Rooms state (module-scoped, shared across all socket connections)
const duelRooms = {};

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

        // ── Handle Duel Disconnection ──
        Object.keys(duelRooms).forEach(roomId => {
            const room = duelRooms[roomId];
            const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
            
            if (playerIndex !== -1) {
                const leaver = room.players[playerIndex];
                leaver.connected = false;
                console.log(`⚔️ [Duel] ${leaver.username} disconnected from room ${roomId}. Marking as offline.`);

                // Notify others in the room
                io.to(`duel-${roomId}`).emit('duel-opponent-left', { username: leaver.username });
                
                // Do not clear the startTime or problem! This allows the duel to resume.
                
                // If the room is completely abandoned, clean it up
                if (room.players.every(p => p.connected === false)) {
                    // Start a suicide timer to clear memory, but leave it alone for now to support single-user refresh
                }
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // ── DUEL ARENA LOGIC ──
    // duelRooms is scoped outside so all connections share the same map

    socket.on('duel-join', async ({ roomId, username }) => {
        socket.join(`duel-${roomId}`);
        console.log(`⚔️ [Duel] ${username} joined duel room: ${roomId}`);

        if (!duelRooms[roomId]) {
            duelRooms[roomId] = { players: [], hp: {} };
        }
        const room = duelRooms[roomId];

        // Auto-rename for local testing across two tabs with the same account
        let finalUsername = username;
        const existingPlayer = room.players.find(p => p.username === finalUsername);
        
        if (existingPlayer) {
            // If the battle hasn't started and a fresh socket tries to join with the same name
            if (!room.startTime && existingPlayer.socketId !== socket.id) {
                finalUsername = `${username} (2)`;
                room.players.push({ socketId: socket.id, username: finalUsername, connected: true });
                room.hp[finalUsername] = 100;
                socket.emit('duel-auto-rename', { newUsername: finalUsername });
            } else {
                // Legitimate rejoin from the same user
                existingPlayer.socketId = socket.id;
                existingPlayer.connected = true;
            }
        } else {
            room.players.push({ socketId: socket.id, username: finalUsername, connected: true });
            room.hp[finalUsername] = 100;
        }

        // Notify the other player that someone joined
        socket.to(`duel-${roomId}`).emit('duel-opponent-joined', { username: finalUsername });

        // If the duel is already in progress, handle REJOIN
        if (room.problem && room.startTime) {
            const timeElapsed = Math.floor((Date.now() - room.startTime) / 1000);
            const timeLeft = Math.max(0, (10 * 60) - timeElapsed);

            // Re-sync EVERY connected player so the waiting opponent gets pulled back into battle
            room.players.forEach(p => {
                if (p.connected !== false) {
                    const myUsername = p.username;
                    const opp = room.players.find(other => other.username !== myUsername);
                    const myHp = room.hp[myUsername] ?? 100;
                    const opponentHp = opp ? (room.hp[opp.username] ?? 100) : 100;

                    io.to(p.socketId).emit('duel-rejoin', {
                        problem: room.problem,
                        timeLeft,
                        myHp,
                        opponentName: opp?.username || 'Opponent',
                        opponentHp
                    });
                }
            });
            return;
        }

        // If we have 2 players and not started yet, start the duel
        const connectedPlayers = room.players.filter(p => p.connected !== false);
        if (connectedPlayers.length >= 2 && !room.problem) {
            console.log(`⚔️ [Duel] Room ${roomId} is full. Fetching problem and starting duel!`);
            try {
                const Problem = require('./models/Problem');
                const count = await Problem.countDocuments();
                const skip = Math.floor(Math.random() * count);
                const problem = await Problem.findOne().skip(skip).lean();
                room.problem = problem;
                room.startTime = Date.now();
                io.to(`duel-${roomId}`).emit('duel-start', { problem });
                console.log(`⚔️ [Duel] Duel started in room ${roomId} with problem: ${problem?.title}`);
            } catch (err) {
                console.error('⚔️ [Duel] Error fetching problem:', err);
            }
        }
    });

    socket.on('duel-warning', ({ roomId, type, username }) => {
        // Relay anti-cheat warnings to the opponent
        socket.to(`duel-${roomId}`).emit('duel-warning', { type, username });
    });

    socket.on('duel-code-run', ({ roomId, username, hasError, stdout, expectedOutput }) => {
        const room = duelRooms[roomId];
        if (!room) return;

        // Normalize each line: trim whitespace, remove blank lines, handle CRLF
        const normalize = s => (s || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).join('\n');
        const isCorrect = !hasError && expectedOutput && stdout && normalize(stdout) === normalize(expectedOutput);

        console.log(`⚔️ [Duel] ${username} ran code — hasError:${hasError} isCorrect:${isCorrect}`);

        if (hasError) {
            // Penalize self for compile/runtime error
            room.hp[username] = Math.max(0, (room.hp[username] || 0) - 10);
            socket.emit('duel-you-take-damage', { damage: 10, myHp: room.hp[username], reason: 'compile error' });
            // Broadcast attacker's new HP to opponent so their HP bar updates
            const opp = room.players.find(p => p.username !== username);
            if (opp) {
                io.to(opp.socketId).emit('duel-opponent-damage', { damage: 10, opponentHp: room.hp[username], reason: 'compile error' });
            }
        } else if (isCorrect) {
            // Correct answer — damage the opponent
            const opponent = room.players.find(p => p.username !== username);
            if (opponent) {
                room.hp[opponent.username] = Math.max(0, (room.hp[opponent.username] || 0) - 25);
                // Tell attacker their attack landed
                socket.emit('duel-opponent-damage', { damage: 25, opponentHp: room.hp[opponent.username], reason: 'correct answer' });
                // Tell defender they took a hit
                io.to(opponent.socketId).emit('duel-you-take-damage', { damage: 25, myHp: room.hp[opponent.username], reason: 'opponent got correct answer' });
            }
        } else {
            // Wrong answer — light self damage
            room.hp[username] = Math.max(0, (room.hp[username] || 0) - 5);
            socket.emit('duel-you-take-damage', { damage: 5, myHp: room.hp[username], reason: 'wrong answer' });
            // Broadcast attacker's new HP to opponent so their HP bar updates
            const opp2 = room.players.find(p => p.username !== username);
            if (opp2) {
                io.to(opp2.socketId).emit('duel-opponent-damage', { damage: 5, opponentHp: room.hp[username], reason: 'wrong answer' });
            }
        }

        // Check win conditions
        const hpValues = Object.values(room.hp);
        if (hpValues.some(hp => hp <= 0)) {
            const loser = Object.entries(room.hp).find(([, hp]) => hp <= 0)?.[0];
            const winner = room.players.find(p => p.username !== loser);
            if (winner) {
                io.to(winner.socketId).emit('duel-ended', { result: 'win', winner: winner.username });
            }
            socket.emit('duel-ended', { result: loser === username ? 'lose' : 'win', winner: winner?.username });
            // Do not delete the room immediately to allow rematch requests
            // delete duelRooms[roomId]; 
        }
    });

    socket.on('duel-rematch-request', ({ roomId, username }) => {
        const room = duelRooms[roomId];
        if (!room) return;
        
        room.rematchRequestedBy = username;
        socket.to(`duel-${roomId}`).emit('duel-rematch-offered', { username });
        console.log(`⚔️ [Duel] ${username} requested a rematch in room ${roomId}`);
    });

    socket.on('duel-rematch-accept', async ({ roomId, username }) => {
        const room = duelRooms[roomId];
        if (!room) return;

        console.log(`⚔️ [Duel] Rematch accepted in room ${roomId}. Refreshing problem...`);
        
        try {
            const count = await Problem.countDocuments();
            const skip = Math.floor(Math.random() * count);
            const problem = await Problem.findOne().skip(skip).lean();
            
            // Reset room state
            room.problem = problem;
            room.startTime = Date.now();
            room.rematchRequestedBy = null;
            
            // Reset HPs
            room.players.forEach(p => {
                room.hp[p.username] = 100;
            });

            io.to(`duel-${roomId}`).emit('duel-start', { problem });
            console.log(`⚔️ [Duel] Rematch started with problem: ${problem?.title}`);
        } catch (err) {
            console.error('⚔️ [Duel] Error starting rematch:', err);
        }
    });

    socket.on('duel-rematch-decline', ({ roomId, username }) => {
        const room = duelRooms[roomId];
        if (!room) return;
        
        room.rematchRequestedBy = null;
        socket.to(`duel-${roomId}`).emit('duel-rematch-rejected', { username });
        console.log(`⚔️ [Duel] Rematch declined by ${username} in room ${roomId}`);
    });

    socket.on('duel-time-up', ({ roomId, username }) => {
        const room = duelRooms[roomId];
        if (!room) return;
        const entries = Object.entries(room.hp);
        if (!entries.length) return;
        const sortedByHp = entries.sort((a, b) => b[1] - a[1]);
        const topHp = sortedByHp[0][1];
        const secondHp = sortedByHp[1]?.[1];
        if (topHp === secondHp) {
            io.to(`duel-${roomId}`).emit('duel-draw');
        } else {
            const winner = sortedByHp[0][0];
            room.players.forEach(p => {
                io.to(p.socketId).emit('duel-ended', { result: p.username === winner ? 'win' : 'lose', winner });
            });
        }
        // delete duelRooms[roomId];
    });
});

// Import Routes
const codeRoutes = require('./routes/codeRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const githubRoutes = require('./routes/githubRoutes');
const problemRoutes = require('./routes/problemRoutes');

app.use('/api/code', codeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/problems', problemRoutes);

const PORT = process.env.PORT || 5001;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
    console.log(`📡 WebSocket/Yjs listening on ws://127.0.0.1:${PORT}/yjs`);
});