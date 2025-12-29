import React from 'react';
import CosmicDust from '../particles/CosmicDust';
import AuraParticles from '../particles/AuraParticles';
import styles from '../../../styles/cocoon/base.module.css';

const MajesticButterfly = ({ progress }) => {
    return (
        <div className={styles.majesticButterfly}>
            {/* Cosmic aura */}
            <div className={styles.cosmicAura} />

            {/* Butterfly body */}
            <div className={styles.butterflyBody} style={{
                background: 'linear-gradient(to bottom, #2C2C2C 0%, #1A1A1A 100%)',
                boxShadow: '0 0 20px rgba(139, 0, 255, 0.5)'
            }} />

            {/* Majestic wings */}
            <div className={styles.majesticWingLeft}>
                <div className={styles.wingPattern} />

                {/* Additional wing details */}
                <div style={{
                    position: 'absolute',
                    inset: '15%',
                    background: 'radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none'
                }} />
            </div>

            <div className={styles.majesticWingRight}>
                <div className={styles.wingPattern} />

                {/* Additional wing details */}
                <div style={{
                    position: 'absolute',
                    inset: '15%',
                    background: 'radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none'
                }} />
            </div>

            {/* Aura particles orbiting */}
            <AuraParticles count={40} />

            {/* Cosmic dust background */}
            <CosmicDust count={100} />

            {/* Multiple butterflies in background */}
            {[0, 1].map((i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${20 + i * 60}%`,
                        top: `${30 + i * 20}%`,
                        width: '60%',
                        height: '60%',
                        opacity: 0.3,
                        transform: `scale(${0.5 + i * 0.2})`,
                        animation: `majesticFlight ${8 + i * 2}s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
                        animationDelay: `${i * 2}s`,
                        pointerEvents: 'none'
                    }}
                >
                    <div className={styles.majesticWingLeft} style={{ opacity: 0.6 }} />
                    <div className={styles.majesticWingRight} style={{ opacity: 0.6 }} />
                </div>
            ))}
        </div>
    );
};

export default MajesticButterfly;
