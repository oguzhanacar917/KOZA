import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const MagicDust = ({ count = 60 }) => {
    const particles = useMemo(() => {
        const colors = ['#DA70D6', '#9370DB', '#BA55D3', '#DDA0DD', '#E6E6FA', '#FF69B4'];

        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            swirlRadius: 20 + Math.random() * 40,
            size: 2 + Math.random() * 2
        }));
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={styles.magicDustParticle}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        '--particle-color': particle.color,
                        '--swirl-radius': `${particle.swirlRadius}px`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default MagicDust;
