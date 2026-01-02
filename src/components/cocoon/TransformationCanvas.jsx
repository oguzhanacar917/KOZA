import React, { useRef, useEffect } from 'react';

const TransformationCanvas = ({ color = '#9333EA', intensity = 1, active = true }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const particles = [];
        const particleCount = 40 * intensity;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8 - (0.5 * intensity); // Slight upward float
                this.opacity = Math.random() * 0.6 + 0.1;
                this.life = Math.random() * 200 + 100;
                this.maxLife = this.life;
                this.history = [];
            }

            update() {
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 5) this.history.shift();

                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 1;
                this.opacity = (this.life / this.maxLife) * 0.6;

                if (this.life <= 0) this.reset();
            }

            draw() {
                // Draw Tail
                if (this.history.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.history[0].x, this.history[0].y);
                    for (let i = 1; i < this.history.length; i++) {
                        ctx.lineTo(this.history[i].x, this.history[i].y);
                    }
                    ctx.strokeStyle = `${color}${Math.floor(this.opacity * 100).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = this.size;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();

                // Bloom effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = color;
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const resize = () => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            init(); // Re-init on resize to match new dimensions
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, [color, intensity, active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default TransformationCanvas;
