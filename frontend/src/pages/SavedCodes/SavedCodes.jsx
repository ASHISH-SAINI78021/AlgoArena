import React, { useEffect, useState } from 'react';
import axios from '../../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileCode, Calendar, ArrowRight, Trash2 } from 'lucide-react';

const SavedCodes = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const { data } = await axios.get('/code/user-codes');
                setCodes(data);
            } catch (error) {
                console.error("Failed to fetch codes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCodes();
    }, []);

    const openInArena = (roomId) => {
        navigate(`/realtime-coding?roomId=${roomId}&username=${user.username}`);
    };

    const handleDeleteCode = async (id, e) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm("Are you sure you want to delete this saved code?")) return;

        try {
            await axios.delete(`/code/${id}`);
            setCodes(codes.filter(c => c._id !== id));
        } catch (error) {
            console.error("Failed to delete code", error);
            alert("Failed to delete code");
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff'
            }}>
                <div className="spinner">Loading your arena history...</div>
            </div>
        );
    }

    return (
        <div className="saved-codes-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        My Code Repository
                    </h1>
                    <p style={{ color: '#94a3b8' }}>All your collaborative sessions and code snippets in one place.</p>
                </header>

                {codes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <FileCode size={64} color="#475569" style={{ marginBottom: '20px' }} />
                        <h3>No saved codes yet</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Start a session in the Arena to see your code here.</p>
                        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}>
                            Go to Home
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {codes.map((code) => (
                            <div key={code._id} style={{
                                background: 'rgba(30, 41, 59, 0.7)',
                                borderRadius: '16px',
                                padding: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        background: code.language === 'javascript' ? '#fde047' :
                                            code.language === 'python' ? '#38bdf8' :
                                                code.language === 'cpp' ? '#818cf8' : '#fb923c',
                                        color: '#0f172a',
                                        textTransform: 'uppercase'
                                    }}>
                                        {code.language}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} />
                                            {new Date(code.updatedAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={(e) => handleDeleteCode(code._id, e)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                color: '#ef4444',
                                                padding: '6px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#ef4444';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                e.currentTarget.style.color = '#ef4444';
                                            }}
                                            title="Delete session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {code.fileName || `Room: ${code.roomId}`}
                                </h3>
                                {code.fileName && <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>ID: {code.roomId}</p>}
                                <p style={{
                                    color: '#64748b',
                                    marginBottom: '24px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5, // Show a bit more lines
                                    WebkitBoxOrient: 'vertical',
                                    fontFamily: 'monospace',
                                    background: '#0f172a',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    whiteSpace: 'pre-wrap', // Essential for code formatting
                                    fontSize: '12px',
                                    lineHeight: '1.5',
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}>
                                    {code.code || '// Empty code'}
                                </p>
                                <button
                                    onClick={() => openInArena(code.roomId)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(to right, #6366f1, #3b82f6)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    Continue Coding <ArrowRight size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default SavedCodes;
