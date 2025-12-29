import React from 'react';
import ButterflyTrail from '../particles/ButterflyTrail';
import styles from '../../../styles/cocoon/base.module.css';

const FirstFlight = ({ progress }) => {
    return (
        <div className={styles.firstFlight}>
            <div className={styles.flyingButterfly}>
                {/* Butterfly body */}
                <div className={styles.butterflyBody} />

                {/* Flying wings with flapping animation */}
                <div className={styles.flyingWingLeft}>
                    <div className={styles.wingPattern} />
                </div>

                <div className={styles.flyingWingRight}>
                    <div className={styles.wingPattern} />
                </div>

                {/* Flight trail */}
                <ButterflyTrail intensity={progress} />

                {/* Glow aura */}
                <div style={{
                    position: 'absolute',
                    inset: '-15%',
                    background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: 'glowPulse 2s ease-in-out infinite'
                }} />
            </div>
        </div>
    );
};

export default FirstFlight;
