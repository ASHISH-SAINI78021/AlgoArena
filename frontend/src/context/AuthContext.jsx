import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axios/axiosInstance'; // Use custom instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (has valid refresh token by trying to refresh)
        const checkUser = async () => {
            try {
                const { data } = await axios.post('/auth/refresh');

                // Save access token
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/auth/login', { email, password });

        // Set Access Token in Headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        setUser(data.user);
        return data;
    };

    const register = async (username, email, password) => {
        await axios.post('/auth/register', { username, email, password });
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
