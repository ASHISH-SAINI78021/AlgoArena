import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Swords, Shield, Zap, Trophy, Clock, ChevronRight, Play, X, Link, Copy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProblemDescription from '../../Component/ProblemSidebar/ProblemDescription';
import CodeEditor from '../../Component/CodeEditor/CodeEditor';
import Chat from '../../Component/Chat/Chat';
import styles from './DuelArena.module.css';

/* ── Duel Content ── */

/* ── Health Bar ── */
const HealthBar = ({ hp, maxHp, name, color, right = false }) => {
    const pct = Math.max(0, (hp / maxHp) * 100);
    const barColor = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444';
    return (
        <div style={{ display: 'flex', flexDirection: right ? 'row-reverse' : 'row', alignItems: 'center', gap: '15px', padding: '12px 20px', background: 'rgba(15,15,25,0.9)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: `1px solid ${color}44`, boxShadow: `0 0 30px ${color}22`, width: '100%', maxWidth: '400px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: '#fff', flexShrink: 0, boxShadow: `0 0 15px ${color}88` }}>
                {name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{name || 'Waiting...'}</span>
                    <span style={{ fontWeight: 600, color: barColor, fontSize: '13px' }}>{hp}/{maxHp} HP</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`, borderRadius: '10px', transition: 'width 0.5s ease', boxShadow: `0 0 8px ${barColor}` }} />
                </div>
            </div>
        </div>
    );
};

/* ── Timer Badge ── */
const TimerBadge = ({ seconds }) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const urgent = seconds <= 30;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: urgent ? 'rgba(239,68,68,0.15)' : 'rgba(15,15,25,0.9)', borderRadius: '12px', border: `1px solid ${urgent ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, padding: '10px 20px', backdropFilter: 'blur(20px)', animation: urgent ? 'urgentPulse 1s infinite' : 'none' }}>
            <Clock size={18} color={urgent ? '#ef4444' : '#94a3b8'} />
            <span style={{ fontWeight: 800, fontSize: '20px', color: urgent ? '#ef4444' : '#fff', fontFamily: 'monospace', letterSpacing: '2px' }}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
        </div>
    );
};

const MAX_HP = 100;
const DUEL_DURATION = 10 * 60; // 10 minutes

export default function DuelArena() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Lobby state
    const [phase, setPhase] = useState('lobby'); // 'lobby' | 'waiting' | 'battle' | 'ended'
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState(user?.username || localStorage.getItem('duelUsername') || '');  // Guests can set any username

    // Battle state
    const [myHp, setMyHp] = useState(MAX_HP);
    const [opponentHp, setOpponentHp] = useState(MAX_HP);
    const [opponentName, setOpponentName] = useState('');
    const [problem, setProblem] = useState(null);
    const [myCode, setMyCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(DUEL_DURATION);
    const [result, setResult] = useState(null); // 'win' | 'lose' | 'draw'
    const [lastDamage, setLastDamage] = useState(null); // for visual flash
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState('');
    const [runResult, setRunResult] = useState(null); // 'correct' | 'wrong' | 'error' | null
    const [editorReady, setEditorReady] = useState(false);
    const [hpFlash, setHpFlash] = useState(null); // 'me' | 'opponent' | null

    // Rematch state
    const [rematchStatus, setRematchStatus] = useState('idle'); // 'idle' | 'sent' | 'received' | 'declined'
    const [rematchRequestedBy, setRematchRequestedBy] = useState(null);

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const socketRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (user?.username) setUsername(user.username);
    }, [user]);

    // Auto-fill roomId from URL param (for invite links)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('roomId');
        if (r) {
            setRoomId(r.toUpperCase());
            // We no longer auto-set phase('waiting') here because it bypasses the user gesture
            // required for the Fullscreen API. The user must click 'Join' to enter the arena.
        }
    }, [user]);

    // Socket setup when battle starts
    useEffect(() => {
        if (phase !== 'waiting') return; // ONLY TRIGGER ONCE when entering waiting state
        if (socketRef.current) return; // Prevent multiple connections

        const socket = io(import.meta.env.VITE_SOCKET_URL);
        socketRef.current = socket;

        socket.emit('duel-join', { roomId, username });

        socket.on('duel-auto-rename', ({ newUsername }) => {
            setUsername(newUsername);
            toast.success(`You were auto-renamed to ${newUsername} because you are testing against yourself!`, { icon: '🤖', duration: 4000 });
        });

        socket.on('duel-opponent-joined', ({ username: oppName }) => {
            setOpponentName(oppName);
            toast(`⚔️ ${oppName} has entered the arena!`, { style: { background: '#1e293b', color: '#fff' } });
        });

        socket.on('duel-opponent-left', ({ username: leftName }) => {
            toast.error(`⚔️ ${leftName} left the arena. Duel paused.`, { duration: 5000, id: 'opponent-left' });
            clearInterval(timerRef.current);
            setPhase('waiting');
            setProblem(null);
            setOpponentName('');
            setMyHp(MAX_HP);
            setOpponentHp(MAX_HP);
        });

        socket.on('duel-start', ({ problem: p }) => {
            toast.dismiss('waiting');
            setProblem(p);
            setMyCode(p.boilerplates?.cpp || '');
            setPhase('battle');
            setMyHp(MAX_HP);
            setOpponentHp(MAX_HP);
            setRunResult(null);
            setRematchStatus('idle');
            setRematchRequestedBy(null);
            setTimeLeft(DUEL_DURATION);
            startTimer();
            toast.success('⚔️ Duel Started! Fight!', { duration: 3000 });
        });

        socket.on('duel-rejoin', ({ problem: p, timeLeft: newTimeLeft, myHp: newMyHp, opponentName: oppName, opponentHp: oppHp }) => {
            toast.dismiss('waiting');
            setMyCode(p.boilerplates?.cpp || '');
            setProblem(p);
            setTimeLeft(newTimeLeft);
            setMyHp(newMyHp);
            setOpponentName(oppName);
            setOpponentHp(oppHp);
            setPhase('battle');
            startTimer();
            toast.success('⚔️ Rejoined Battle in progress!', { duration: 3000, icon: '🔄' });
        });

        socket.on('duel-opponent-damage', ({ damage, opponentHp: newHp, reason }) => {
            setOpponentHp(newHp);
            setLastDamage({ target: 'opponent', amount: damage });
            setHpFlash('opponent');
            setTimeout(() => setHpFlash(null), 800);
            toast(`💥 ${damage} damage to opponent! (${reason})`, { icon: '⚔️', style: { background: '#1e293b', color: '#fff' } });
            setTimeout(() => setLastDamage(null), 1000);
        });

        socket.on('duel-you-take-damage', ({ damage, myHp: newHp, reason }) => {
            setMyHp(newHp);
            setLastDamage({ target: 'me', amount: damage });
            setHpFlash('me');
            setTimeout(() => setHpFlash(null), 800);
            toast.error(`💔 ${damage} damage to you! (${reason})`);
            setTimeout(() => setLastDamage(null), 1000);
        });

        socket.on('duel-ended', ({ result: r, winner }) => {
            setPhase('ended');
            setResult(r === 'win' ? 'win' : 'lose');
            clearInterval(timerRef.current);
            // socket.disconnect(); // Keep alive for rematch
            // socketRef.current = null;
        });

        socket.on('duel-draw', () => {
            setPhase('ended');
            setResult('draw');
            clearInterval(timerRef.current);
            // socket.disconnect(); // Keep alive for rematch
            // socketRef.current = null;
        });

        socket.on('duel-rematch-offered', ({ username: requester }) => {
            setRematchStatus('received');
            setRematchRequestedBy(requester);
            toast(`⚔️ ${requester} wants a rematch!`, { icon: '🤝', duration: 10000 });
        });

        socket.on('duel-rematch-rejected', () => {
            setRematchStatus('declined');
            toast.error('Opponent declined the rematch.');
        });

        socket.on('duel-warning', ({ type, username: emitterName }) => {
            if (emitterName !== username) {
                // Play danger sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(err => console.log('Audio playback prevented', err));

                const message = type === 'fullscreen-exit'
                    ? `${emitterName} exited fullscreen! ⚠️`
                    : `${emitterName} switched tabs! 🕵️`;
                toast.error(message, {
                    icon: '🚫',
                    duration: 5000,
                    style: { background: '#ef4444', color: '#fff', fontWeight: 'bold', border: '2px solid white' }
                });
            }
        });

        // We DO NOT disconnect heavily on cleanup unless intentionally unmounting the page
        return () => {
            // Only strictly unmount socket if leaving page component entirely
        };
    }, [phase, roomId, username]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            clearInterval(timerRef.current);
        };
    }, []);

    // Cleanup on cancel/return to lobby
    useEffect(() => {
        if (phase === 'lobby') {
            socketRef.current?.disconnect();
            socketRef.current = null;
        }
    }, [phase]);

    // ── Anti-Cheat: Focus Monitoring ──
    useEffect(() => {
        if (phase !== 'battle') return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                socketRef.current?.emit('duel-warning', { roomId, type: 'tab-switch', username });
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                socketRef.current?.emit('duel-warning', { roomId, type: 'fullscreen-exit', username });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [phase, roomId, username]);

    // ── Psychological Tension Timer (Last 10 Seconds) ──
    useEffect(() => {
        if (phase === 'battle' && timeLeft <= 10 && timeLeft > 0) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            audio.volume = 0.6;
            audio.play().catch(e => console.log('Tick sound prevented', e));
        }
    }, [timeLeft, phase]);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    socketRef.current?.emit('duel-time-up', { roomId, username });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const handleJoin = (e) => {
        if (e) e.preventDefault();
        if (!roomId || !username) return toast.error('Please fill all fields');
        if (!user) localStorage.setItem('duelUsername', username);

        // ── Fullscreen Request (Must be inside user gesture) ──
        const elem = document.documentElement;
        if (elem.requestFullscreen && !document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.log(`Fullscreen blocked: ${err.message}`);
            });
        }

        // Ensure Room ID is in the URL for recovery on refresh (especially for hosts)
        const params = new URLSearchParams(window.location.search);
        if (params.get('roomId') !== roomId) {
            navigate(`/duel?roomId=${roomId}`, { replace: true });
        }

        setPhase('waiting');
        toast.loading('Waiting for opponent...', { id: 'waiting' });
    };

    // Normalize output for comparison (same logic as backend)
    const normalizeOutput = s => (s || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).join('\n');

    const handleRunComplete = ({ hasError, stdout, stderr, code }) => {
        if (!user) {
            toast.error('Please login to attack your opponent!', {
                icon: '🔒',
                style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(239,68,68,0.4)' }
            });
            return;
        }

        const rawStdout = stdout || '';
        const runHasError = !!(stderr || (code && code !== 0));

        // Check stdout against ALL sampleTestCases — any one match counts as correct
        const samples = problem?.sampleTestCases || [];
        let matchedExpected = '';
        const correct = !runHasError && samples.length > 0 && samples.some(tc => {
            if (normalizeOutput(rawStdout) === normalizeOutput(tc.output)) {
                matchedExpected = tc.output; // capture which expected output matched
                return true;
            }
            return false;
        });

        if (runHasError) {
            setOutput([{ type: 'stderr', content: stderr || 'Runtime Error' }]);
            setRunResult('error');
            toast.error('Code has errors!', { id: 'run' });
        } else if (correct) {
            setOutput([{ type: 'stdout', content: rawStdout || 'No output' }]);
            setRunResult('correct');
            toast.success('✅ Correct! Damage dealt!', { id: 'run' });
        } else {
            setOutput([{ type: 'stdout', content: rawStdout || 'No output' }]);
            setRunResult('wrong');
            toast('❌ Wrong answer — you take 5 damage!', { id: 'run', style: { background: '#1e293b', color: '#fff' } });
        }

        socketRef.current?.emit('duel-code-run', {
            roomId,
            username,
            hasError: runHasError,
            stdout: rawStdout,
            // Send the first sample output as expected; backend normalizes both sides
            expectedOutput: matchedExpected || (samples[0]?.output ?? '')
        });
    };

    // Set editorReady when battle starts
    useEffect(() => {
        if (phase === 'battle') {
            setEditorReady(true);
        } else {
            setEditorReady(false);
        }
    }, [phase]);

    // ── LOBBY SCREEN (No Room in URL) ──
    if (phase === 'lobby') {
        return (
            <div className={styles.root}>
                <Toaster position="top-center" />
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
                                <Swords size={36} color="#ef4444" />
                                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Duel Arena</h1>
                                <Swords size={36} color="#f97316" style={{ transform: 'scaleX(-1)' }} />
                            </div>
                            <p style={{ color: '#94a3b8', margin: 0 }}>1v1 Real-time Coding Battle — may the best programmer win</p>
                        </div>

                        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="text"
                                placeholder="Your Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Duel Room ID"
                                value={roomId}
                                onChange={e => setRoomId(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase())}
                                className={styles.ghostBtn}
                            >
                                Generate Room ID
                            </button>
                            <button type="submit" className={styles.primaryBtn}>
                                <Swords size={18} /> Enter Arena
                            </button>
                        </form>

                        <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <h4 style={{ margin: '0 0 10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16} /> Battle Rules</h4>
                            <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.8' }}>
                                <li>Both players get the same coding problem</li>
                                <li>You have <strong style={{ color: '#fff' }}>10 minutes</strong> to solve it</li>
                                <li>Each "Run" decreases opponent HP if your code is correct</li>
                                <li>Each error decreases YOUR OWN HP</li>
                                <li>First to reach 0 HP loses!</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── LOADING / WAITING SCREEN (Room ID Present or Phase Waiting) ──
    if (phase === 'waiting') {
        return (
            <div className={styles.root}>
                <Toaster position="top-center" />
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard} style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'battlePulse 2s infinite' }}>
                            <Swords size={32} color="#fff" />
                        </div>
                        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Entering Arena...</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '15px' }}>Room ID: <span style={{ color: '#f97316', fontWeight: 800 }}>{roomId}</span></p>

                        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '12px', padding: '12px 16px', margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <span style={{ color: '#f97316', fontSize: '12px', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {`${window.location.origin}/duel?roomId=${roomId}`}
                            </span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/duel?roomId=${roomId}`);
                                    toast.success('Invite link copied! 🔗', { duration: 2000 });
                                }}
                                style={{ background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, whiteSpace: 'nowrap' }}
                            >
                                <Copy size={13} /> Copy Link
                            </button>
                        </div>

                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '25px' }}>Syncing game state and timer...</p>

                        <div style={{ padding: '15px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'left', marginBottom: '25px' }}>
                            <h4 style={{ margin: '0 0 10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16} /> Battle Rules</h4>
                            <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.8' }}>
                                <li>Both players get the same coding problem</li>
                                <li>You have <strong style={{ color: '#fff' }}>10 minutes</strong> to solve it</li>
                                <li>Each "Run" decreases opponent HP if your code is correct</li>
                                <li>Each error decreases YOUR OWN HP</li>
                                <li>First to reach 0 HP loses!</li>
                            </ul>
                        </div>

                        <button onClick={() => { toast.dismiss('waiting'); setPhase('lobby'); navigate('/duel'); }} className={styles.ghostBtn}>
                            <X size={16} /> Cancel Battle
                        </button>
                    </div>
                </div>
                <style>{`@keyframes battlePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 0 20px rgba(239,68,68,0); } }`}</style>
            </div >
        );
    }

    // ── ENDED SCREEN ──
    if (phase === 'ended') {
        const isWin = result === 'win';
        const isDraw = result === 'draw';
        return (
            <div className={styles.root}>
                <Toaster position="top-center" />
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '80px', marginBottom: '10px' }}>{isWin ? '🏆' : isDraw ? '🤝' : '💀'}</div>
                        <h1 style={{ margin: '0 0 8px', fontWeight: 900, color: isWin ? '#22c55e' : isDraw ? '#f59e0b' : '#ef4444', fontSize: '2rem' }}>
                            {isWin ? 'Victory!' : isDraw ? 'Draw!' : 'Defeated!'}
                        </h1>
                        <p style={{ color: '#94a3b8', marginBottom: '25px' }}>
                            {isWin ? 'You crushed your opponent. Legendary!' : isDraw ? 'An honorable standoff.' : 'Better luck next time, warrior.'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                            {rematchStatus === 'idle' && (
                                <button onClick={() => {
                                    setRematchStatus('sent');
                                    socketRef.current?.emit('duel-rematch-request', { roomId, username });
                                }} className={styles.primaryBtn}>
                                    <Swords size={16} /> Request Rematch
                                </button>
                            )}

                            {rematchStatus === 'sent' && (
                                <div style={{ color: '#f59e0b', fontWeight: 600, padding: '10px 20px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
                                    Waiting for opponent to accept...
                                </div>
                            )}

                            {rematchStatus === 'received' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                    <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>Opponent wants a rematch!</p>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button onClick={() => {
                                            socketRef.current?.emit('duel-rematch-accept', { roomId, username });
                                        }} className={styles.primaryBtn} style={{ background: '#22c55e', flex: 1 }}>
                                            Accept
                                        </button>
                                        <button onClick={() => {
                                            setRematchStatus('idle');
                                            socketRef.current?.emit('duel-rematch-decline', { roomId, username });
                                        }} className={styles.ghostBtn} style={{ border: '1px solid #ef4444', color: '#ef4444', flex: 1 }}>
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}

                            {rematchStatus === 'declined' && (
                                <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '10px' }}>
                                    Opponent declined the rematch.
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%' }}>
                                <button onClick={() => { setPhase('lobby'); navigate('/duel'); }} className={styles.ghostBtn} style={{ flex: 1 }}>
                                    Back to Lobby
                                </button>
                                <button onClick={() => navigate('/')} className={styles.ghostBtn} style={{ flex: 1 }}>
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── BATTLE SCREEN ──
    return (
        <div className={styles.root} style={{ flexDirection: 'column' }}>
            <Toaster position="top-center" />

            {/* Battle Header */}
            <div className={styles.battleHeader}>
                <div style={{ transition: 'filter 0.1s', filter: hpFlash === 'me' ? 'brightness(2) saturate(2)' : 'none' }}>
                    <HealthBar hp={myHp} maxHp={MAX_HP} name={username} color="#3b82f6" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <TimerBadge seconds={timeLeft} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px' }}>
                        <Swords size={14} />
                        <span>vs</span>
                        <Swords size={14} />
                    </div>
                </div>
                <div style={{ transition: 'filter 0.1s', filter: hpFlash === 'opponent' ? 'brightness(2) saturate(2)' : 'none' }}>
                    <HealthBar hp={opponentHp} maxHp={MAX_HP} name={opponentName || 'Opponent'} color="#ef4444" right />
                </div>
            </div>

            {/* Problem + Editor Row */}
            <div className={styles.battleLayout}>
                {/* Problem Panel */}
                <div className={styles.problemPanel} style={{ padding: 0 }}>
                    {problem ? <ProblemDescription problem={problem} /> : <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>}
                </div>

                {/* Editor Panel */}
                <div className={styles.editorPanel}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {editorReady && (
                            <CodeEditor
                                roomId={`duel-${roomId}-${username}`}
                                username={username}
                                setOutput={setOutput}
                                setIsRunning={setIsRunning}
                                setIsAnalyzingComplexity={() => { }}
                                stdin={problem?.sampleTestCases?.[0]?.input || ''}
                                currentProblem={problem}
                                onRunComplete={handleRunComplete}
                                disableAI={true}
                            />
                        )}
                    </div>
                    {output && (
                        <div className={styles.output}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                <strong style={{ color: '#94a3b8', fontSize: '11px' }}>OUTPUT</strong>
                                {runResult === 'correct' && (
                                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e44', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>✅ CORRECT — 25 DMG to opponent!</span>
                                )}
                                {runResult === 'wrong' && (
                                    <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>❌ WRONG ANSWER — 5 DMG to you</span>
                                )}
                                {runResult === 'error' && (
                                    <span style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid #f9731644', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>💥 COMPILE ERROR — 10 DMG to you</span>
                                )}
                            </div>
                            <pre style={{ margin: '0', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                {Array.isArray(output) ? output.map((block, i) => (
                                    <div key={i} style={{ color: block.type === 'stderr' ? '#ef4444' : '#22c55e' }}>{block.content}</div>
                                )) : output}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes urgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

            {/* Chat Integration */}
            {socketRef.current && phase !== 'lobby' && phase !== 'waiting' && (
                <Chat
                    socket={socketRef.current}
                    roomId={roomId}
                    username={username}
                    color="#ef4444"
                    isOpen={isChatOpen}
                    setIsOpen={setIsChatOpen}
                    unreadCount={unreadCount}
                    setUnreadCount={setUnreadCount}
                />
            )}
        </div>
    );
}
