import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios/axiosInstance';
import { Sparkles, Send, Bot, User, Lightbulb, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AIChat = ({ currentProblem, currentCode, language, onInsertCode }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your AI Mentor. I can help you with this problem. Ask me for a hint or to explain your code!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e, type = 'general') => {
        if (e) e.preventDefault();
        if (!input.trim() && type === 'general') return;

        const userMessage = type === 'hint' ? "Give me a hint" : input;
        if (type === 'general') {
            setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
            setInput('');
        }

        setIsLoading(true);
        try {
            const res = await axios.post('/ai/generate', {
                prompt: userMessage,
                currentCode,
                language,
                problemContext: currentProblem,
                type
            });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.generatedCode }]);
        } catch (error) {
            toast.error("AI Error: " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you now?" }]);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: theme.bg,
            borderLeft: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
        }}>
            <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.card, backdropFilter: `blur(${theme.blur})` }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: theme.text }}>
                    <Sparkles size={18} color="#8b5cf6" /> AI Mentor
                </h3>
                <button onClick={clearChat} style={{ background: 'transparent', border: 'none', color: theme.subtext, cursor: 'pointer' }}>
                    <Trash2 size={16} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%',
                        display: 'flex',
                        gap: '10px',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: msg.role === 'user' ? theme.primary : '#8b5cf6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 4px 10px ${msg.role === 'user' ? theme.primary : '#8b5cf6'}44`
                        }}>
                            {msg.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
                        </div>
                        <div style={{
                            background: msg.role === 'user' ? theme.card : theme.sidebar,
                            padding: '12px 16px',
                            borderRadius: '16px',
                            borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px',
                            color: theme.text,
                            fontSize: '13px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            border: `1px solid ${theme.border}`,
                            boxShadow: theme.shadow
                        }}>
                            {msg.content}
                            {msg.role === 'assistant' && msg.content.includes('```') && (
                                <button
                                    onClick={() => onInsertCode(msg.content)}
                                    style={{
                                        marginTop: '10px',
                                        display: 'block',
                                        background: '#8b5cf6',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Insert code into editor
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyItems: 'center', opacity: 0.5 }}>
                            <Bot size={16} color="#fff" style={{ margin: 'auto' }} />
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '13px', fontStyle: 'italic', marginTop: '5px' }}>Thinking...</div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '15px', borderTop: `1px solid ${theme.border}`, background: theme.sidebar, backdropFilter: `blur(${theme.blur})` }}>
                {!user ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '10px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '10px',
                        border: '1px dashed rgba(139, 92, 246, 0.3)'
                    }}>
                        <p style={{ color: theme.text, fontSize: '12px', margin: '0 0 10px 0' }}>
                            Login to chat with AI Mentor
                        </p>
                        <button
                            onClick={() => {
                                const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
                                navigate(`/login?redirect=${redirectPath}`);
                            }}
                            style={{
                                background: '#8b5cf6',
                                border: 'none',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={(e) => handleSendMessage(e, 'hint')}
                            disabled={isLoading || !currentProblem}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                background: theme.card,
                                border: `1px solid ${theme.border}`,
                                color: theme.text,
                                padding: '10px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Lightbulb size={14} color="#facc15" /> Analyze direction & Get hint
                        </button>
                        <form onSubmit={(e) => handleSendMessage(e, 'general')} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask AI Mentor..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.2)',
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                style={{
                                    background: '#8b5cf6',
                                    border: 'none',
                                    color: '#fff',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: (isLoading || !input.trim()) ? 0.5 : 1
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIChat;
