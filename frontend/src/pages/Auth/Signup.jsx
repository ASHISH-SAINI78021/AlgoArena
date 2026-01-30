import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            console.error("Signup Error Detailed:", err);
            setError(err.response?.data?.error || 'Signup failed - Check Console for details');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#1a1a1a',
            color: 'white'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#2d2d2d',
                padding: '40px',
                borderRadius: '10px',
                width: '350px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#28a745' }}>Sign Up</h2>
                {error && <div style={{ color: '#ff5252', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: 'white' }}
                        required
                    />
                </div>

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
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    Create Account
                </button>
                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: '#69f0ae' }}>Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
