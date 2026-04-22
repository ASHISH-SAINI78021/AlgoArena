import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    default: {
        name: 'Ghost Dark',
        bg: '#070710',
        s1: '#0e0e1a',
        s2: '#13131f',
        sidebar: 'rgba(12, 12, 22, 0.7)',
        card: 'rgba(255, 255, 255, 0.025)',
        border: 'rgba(255, 255, 255, 0.06)',
        accent: '#8b5cf6',
        text: '#f0f0ff',
        subtext: '#94a3b8',
        blur: '24px',
        shadow: '0 40px 100px rgba(0,0,0,0.7)',
        monaco: 'vs-dark',
        primary: '#8b5cf6',
        secondary: '#ec4899'
    },
    cyberpunk: {
        name: 'Cyberpunk',
        bg: '#050505',
        sidebar: 'rgba(15, 15, 25, 0.8)',
        card: 'rgba(20, 20, 35, 0.6)',
        border: '#ff00ff',
        accent: '#00ffff',
        text: '#ffffff',
        subtext: '#a0a0a0',
        blur: '20px',
        shadow: '0 0 20px rgba(255, 0, 255, 0.4)',
        monaco: 'hc-black',
        primary: '#ff00ff',
        secondary: '#00ffff'
    },
    tokyo: {
        name: 'Tokyo Night',
        bg: '#1a1b26',
        sidebar: 'rgba(22, 22, 30, 0.8)',
        card: 'rgba(26, 27, 38, 0.7)',
        border: '#7aa2f7',
        accent: '#bb9af7',
        text: '#a9b1d6',
        subtext: '#565f89',
        blur: '12px',
        shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        monaco: 'vs-dark',
        primary: '#7aa2f7',
        secondary: '#bb9af7'
    },
    moonlight: {
        name: 'Moonlight',
        bg: '#191919',
        sidebar: 'rgba(25, 25, 25, 0.9)',
        card: 'rgba(35, 35, 35, 0.7)',
        border: '#444444',
        accent: '#5e81ac',
        text: '#eceff4',
        subtext: '#4c566a',
        blur: '10px',
        shadow: '0 10px 20px rgba(0,0,0,0.5)',
        monaco: 'vs-dark',
        primary: '#88c0d0',
        secondary: '#5e81ac'
    }
};

export const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState(localStorage.getItem('ghostcode-theme') || 'default');
    const currentTheme = themes[themeName] || themes.default;

    useEffect(() => {
        localStorage.setItem('ghostcode-theme', themeName);

        // Inject CSS variables
        const root = document.documentElement;
        root.style.setProperty('--theme-bg', currentTheme.bg);
        if (currentTheme.s1) root.style.setProperty('--theme-s1', currentTheme.s1);
        if (currentTheme.s2) root.style.setProperty('--theme-s2', currentTheme.s2);
        root.style.setProperty('--theme-sidebar', currentTheme.sidebar);
        root.style.setProperty('--theme-card', currentTheme.card);
        root.style.setProperty('--theme-border', currentTheme.border);
        root.style.setProperty('--theme-accent', currentTheme.accent);
        root.style.setProperty('--theme-text', currentTheme.text);
        root.style.setProperty('--theme-subtext', currentTheme.subtext);
        root.style.setProperty('--theme-blur', currentTheme.blur);
        root.style.setProperty('--theme-primary', currentTheme.primary);
    }, [themeName, currentTheme]);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, themeName, setThemeName }}>
            <div style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
                minHeight: '100vh',
                transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: "'Inter', sans-serif"
            }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
