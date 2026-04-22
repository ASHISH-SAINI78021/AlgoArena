import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const cardStyle = {
    background: 'rgba(14,14,26,0.85)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(139,92,246,0.2)',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    width: '360px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
};

const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(0,0,0,0.35)',
    color: '#f0f0ff',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.82rem',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '0.02em',
};

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            navigate(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
        } catch (err) {
            const serverError = err.response?.data?.error || err.response?.data?.message || 'Signup failed';
            setError(serverError);
        } finally {
            setLoading(false);
        }
    };

    const focusBorder = e => e.target.style.borderColor = 'rgba(139,92,246,0.5)';
    const blurBorder = e => e.target.style.borderColor = 'rgba(255,255,255,0.08)';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 60px)',
            padding: '2rem 1rem',
        }}>
            <form onSubmit={handleSubmit} style={cardStyle}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <h2 style={{
                        fontSize: '1.7rem',
                        fontWeight: '800',
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(90deg,#c4b5fd,#f9a8d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.3rem',
                    }}>Create account</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Join 10,000+ developers on GhostCode</p>
                </div>

                {error && (
                    <div style={{
                        color: '#f87171',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.9rem',
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                    }}>{error}</div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                        style={inputStyle} required placeholder="ghostcoder42"
                        onFocus={focusBorder} onBlur={blurBorder}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        style={inputStyle} required placeholder="you@example.com"
                        onFocus={focusBorder} onBlur={blurBorder}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        style={inputStyle} required placeholder="••••••••"
                        onFocus={focusBorder} onBlur={blurBorder}
                    />
                </div>
                <button type="submit" disabled={loading} style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#ec4899)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.97rem',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    boxShadow: '0 0 24px rgba(139,92,246,0.4)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                    onMouseEnter={e => { if (!loading) { e.target.style.boxShadow = '0 0 36px rgba(139,92,246,0.6)'; e.target.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { e.target.style.boxShadow = '0 0 24px rgba(139,92,246,0.4)'; e.target.style.transform = 'translateY(0)'; }}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#c4b5fd', fontWeight: '600', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
