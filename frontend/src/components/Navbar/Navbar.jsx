import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ghost, ArrowRight, Code, Zap, ChevronRight, Swords } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(false);
    const navRef = useRef(null);

    // Slide-in on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    // Blur/darken on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Don't render on Home — Home has its own nav
    if (location.pathname === '/') return null;

    const isArena = location.pathname.startsWith('/realtime-coding');

    return (
        <nav
            ref={navRef}
            className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${visible ? styles.visible : ''}`}
        >
            {/* Logo */}
            <button className={styles.logo} onClick={() => navigate('/')}>
                <span className={styles.logoMark}>
                    <Ghost size={15} color="#fff" />
                </span>
                <span className={styles.logoWord}>GhostCode</span>
            </button>

            {/* Centre crumb — shows current page */}
            {!isArena && (
                <div className={styles.breadcrumb}>
                    <span className={styles.breadHome} onClick={() => navigate('/')}>Home</span>
                    <ChevronRight size={12} className={styles.breadSep} />
                    <span className={styles.breadCurrent}>
                        {location.pathname === '/login' && 'Sign In'}
                        {location.pathname === '/signup' && 'Create Account'}
                        {location.pathname === '/saved-codes' && 'Saved Codes'}
                        {location.pathname.startsWith('/auth') && 'GitHub Auth'}
                    </span>
                </div>
            )}

            {isArena && (
                <div className={styles.arenaTag}>
                    <Zap size={12} />
                    <span>Live Arena</span>
                    <span className={styles.arenaDot} />
                </div>
            )}

            {/* Right actions */}
            <div className={styles.right}>
                <div id="voice-chat-portal" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}></div>

                {!isArena && (
                    <>
                        <button className={styles.pill} onClick={() => navigate('/realtime-coding')}>
                            Open Arena <ArrowRight size={12} />
                        </button>
                        <button className={styles.duelBtn} onClick={() => navigate('/duel')} title="1v1 Duel Arena">
                            <Swords size={14} /> Duel
                        </button>
                    </>
                )}

                {user ? (
                    <>
                        <span className={styles.greet}>Hi, {user.username}</span>
                        <button className={styles.ghost} onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className={styles.ghost} onClick={() => navigate('/login')}>Login</button>
                        <button className={styles.pill} onClick={() => navigate('/signup')}>
                            Start Free <ArrowRight size={12} />
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
