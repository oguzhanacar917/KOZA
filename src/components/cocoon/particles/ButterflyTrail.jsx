import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const ButterflyTrail = ({ intensity = 50 }) => {
    const [trailPoints, setTrailPoints] = useState([]);

    const trailCount = useMemo(() => Math.floor(intensity / 2), [intensity]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrailPoints(prev => {
                const newPoint = {
                    id: Date.now(),
                    left: `${45 + Math.random() * 10}%`,
                    top: `${45 + Math.random() * 10}%`
                };

                return [...prev, newPoint].slice(-trailCount);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [trailCount]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {trailPoints.map((point, index) => (
                <div
                    key={point.id}
                    className={styles.trailParticle}
                    style={{
                        left: point.left,
                        top: point.top,
                        opacity: (index / trailPoints.length) * 0.8,
                        animationDelay: `${index * 0.05}s`
                    }}
                />
            ))}
        </div>
    );
};

export default ButterflyTrail;
