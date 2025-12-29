import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const LightBeams = ({ count = 5 }) => {
    const beams = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${20 + (i * 60 / count)}%`,
            rotation: -30 + Math.random() * 60,
            delay: i * 0.2,
            height: 80 + Math.random() * 70
        }));
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {beams.map((beam) => (
                <React.Fragment key={beam.id}>
                    {/* Main beam */}
                    <div
                        className={styles.lightBeamParticle}
                        style={{
                            left: beam.left,
                            top: '40%',
                            height: `${beam.height}px`,
                            '--beam-angle': `${beam.rotation}deg`,
                            animationDelay: `${beam.delay}s`
                        }}
                    />
                    {/* Glow */}
                    <div
                        className={styles.lightBeamGlow}
                        style={{
                            left: beam.left,
                            top: '40%',
                            height: `${beam.height}px`,
                            transform: `rotate(${beam.rotation}deg)`,
                            animationDelay: `${beam.delay}s`
                        }}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};

export default LightBeams;
