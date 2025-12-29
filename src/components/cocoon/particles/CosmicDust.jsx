import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const CosmicDust = ({ count = 100 }) => {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const depth = Math.random();
            const sizeClass = depth < 0.3 ? styles.cosmicDustSmall :
                depth < 0.7 ? styles.cosmicDustMedium :
                    styles.cosmicDustLarge;

            return {
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                depth,
                sizeClass,
                delay: Math.random() * 3,
                duration: 2 + Math.random() * 2
            };
        });
    }, [count]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -1
        }}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={particle.sizeClass}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        opacity: 0.3 + particle.depth * 0.7,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default CosmicDust;
