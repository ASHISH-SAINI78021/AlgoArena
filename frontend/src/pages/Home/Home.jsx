import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code, Zap, Trophy, Users, Sparkles, ChevronRight,
  Play, Target, Brain, Award, Ghost, GitBranch,
  MessageSquare, BarChart2, ArrowRight, Terminal, Swords
} from 'lucide-react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Cubes from '../../reactbits/Cubes';
import ScrollStack, { ScrollStackItem } from '../../reactbits/ScrollStack';
import BubbleMenu from '../../reactbits/BubbleMenu';
import TiltedCard from '../../reactbits/TiltedCard';

/* ════════════════════════════════════════════════
   CANVAS PARTICLES SYSTEM
════════════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.r = Math.random() * 1.2 + 0.3;
        const hue = Math.random() > 0.6 ? 270 + Math.random() * 40 : 290 + Math.random() * 60;
        this.color = `hsla(${hue},75%,68%,${Math.random() * 0.5 + 0.15})`;
        this.life = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life = this.y / H;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.globalAlpha = this.life * 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Reduced from 180 → 60 particles, removed expensive shadowBlur & per-frame gradients
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

/* ════════════════════════════════════════════════
   3-D TILT CARD HOOK
════════════════════════════════════════════════ */
function useTilt(strength = 12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = e => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const rx = ((e.clientY - top - height / 2) / height) * -strength;
      const ry = ((e.clientX - left - width / 2) / width) * strength;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    };
    const off = () => { el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'; };
    el.addEventListener('mousemove', on);
    el.addEventListener('mouseleave', off);
    return () => { el.removeEventListener('mousemove', on); el.removeEventListener('mouseleave', off); };
  }, [strength]);
  return ref;
}

/* ════════════════════════════════════════════════
   MAGNETIC BUTTON HOOK
════════════════════════════════════════════════ */
function useMagnetic() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = e => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
    };
    const off = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', on);
    el.addEventListener('mouseleave', off);
    return () => { el.removeEventListener('mousemove', on); el.removeEventListener('mouseleave', off); };
  }, []);
  return ref;
}

/* ════════════════════════════════════════════════
   INTERSECTION FADE-UP HOOK
════════════════════════════════════════════════ */
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add(styles.visible); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ════════════════════════════════════════════════
   COUNTER ANIMATION HOOK
════════════════════════════════════════════════ */
function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const num = parseFloat(target);
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        setVal(Math.round(eased * num));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, val };
}

/* ════════════════════════════════════════════════
   TYPING LINES
════════════════════════════════════════════════ */
const CODE_LINES = [
  { n: 1, parts: [{ t: 'comment', v: '# Ghost AI hint: use a hash map, O(n)' }] },
  { n: 2, parts: [{ t: 'keyword', v: 'def ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: '(nums, target):' }] },
  { n: 3, parts: [{ t: 'indent', v: '  seen = {}' }] },
  { n: 4, parts: [{ t: 'indent2', v: '  for ' }, { t: 'fn', v: 'i, n' }, { t: 'plain', v: ' in enumerate(nums):' }] },
  { n: 5, parts: [{ t: 'indent2', v: '    complement = target - n' }] },
  { n: 6, parts: [{ t: 'indent2', v: '    if complement in seen:' }] },
  { n: 7, parts: [{ t: 'indent3', v: '      return ' }, { t: 'string', v: '[seen[complement], i]' }] },
  { n: 8, parts: [{ t: 'indent2', v: '    seen[n] = i' }] },
];

function PartSpan({ t, v }) {
  const map = {
    comment: styles.cComment,
    keyword: styles.cKeyword,
    fn: styles.cFn,
    string: styles.cString,
    indent: styles.cPlain,
    indent2: styles.cPlain,
    indent3: styles.cPlain,
    plain: styles.cPlain,
  };
  return <span className={map[t]}>{v}</span>;
}

function CodeWindow() {
  const [runtime, setRuntime] = useState(0);
  const tilt = useTilt(8);

  useEffect(() => {
    const t = setInterval(() => setRuntime(p => (p + 11) % 97 + 2), 90);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.codeWindowOuter} ref={tilt}>
      <div className={styles.codeWindowRing} />
      <div className={styles.codeWindow}>
        <div className={styles.codeBar}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
          <span className={styles.codeBarTitle}>
            <Terminal size={12} style={{ opacity: 0.5 }} /> &nbsp; two_sum.py &nbsp;·&nbsp; GhostCode Arena
          </span>
        </div>
        <div className={styles.codeBody}>
          {CODE_LINES.map(line => (
            <div key={line.n} className={styles.codeLine}>
              <span className={styles.lineNum}>{line.n}</span>
              {line.parts.map((p, i) => <PartSpan key={i} {...p} />)}
            </div>
          ))}
          <div className={styles.codeLine}>
            <span className={styles.lineNum}>9</span>
            <span className={styles.cPlain}>&nbsp;&nbsp;</span>
            <span className={styles.cursor} />
          </div>
          <div className={styles.codeResult}>
            <span className={styles.resultDot} />
            All 57 test cases passed &nbsp;·&nbsp; Runtime: <strong>{runtime}ms</strong> &nbsp;·&nbsp; O(n) complexity
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   STAT CARD
════════════════════════════════════════════════ */
function StatCard({ label, raw, suffix, icon, delay }) {
  const { ref, val } = useCounter(raw);
  const fadeRef = useFadeUp(delay);
  return (
    <div className={`${styles.statCard} ${styles.fadeUp}`} ref={el => { ref.current = el; fadeRef.current = el; }}>
      <div className={styles.statGlow} />
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{val}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FEATURE CARD
════════════════════════════════════════════════ */
function FeatureCard({ icon, title, desc, delay }) {
  const tilt = useTilt(10);
  const fade = useFadeUp(delay);
  return (
    <div
      className={`${styles.featureCard} ${styles.fadeUp}`}
      ref={el => { tilt.current = el; fade.current = el; }}
    >
      <div className={styles.fcBorderAnim} />
      <div className={styles.fcIconWrap}>{icon}</div>
      <h3 className={styles.fcTitle}>{title}</h3>
      <p className={styles.fcDesc}>{desc}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const magBtn1 = useMagnetic();
  const magBtn2 = useMagnetic();
  const magBtn3 = useMagnetic();
  const heroRef = useFadeUp(0);
  const h1Ref = useFadeUp(100);
  const subRef = useFadeUp(250);
  const ctaRef = useFadeUp(400);

  const features = [
    { icon: <Brain size={24} />, title: 'Ghost AI Mentor', desc: 'Invisible AI watches your session and drops contextual hints — never the full answer, just the nudge that levels you up.' },
    { icon: <Zap size={24} />, title: 'Real-time Battles', desc: 'WebSocket-synced 1v1 duels with live cursors, voice chat, and instant leaderboard scoring.' },
    { icon: <Target size={24} />, title: 'Pattern Radar', desc: 'Detects your weak DSA patterns — Sliding Window, DP, Trees — and auto-queues targeted problems.' },
    { icon: <GitBranch size={24} />, title: 'GitHub Sync', desc: 'One-click push to your repo with a smart commit message. Your portfolio grows on autopilot.' },
    { icon: <MessageSquare size={24} />, title: 'Voice + Chat', desc: 'Full voice and text chat baked into every room. Pair program like you\'re in the same office.' },
    { icon: <BarChart2 size={24} />, title: 'Arena Rankings', desc: 'Climb Bronze → Silver → Gold → Legend. Rating adjusts based on opponent strength and speed.' },
  ];

  const stats = [
    { label: 'Problems', raw: 500, suffix: '+', icon: <Code size={20} /> },
    { label: 'Active Users', raw: 10, suffix: 'K+', icon: <Users size={20} /> },
    { label: 'Battles Fought', raw: 50, suffix: 'K+', icon: <Trophy size={20} /> },
    { label: 'Success Rate', raw: 94, suffix: '%', icon: <Award size={20} /> },
  ];

  const ticker = [
    'Dynamic Programming', 'Sliding Window', 'Binary Search', 'Graph BFS/DFS',
    'Two Pointers', 'Priority Queue', 'Tries', 'Union-Find',
    'Backtracking', 'Divide & Conquer', 'Monotonic Stack', 'Bit Manipulation',
  ];

  return (
    <div className={styles.root}>

      {/* animated mesh gradient spheres */}
      <div className={styles.sphere1} />
      <div className={styles.sphere2} />
      <div className={styles.sphere3} />

      {/* grid overlay */}
      <div className={styles.gridOverlay} />

      {/* ── NAVBAR ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoMark}>
            <Ghost size={16} color="#fff" />
          </div>
          <span className={styles.logoWord}>GhostCode</span>
        </div>
        <div className={styles.navCenter}>
          <a href="#" className={styles.navItem}>Problems</a>
          <a href="#" className={styles.navItem}>Battles</a>
          <a href="#" className={styles.navItem}>Leaderboard</a>
          <a href="#" className={styles.navItem}>Pricing</a>
        </div>
        <div className={styles.navRight}>
          {user ? (
            <>
              <span className={styles.navGreet}>Hi, {user.username}</span>
              <button className={styles.navBtn} onClick={() => navigate('/saved-codes')}>Saved</button>
              <button className={styles.navBtn} onClick={logout}>Logout</button>
              <button className={styles.navBtn} onClick={() => navigate('/duel')} style={{ color: '#ef4444' }}>
                <Swords size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'text-bottom' }} /> Duel
              </button>
              <button className={styles.navPrimary} onClick={() => navigate('/realtime-coding')}>
                Open Arena <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button className={styles.navBtn} onClick={() => navigate('/login')}>Login</button>
              <button className={styles.navBtn} onClick={() => navigate('/duel')} style={{ color: '#ef4444' }}>
                <Swords size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'text-bottom' }} /> Duel
              </button>
              <button className={styles.navPrimary} onClick={() => navigate('/realtime-coding')}>
                Open Arena <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={`${styles.fadeUp} ${styles.badge}`} ref={heroRef}>
          <Sparkles size={12} />
          AI · Real-Time Battles · DSA Mastery
        </div>

        <h1 className={`${styles.h1} ${styles.fadeUp}`} ref={h1Ref}>
          <span className={styles.h1Line1}>Where Code</span>
          <br />
          <span className={styles.shimmerText}>Meets Combat</span>
        </h1>

        <p className={`${styles.heroSub} ${styles.fadeUp}`} ref={subRef}>
          Practice DSA with an invisible AI ghost that guides you through hard problems.
          Battle peers live. Climb the ranked ladder. Land the job.
        </p>

        <div className={`${styles.heroButtons} ${styles.fadeUp}`} ref={ctaRef}>
          <button
            ref={magBtn1}
            className={styles.primaryBtn}
            onClick={() => navigate('/realtime-coding')}
          >
            <Play size={16} />
            Enter the Arena
            <span className={styles.btnShine} />
          </button>
          <button
            ref={magBtn2}
            className={styles.ghostBtn}
            onClick={() => navigate('/duel')}
            style={{ border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171' }}
          >
            <Swords size={16} />
            1v1 Duel
          </button>
          <button
            ref={magBtn3}
            className={styles.ghostBtn}
            onClick={() => navigate('/realtime-coding')}
          >
            <Code size={16} />
            Browse Problems
          </button>
        </div>

        <CodeWindow />
      </section>

      {/* ── TICKER ── */}
      <div className={styles.tickerWrap}>
        <div className={styles.tickerFadeL} />
        <div className={styles.tickerFadeR} />
        <div className={styles.tickerTrack}>
          {[...ticker, ...ticker, ...ticker].map((item, i) => (
            <span key={i} className={styles.tickerChip}>
              <span className={styles.chipDot} />{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className={styles.statsSection}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 100} />
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.section}>
        <div className={`${styles.sectionHead} ${styles.fadeUp}`} ref={useFadeUp(0)}>
          <span className={styles.pill}>What sets us apart</span>
          <h2 className={styles.sectionH2}>Built for <span className={styles.shimmerText}>serious</span> learners</h2>
          <p className={styles.sectionSub}>Every feature exists to help you reach FAANG-ready faster.</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`${styles.ctaSection} ${styles.fadeUp}`} ref={useFadeUp(0)}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaRing1} />
          <div className={styles.ctaRing2} />
          <div className={styles.ctaInner}>
            <span className={styles.pill}>Join 10,000+ developers</span>
            <h2 className={styles.ctaH2}>
              Ready to become a <br />
              <span className={styles.shimmerText}>Ghost in the machine?</span>
            </h2>
            <p className={styles.ctaSub}>
              Start free. No credit card. Land your dream job.
            </p>
            <div className={styles.ctaBtns}>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate('/realtime-coding')}
              >
                {user ? 'Keep Practicing' : 'Get Started Free'}
                <ChevronRight size={16} />
                <span className={styles.btnShine} />
              </button>
              <button className={styles.ghostBtn}>View Pricing</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrand}>
              <div className={styles.logoMark} style={{ width: 24, height: 24 }}>
                <Ghost size={12} color="#fff" />
              </div>
              GhostCode
            </div>
            <p className={styles.footerTagline}>Code smarter. Win battles. Land the job.</p>
          </div>
          {[
            { heading: 'Product', links: ['Problems', 'Battles', 'Leaderboard', 'Pricing'] },
            { heading: 'Resources', links: ['DSA Roadmap', 'Interview Prep', 'Blog', 'Community'] },
            { heading: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className={styles.footerHeading}>{col.heading}</h4>
              <ul className={styles.footerList}>
                {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          © 2026 GhostCode · Built by developers, for developers
        </div>
      </footer>

      <BubbleMenu
        useFixedPosition={true}
        style={{ top: 'auto', bottom: '2rem', left: '0', right: '0', zIndex: 1000, display: 'flex', justifyContent: 'center' }}
        className="sm:hidden"
        logo={<Ghost size={24} color="#000" />}
        menuContentColor="#000"
        items={[
          { label: 'Arena', href: '/realtime-coding', hoverStyles: { bgColor: '#8b5cf6', textColor: '#fff' } },
          { label: 'Duel', href: '/duel', hoverStyles: { bgColor: '#ef4444', textColor: '#fff' } },
          { label: 'Stats', href: '#', hoverStyles: { bgColor: '#ec4899', textColor: '#fff' } },
          { label: 'Login', href: '/login', hoverStyles: { bgColor: '#22d3ee', textColor: '#fff' } }
        ]}
      />
    </div>
  );
}