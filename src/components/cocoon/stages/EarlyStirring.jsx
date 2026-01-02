import React, { useMemo } from 'react';
import SparkleParticles from '../particles/SparkleParticles';
import styles from '../../../styles/cocoon/base.module.css';

const EarlyStirring = ({ progress }) => {
    // Calculate number of cracks based on progress
    const crackCount = useMemo(() => {
        if (progress < 33) return 1;
        if (progress < 66) return 2;
        return 3;
    }, [progress]);

    const cracks = useMemo(() => {
        const positions = [
            { left: '30%', rotation: 15, delay: 0 },
            { left: '50%', rotation: -10, delay: 0.3 },
            { right: '30%', rotation: 20, delay: 0.6 }
        ];
        return positions.slice(0, crackCount);
    }, [crackCount]);

    return (
        <div className={styles.earlyStirring}>
            <div className={styles.silkTexture} />
            <div className={styles.silkTexture} style={{ transform: 'rotate(90deg)', opacity: 0.4 }} />

            {cracks.map((crack, index) => (
                <div
                    key={index}
                    className={styles.crack}
                    style={{
                        left: crack.left,
                        right: crack.right,
                        transform: `rotate(${crack.rotation}deg)`,
                        animationDelay: `${crack.delay}s`,
                        opacity: 0.5 + (progress / 150),
                        boxShadow: `0 0 ${10 + (progress / 5)}px rgba(255, 215, 0, 0.4)`
                    }}
                />
            ))}

            {/* Internal glow leaking through cracks */}
            <div className={styles.innerGlow} style={{
                opacity: 0.1 + (progress / 400),
                filter: 'blur(30px)'
            }} />
        </div>
    );
};

export default EarlyStirring;
