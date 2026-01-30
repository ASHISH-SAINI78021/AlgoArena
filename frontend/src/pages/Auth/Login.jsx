import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/'); // Redirect to Home or Editor
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#1a1a1a', // Dark theme consistent with home
            color: 'white'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#2d2d2d',
                padding: '40px',
                borderRadius: '10px',
                width: '350px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007acc' }}>Login</h2>
                {error && <div style={{ color: '#ff5252', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white' }}
                        required
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    background: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    Sign In
                </button>
                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#69f0ae' }}>Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
