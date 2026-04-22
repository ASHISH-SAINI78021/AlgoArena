import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Toaster, toast } from 'react-hot-toast';
import axios from '../../axios/axiosInstance';
import CodeEditor from '../../Component/CodeEditor/CodeEditor';
import OutputConsole from '../../Component/OutputConsole/OutputConsole';
import Chat from '../../Component/Chat/Chat';
import VoiceChat from '../../Component/VoiceChat/VoiceChat';
import ProblemSidebar from '../../Component/ProblemSidebar/ProblemSidebar';
import ProblemDescription from '../../Component/ProblemSidebar/ProblemDescription';
import AIChat from '../../Component/AIChat/AIChat';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Play } from 'lucide-react';
import styles from './CodingRealtime.module.css';

/* ── Particle Canvas Background ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.vy = -(Math.random() * 0.5 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.r = Math.random() * 1.5 + 0.3;
        const hue = Math.random() > 0.6 ? 270 + Math.random() * 40 : 290 + Math.random() * 60;
        this.color = `hsla(${hue},80%,70%,${Math.random() * 0.6 + 0.2})`;
        this.life = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life = this.y / H;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });

      // Mouse glow
      const { x, y } = mouseRef.current;
      const mg = ctx.createRadialGradient(x, y, 0, x, y, 200);
      mg.addColorStop(0, 'rgba(139,92,246,0.06)');
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}


const CodingRealtime = () => {
  const { theme } = useTheme();
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [output, setOutput] = useState([{ type: 'info', content: "Click 'Run' to see output here." }]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] = useState(false);
  const [stdin, setStdin] = useState("");

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Yjs state
  const [yDoc, setYDoc] = useState(null);
  const [provider, setProvider] = useState(null);

  // Problem state
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);

  // Socket state
  const [socket, setSocket] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    // 1. Initial Socket Handshake
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    // 2. Check URL params for immediate join
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('roomId');
    const userParam = params.get('username');

    if (roomParam && userParam) {
      setRoomId(roomParam);
      setUsername(userParam);
      setJoined(true);
    } else if (roomParam && user) {
      setRoomId(roomParam);
      setUsername(user.username);
      setJoined(true);
    } else if (roomParam) {
      setRoomId(roomParam);
    } else if (user) {
      setUsername(user.username);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Handle Room Join and Yjs Initialization
  useEffect(() => {
    if (!joined || !roomId || !socket) return;

    // Join Socket Room
    socket.emit('join-room', roomId);

    // Initialize Yjs for THIS room
    const doc = new Y.Doc();
    const wsp = new WebsocketProvider(
      import.meta.env.VITE_YJS_WEBSOCKET_URL,
      roomId,
      doc
    );

    setYDoc(doc);
    setProvider(wsp);

    // Sync Problem selection via Yjs
    const sharedData = doc.getMap('sharedData');
    const syncProblem = () => {
      const problemSlug = sharedData.get('problemSlug');
      if (problemSlug && (!selectedProblem || selectedProblem.slug !== problemSlug)) {
        // Fetch problem details if slug changes
        axios.get(`/problems/${problemSlug}`).then(res => {
          setSelectedProblem(res.data);
        }).catch(err => console.error("Sync error:", err));
      }
    };
    sharedData.observe(syncProblem);

    return () => {
      wsp.disconnect();
      doc.destroy();
      setYDoc(null);
      setProvider(null);
      sharedData.unobserve(syncProblem);
    };
  }, [joined, roomId, socket]);

  const handleSelectProblem = (problem) => {
    setIsProblemListOpen(false); // Close list after selection
    if (yDoc) {
      const sharedData = yDoc.getMap('sharedData');
      sharedData.set('problemSlug', problem.slug);
    } else {
      // Fallback if yDoc is not ready
      axios.get(`/problems/${problem.slug}`).then(res => {
        setSelectedProblem(res.data);
      }).catch(err => console.error(err));
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId && username) {
      // Update URL without reload
      const newUrl = `${window.location.pathname}?roomId=${roomId}&username=${username}`;
      window.history.pushState({}, '', newUrl);
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div className={styles.root}>
        <ParticleCanvas />
        <div className={styles.sphere1} />
        <div className={styles.sphere2} />
        <div className={styles.sphere3} />
        <div className={styles.gridOverlay} />

        <div className={styles.lobbyContainer}>
          <form onSubmit={handleJoin} className={styles.lobbyCard}>
            <div>
              <h2 className={styles.lobbyTitle}>Join Arena</h2>

            </div>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.lobbyInput}
              required
            />
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className={styles.lobbyInput}
              required
            />

            <button type="submit" className={styles.primaryBtn}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> Enter Lobby
              </span>
              <span className={styles.btnShine} />
            </button>

            <button
              type="button"
              onClick={() => setRoomId(Math.random().toString(36).substring(7))}
              className={styles.ghostBtn}
            >
              Generate Random Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <ParticleCanvas />
      <div className={styles.gridOverlay} style={{ opacity: 0.5 }} />
      <Toaster position="top-center" />

      {/* 1. Problem List Drawer (Overlay) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '350px',
        background: 'rgba(10, 10, 18, 0.85)',
        backdropFilter: `blur(24px)`,
        zIndex: 100,
        transform: isProblemListOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid rgba(255,255,255,0.06)`
      }}>
        <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
          <h3 style={{ margin: 0, color: theme.accent }}>Select Problem</h3>
          <button
            onClick={() => setIsProblemListOpen(false)}
            style={{ background: 'transparent', border: 'none', color: theme.subtext, cursor: 'pointer', fontSize: '24px' }}
          >
            ×
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ProblemSidebar
            onSelectProblem={handleSelectProblem}
            currentSlug={selectedProblem?.slug}
          />
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className={styles.arenaLayout}>

        {/* Column 1: Problem Description */}
        <div className={styles.pane} style={{
          flex: isDescriptionVisible ? 1.2 : 0,
          borderRight: `1px solid rgba(255,255,255,0.06)`,
          minWidth: isDescriptionVisible ? '300px' : '0px'
        }}>
          {isDescriptionVisible && (
            <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button
                className={styles.toggleBtnTopLeft}
                onClick={() => setIsProblemListOpen(true)}
              >
                Change Problem
              </button>
              <ProblemDescription problem={selectedProblem} />
            </div>
          )}
        </div>

        {/* Column 2: Editor Section */}
        <div className={styles.pane} style={{
          flex: 2,
          borderRight: `1px solid rgba(255,255,255,0.06)`,
          minWidth: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Toggles for full focus */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button
              onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              className={styles.verticalToggle}
              title={isDescriptionVisible ? "Hide Description" : "Show Description"}
            >
              {isDescriptionVisible ? '◀' : '▶'}
            </button>
            {!isDescriptionVisible && (
              <button
                onClick={() => setIsProblemListOpen(true)}
                className={styles.verticalToggleActive}
                title="Select Problem"
              >
                ☰
              </button>
            )}
          </div>

          <CodeEditor
            roomId={roomId}
            username={username}
            setOutput={setOutput}
            setIsRunning={setIsRunning}
            setIsAnalyzingComplexity={setIsAnalyzingComplexity}
            stdin={stdin}
            yDoc={yDoc}
            provider={provider}
            currentProblem={selectedProblem}
          />
        </div>

        {/* Column 3: Output & AI Sidebar Area */}
        <div className={styles.pane} style={{ flex: 1.1, minWidth: '350px', display: 'flex', flexDirection: 'column', borderRight: 'none' }}>
          <div style={{ height: '40%', borderBottom: `1px solid rgba(255,255,255,0.06)`, overflow: 'hidden' }}>
            <OutputConsole output={output} isRunning={isRunning} isAnalyzingComplexity={isAnalyzingComplexity} stdin={stdin} setStdin={setStdin} />
          </div>
          <div style={{ height: '60%', overflow: 'hidden' }}>
            <AIChat
              currentProblem={selectedProblem}
              currentCode={yDoc?.getText('monaco').toString() || ''}
              language={selectedProblem?.language || 'javascript'}
              onInsertCode={(fullResponse) => {
                const codeBlockRegex = /```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/g;
                let match;
                let extractedCode = "";
                while ((match = codeBlockRegex.exec(fullResponse)) !== null) {
                  extractedCode += match[1] + "\n\n";
                }
                const codeToInsert = extractedCode.trim() || fullResponse.trim();
                if (yDoc) {
                  const type = yDoc.getText('monaco');
                  yDoc.transact(() => {
                    type.delete(0, type.length);
                    type.insert(0, codeToInsert);
                  });
                  toast.success("Code inserted from AI!");
                }
              }}
            />
          </div>
        </div>
      </div>

      <Chat
        socket={socket}
        yDoc={yDoc}
        roomId={roomId}
        username={username}
        color="#8b5cf6"
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />

      <VoiceChat
        roomId={roomId}
        username={username}
        socket={socket}
      />
    </div>
  );
};

export default CodingRealtime;
