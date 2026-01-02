import React from 'react';
import ButterflyTrail from '../particles/ButterflyTrail';
import styles from '../../../styles/cocoon/base.module.css';

const FirstFlight = ({ progress }) => {
    return (
        <div className={styles.firstFlight}>
            <div className={styles.flyingButterfly} style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className={styles.butterflyBody} />

                {/* Flying Wings */}
                <div className={styles.majesticWingLeft} style={{ transform: 'scale(0.8)', animationDuration: '0.8s' }}>
                    <div className={styles.wingPattern} />
                </div>

                <div className={styles.majesticWingRight} style={{ transform: 'scale(0.8)', animationDuration: '0.8s' }}>
                    <div className={styles.wingPattern} />
                </div>

                {/* Concentric Divine Aura */}
                {[1, 1.5, 2].map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        inset: '-20%',
                        background: `radial-gradient(circle, rgba(255, 215, 0, ${0.2 / s}) 0%, transparent 70%)`,
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        transform: `scale(${s})`,
                        animation: 'glowPulse 3s ease-in-out infinite',
                        animationDelay: `${i * 0.5}s`
                    }} />
                ))}
            </div>
        </div>
    );
};

export default FirstFlight;
