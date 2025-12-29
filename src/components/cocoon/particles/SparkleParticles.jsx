import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const SparkleParticles = ({ count = 20 }) => {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            delay: Math.random() * 2,
            duration: 1.5 + Math.random() * 1.5,
            size: 3 + Math.random() * 3
        }));
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={styles.sparkleParticle}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default SparkleParticles;
