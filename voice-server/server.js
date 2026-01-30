const { PeerServer } = require('peer');

const peerServer = PeerServer({
    port: 9000,
    path: '/myapp',
    proxied: true, // Set to true if running behind a reverse proxy (like Nginx) in prod
    key: 'peerjs'  // Key to secure the connection (optional)
});

console.log('🎙️ Voice Server running on port 9000');

peerServer.on('connection', (client) => {
    console.log('Peer connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
    console.log('Peer disconnected:', client.getId());
});
