import React, { useMemo } from 'react';
import LightBeams from '../particles/LightBeams';
import CocoonFragments from '../particles/CocoonFragments';
import styles from '../../../styles/cocoon/base.module.css';

const BreakingThrough = ({ progress }) => {
    const fragmentCount = useMemo(() => Math.floor(progress / 4), [progress]);
    const beamCount = useMemo(() => Math.min(Math.floor(progress / 15), 7), [progress]);

    return (
        <div className={styles.breakingThrough}>
            <div className={styles.cocoonShell}>
                {[35, 50, 65].map((pos, i) => (
                    <div
                        key={i}
                        className={styles.majorCrack}
                        style={{
                            left: `${pos}%`,
                            transform: `translateX(-50%) rotate(${i * 10 - 10}deg)`,
                            height: `${Math.min(progress * 1.5, 100)}%`,
                            opacity: 0.6 + (progress / 200)
                        }}
                    />
                ))}
            </div>

            <div className={styles.innerGlow} style={{
                opacity: Math.min(progress / 80, 0.9),
                background: 'radial-gradient(circle, rgba(255, 235, 59, 0.6) 0%, transparent 70%)'
            }} />

            {/* Dramatic light beams */}
            {progress > 15 && (
                <div className={styles.lightBeam} style={{
                    opacity: progress / 100,
                    transform: `scale(${1 + progress / 100})`
                }} />
            )}
        </div>
    );
};

export default BreakingThrough;
