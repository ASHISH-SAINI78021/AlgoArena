import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * FluidCursor — a high-performance, WebGL-free cursor trail effect.
 * Uses 2D canvas with a particle system that follows the mouse.
 * Works on all browsers without GPU driver requirements.
 */
function FluidCursor({ color = '#8b5cf6' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        let mouse = { x: W / 2, y: H / 2 };
        let particles = [];
        let animId;

        // Parse hex color to rgb
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 139, g: 92, b: 246 };
        };

        const rgb = hexToRgb(color);

        const COLORS = [
            `${rgb.r}, ${rgb.g}, ${rgb.b}`,           // base purple
            `236, 72, 153`,                             // pink
            `34, 211, 238`,                             // cyan
            `167, 139, 250`,                            // light purple
        ];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = (Math.random() - 0.5) * 3;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.015;
                this.size = Math.random() * 12 + 4;
                this.colorStr = COLORS[Math.floor(Math.random() * COLORS.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.96;
                this.vy *= 0.96;
                this.life -= this.decay;
                this.size *= 0.97;
            }

            draw() {
                if (this.life <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.life * 0.7;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(${this.colorStr}, ${this.life})`);
                gradient.addColorStop(1, `rgba(${this.colorStr}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Trailing dot that smoothly lags behind cursor
        let trail = { x: mouse.x, y: mouse.y };
        const TRAIL_SPEED = 0.18;

        const animate = () => {
            ctx.clearRect(0, 0, W, H);

            // Smooth trail follow
            trail.x += (mouse.x - trail.x) * TRAIL_SPEED;
            trail.y += (mouse.y - trail.y) * TRAIL_SPEED;

            // Spawn particles near trail point
            if (particles.length < 200) {
                for (let i = 0; i < 3; i++) {
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    particles.push(new Particle(trail.x + offsetX, trail.y + offsetY));
                }
            }

            // Update & draw, prune dead particles
            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => { p.update(); p.draw(); });

            // Draw glowing dot at cursor
            ctx.save();
            ctx.globalAlpha = 0.9;
            const dot = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, 18);
            dot.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
            dot.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            dot.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            ctx.fillStyle = dot;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            animId = requestAnimationFrame(animate);
        };

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            // Burst of extra particles on fast movement
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        };

        const onResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, [color]);

    const content = (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2147483647,
                pointerEvents: 'none',
                display: 'block',
            }}
        />
    );

    return createPortal(content, document.body);
}

export default FluidCursor;
