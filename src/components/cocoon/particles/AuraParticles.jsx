import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const AuraParticles = ({ count = 40 }) => {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            angle: (i / count) * 360,
            radius: 60 + (i % 3) * 20,
            delay: (i / count) * 10,
            duration: 8 + Math.random() * 4,
            size: 3 + Math.random() * 2
        }));
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`${styles.auraParticle} ${styles.auraOrbit}`}
                    style={{
                        left: '50%',
                        top: '50%',
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        '--swirl-radius': `${particle.radius}px`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default AuraParticles;
