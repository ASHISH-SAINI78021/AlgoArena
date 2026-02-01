import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Mic, MicOff, Phone, PhoneOff, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceChat = ({ roomId, username, socket }) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [peers, setPeers] = useState({}); // { peerId: { stream, username } }
    const [localStream, setLocalStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null); // { username, peerId }

    const ringtoneRef = useRef(null);
    const peerRef = useRef(null);
    const streamsRef = useRef({}); // internal ref to avoid closure issues with state
    const localStreamRef = useRef(null);

    // Sync ref with state
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // --- Helper Functions (Defined before useEffects) ---

    const stopRingtone = () => {
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
    };

    const cleanup = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        streamsRef.current = {};
        setPeers({});
        setLocalStream(null);
        stopRingtone();
    };

    const handleStream = (call) => {
        call.on('stream', (remoteStream) => {
            const peerId = call.peer;
            const remoteUsername = peerId.split('-')[1] || 'Guest';

            if (!streamsRef.current[peerId]) {
                streamsRef.current[peerId] = { stream: remoteStream, username: remoteUsername };
                setPeers({ ...streamsRef.current });
                toast.success(`${remoteUsername} joined voice`, { icon: '🎙️' });
            }
        });

        call.on('close', () => {
            const peerId = call.peer;
            delete streamsRef.current[peerId];
            setPeers({ ...streamsRef.current });
        });

        call.on('error', (err) => {
            console.error("Call error:", err);
            const peerId = call.peer;
            delete streamsRef.current[peerId];
            setPeers({ ...streamsRef.current });
        });
    };

    const toggleVoice = async () => {
        if (isJoined) {
            cleanup();
            setIsJoined(false);
            toast.error("Left voice channel", { icon: '🔇' });
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setLocalStream(stream);
                setIsJoined(true);
                toast.success("Joined voice channel", { icon: '🎙️' });
            } catch (err) {
                toast.error("Microphone access denied!");
                console.error(err);
            }
        }
    };

    const handleAccept = () => {
        stopRingtone();
        setIncomingCall(null);
        toggleVoice();
    };

    const handleDecline = () => {
        stopRingtone();
        setIncomingCall(null);
        toast("Call declined", { icon: '✖️' });
    };

    const toggleMute = () => {
        if (localStream) {
            const enabled = localStream.getAudioTracks()[0].enabled;
            localStream.getAudioTracks()[0].enabled = !enabled;
            setIsMuted(enabled); // inverted because we just flipped it
            toast(enabled ? "Microphone Muted" : "Microphone Unmuted", {
                icon: enabled ? '🔇' : '🎙️'
            });
        }
    };

    // --- Effects ---

    // Initialize Peer
    useEffect(() => {
        if (!isJoined) return;

        // Create Peer with unique ID that includes username for easy identification
        const peerId = `${roomId}-${username}-${Math.random().toString(36).substr(2, 5)}`;
        const peer = new Peer(peerId, {
            host: import.meta.env.VITE_VOICE_SERVER_HOST,
            port: import.meta.env.VITE_VOICE_SERVER_PORT,
            path: import.meta.env.VITE_VOICE_SERVER_PATH,
            secure: Number(import.meta.env.VITE_VOICE_SERVER_PORT) === 443,
            debug: 3, // Enable full debug logs for troubleshooting
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    // Support TURN servers from environment (with support for comma-separated URLs)
                    ...(import.meta.env.VITE_TURN_SERVER_URL ? [{
                        urls: import.meta.env.VITE_TURN_SERVER_URL.split(','),
                        username: import.meta.env.VITE_TURN_SERVER_USERNAME,
                        credential: import.meta.env.VITE_TURN_SERVER_PASSWORD
                    }] : [])
                ]
            }
        });

        peerRef.current = peer;

        peer.on('open', (id) => {
            console.log('✅ Voice Peer ID initialized:', id);
            // Notify others via socket that we are ready for voice
            socket.emit('voice-ready', { roomId, peerId: id, username });
        });

        peer.on('error', (err) => {
            console.error('❌ PeerJS Error Type:', err.type);
            console.error('❌ PeerJS Error Message:', err.message);
            if (err.type === 'browser-incompatible') {
                toast.error("Browser not supported for voice");
            } else if (err.type === 'network') {
                toast.error("Voice server connection failed");
            } else if (err.type === 'unavailable-id') {
                console.warn("Peer ID already in use, retrying...");
            } else {
                toast.error(`Voice error: ${err.type}`);
            }
        });

        peer.on('disconnected', () => {
            console.warn('⚠️ PeerJS disconnected from server');
        });

        // Handle incoming calls
        peer.on('call', (call) => {
            console.log('📞 Incoming call from:', call.peer);
            const currentStream = localStreamRef.current;
            if (currentStream) {
                console.log('✅ Answering call with existing stream');
                call.answer(currentStream);
                handleStream(call);
            } else {
                console.log('🎤 Requesting mic access to answer call...');
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        console.log('✅ Mic access granted, answering call');
                        setLocalStream(stream);
                        call.answer(stream);
                        handleStream(call);
                    }).catch(err => {
                        console.error("❌ Failed to answer call:", err);
                        toast.error("Incoming call failed: No mic access");
                    });
            }
        });

        return () => {
            cleanup();
        };
    }, [isJoined, roomId, username, socket]);

    // Handle Global Voice Notifications & Ringing
    useEffect(() => {
        if (!socket) return;

        const onVoiceReady = ({ peerId: remotePeerId, username: remoteUsername }) => {
            // 1. If we are already in voice, the PeerJS 'call' event or the Join logic handles the actual connection.
            if (remoteUsername !== username) {
                // If not in voice, start ringing
                if (!isJoined && !incomingCall) {
                    setIncomingCall({ username: remoteUsername, peerId: remotePeerId });

                    // Start Ringtone
                    if (!ringtoneRef.current) {
                        ringtoneRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                        ringtoneRef.current.loop = true;
                    }
                    ringtoneRef.current.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
                }
            }

            // 2. If we ARE in voice, we need to initiate the peer call to this new person
            if (isJoined && peerRef.current) {
                console.log('📡 Initiating call to:', remotePeerId);
                const currentStream = localStreamRef.current;
                if (currentStream) {
                    console.log('✅ Calling with existing stream');
                    const call = peerRef.current.call(remotePeerId, currentStream);
                    handleStream(call);
                } else {
                    console.log('🎤 Requesting mic access to initiate call...');
                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then((stream) => {
                            console.log('✅ Mic access granted, calling...');
                            setLocalStream(stream);
                            if (peerRef.current) {
                                const call = peerRef.current.call(remotePeerId, stream);
                                handleStream(call);
                            }
                        });
                }
            }
        };

        socket.on('voice-ready', onVoiceReady);

        return () => {
            socket.off('voice-ready', onVoiceReady);
            stopRingtone();
        };
    }, [socket, isJoined, username, incomingCall]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'flex-end'
        }}>
            {/* Peer Audio Elements (Hidden) */}
            {Object.entries(peers).map(([id, peerData]) => (
                <AudioElement key={id} stream={peerData.stream} />
            ))}

            {/* Voice Control Panel */}
            <div style={{
                background: '#1e293b',
                padding: '10px 15px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isJoined ? '#38bdf8' : '#64748b' }}>
                    <Users size={16} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{Object.keys(peers).length + (isJoined ? 1 : 0)} in Voice</span>
                </div>

                <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                {isJoined && (
                    <button
                        onClick={toggleMute}
                        style={{
                            background: isMuted ? '#ef4444' : '#334155',
                            border: 'none',
                            color: '#fff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                )}

                <button
                    onClick={toggleVoice}
                    style={{
                        background: isJoined ? '#ef4444' : '#10b981',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isJoined ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}
                >
                    {isJoined ? <PhoneOff size={18} /> : <Phone size={18} />}
                    {isJoined ? 'Leave Voice' : 'Join Voice'}
                </button>
            </div>

            {/* Incoming Call Modal */}
            {incomingCall && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#1e293b',
                    padding: '25px',
                    borderRadius: '20px',
                    border: '1px solid #10b981',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    textAlign: 'center',
                    minWidth: '300px',
                    animation: 'pulseGlow 2s infinite'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: '#10b981',
                            borderRadius: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px'
                        }}>
                            <Phone size={32} color="#fff" />
                        </div>
                        <h3 style={{ margin: 0, color: '#fff' }}>Incoming Arena Call</h3>
                        <p style={{ color: '#94a3b8', margin: '5px 0' }}>{incomingCall.username} is calling...</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button
                            onClick={handleDecline}
                            style={{
                                background: '#ef4444',
                                border: 'none',
                                color: '#fff',
                                padding: '10px 25px',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <PhoneOff size={20} /> Decline
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                background: '#10b981',
                                border: 'none',
                                color: '#fff',
                                padding: '10px 25px',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Phone size={20} /> Accept
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes pulseGlow {
                        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                        70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                    }
                `}
            </style>
        </div>
    );
};

// Helper component for cleaning up audio resources
const AudioElement = ({ stream }) => {
    const audioRef = useRef();

    useEffect(() => {
        if (audioRef.current && stream) {
            console.log('🎵 Attaching stream to audio element');
            audioRef.current.srcObject = stream;

            // Explicitly try to play (required by some browsers)
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("⚠️ Audio play blocked by browser. User interaction might be needed:", error);
                });
            }
        }
    }, [stream]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline // Required for mobile browsers
            style={{ display: 'none' }}
        />
    );
};

export default VoiceChat;
