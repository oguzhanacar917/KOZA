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
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.life = Math.random() * 100 + 100;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 0.5;
                if (this.life <= 0) this.reset();
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();

                // Bloom effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
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
