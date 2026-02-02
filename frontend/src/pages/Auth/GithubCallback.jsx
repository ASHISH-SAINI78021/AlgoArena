import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../axios/axiosInstance';
import toast from 'react-hot-toast';

const GithubCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');

    useEffect(() => {
        const processCallback = async () => {
            if (!code) {
                toast.error("No code received from GitHub");
                if (window.opener) {
                    window.close();
                } else {
                    navigate('/');
                }
                return;
            }

            const state = searchParams.get('state');
            try {
                const res = await axios.post('/github/callback', { code, userId: state });

                // If successful
                if (res.data.accessToken) {
                    toast.success("GitHub Connected Successfully!");

                    // If opened in popup
                    if (window.opener) {
                        window.opener.postMessage({ type: 'GITHUB_CONNECTED', token: res.data.accessToken }, '*');
                        window.close();
                    } else {
                        // Redirect back
                        navigate('/realtime-coding');
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to connect GitHub: " + (error.response?.data?.error || error.message));
                if (window.opener) window.close();
                else navigate('/');
            }
        };

        processCallback();
    }, [code, navigate]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#1e1e1e',
            color: '#fff',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #333',
                borderTop: '4px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <h2>Connecting to GitHub...</h2>
            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default GithubCallback;
