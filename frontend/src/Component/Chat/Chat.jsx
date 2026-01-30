import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = ({ socket, yDoc, roomId, username, color, isOpen, setIsOpen, unreadCount, setUnreadCount }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle Socket events (Presence)
    useEffect(() => {
        if (!socket) return;

        const handleUserJoined = (sid) => {
            toast.success("A friend joined the arena!", {
                icon: '👥',
                style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #38bdf8'
                },
            });
        };

        const handleUserLeft = (data) => {
            toast.error("Someone left the arena", {
                icon: '🚪',
                style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #ef4444'
                },
            });
        };

        socket.on('user-joined', handleUserJoined);
        socket.on('user-left', handleUserLeft);

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('user-left', handleUserLeft);
        };
    }, [socket]);

    // Handle Yjs Chat Updates
    useEffect(() => {
        if (!yDoc) return;

        const yMessages = yDoc.getArray('chat');

        // Initial sync
        setMessages(yMessages.toArray());

        const handleChatUpdate = (event) => {
            // Update local state
            setMessages(yMessages.toArray());

            // Handle notifications for remote messages
            // In y-websocket, event.transaction.local is false for remote updates
            if (!event.transaction.local && !isOpen) {
                const addedCount = event.changes.added.size;
                if (addedCount > 0) {
                    const lastMsg = yMessages.get(yMessages.length - 1);
                    if (lastMsg && lastMsg.username !== username) {
                        setUnreadCount((prev) => prev + addedCount);
                        toast(`New message from ${lastMsg.username}`, {
                            icon: '💬',
                            duration: 3000,
                            style: {
                                borderRadius: '10px',
                                background: '#1e293b',
                                color: '#fff',
                                border: '1px solid #38bdf8'
                            },
                        });
                    }
                }
            }
        };

        yMessages.observe(handleChatUpdate);

        return () => {
            yMessages.unobserve(handleChatUpdate);
        };
    }, [yDoc, isOpen, setUnreadCount, username]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() && yDoc) {
            const yMessages = yDoc.getArray('chat');
            const chatData = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                message: message.trim(),
                username,
                color,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            yMessages.push([chatData]);
            setMessage('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {/* Chat window */}
            {isOpen && (
                <div style={{
                    width: '320px',
                    height: '450px',
                    background: '#1e293b',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '15px',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '15px',
                        background: '#0f172a',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} color="#38bdf8" /> Arena Chat
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px', fontSize: '0.875rem' }}>
                                No messages yet. Say hi!
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%'
                                }}>
                                    <div style={{
                                        fontSize: '10px',
                                        color: '#94a3b8',
                                        marginBottom: '2px',
                                        textAlign: msg.username === username ? 'right' : 'left'
                                    }}>
                                        {msg.username} • {msg.timestamp}
                                    </div>
                                    <div style={{
                                        background: msg.username === username ? '#3b82f6' : '#334155',
                                        color: '#fff',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        borderTopRightRadius: msg.username === username ? '2px' : '12px',
                                        borderTopLeftRadius: msg.username === username ? '12px' : '2px',
                                        fontSize: '0.875rem',
                                        wordBreak: 'break-word',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{
                        padding: '15px',
                        background: '#0f172a',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                background: '#1e293b',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            style={{
                                background: '#38bdf8',
                                color: '#0f172a',
                                border: 'none',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: message.trim() ? 1 : 0.5
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setUnreadCount(0);
                }}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}

                {unreadCount > 0 && !isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: '10px',
                        minWidth: '20px',
                        height: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        border: '2px solid #0f172a'
                    }}>
                        {unreadCount}
                    </div>
                )}
            </button>

            <style>
                {`
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

export default Chat;
