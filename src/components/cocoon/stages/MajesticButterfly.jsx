import React from 'react';
import CosmicDust from '../particles/CosmicDust';
import AuraParticles from '../particles/AuraParticles';
import styles from '../../../styles/cocoon/base.module.css';

const MajesticButterfly = ({ progress }) => {
    return (
        <div className={styles.majesticButterfly}>
            {/* Cosmic aura radiance */}
            <div className={styles.cosmicAura} />

            <div className={styles.butterflyBody} />

            {/* Multi-layered Majestic Wings */}
            {/* Primary Wings */}
            <div className={styles.majesticWingLeft}>
                <div className={styles.wingPattern} style={{ opacity: 0.8 }} />
                <div className={styles.wingInnerShine} />
            </div>
            <div className={styles.majesticWingRight}>
                <div className={styles.wingPattern} style={{ opacity: 0.8 }} />
                <div className={styles.wingInnerShine} />
            </div>

            {/* Secondary Prismatic Overlays */}
            <div className={styles.majesticWingLeft} style={{
                opacity: 0.4,
                filter: 'hue-rotate(30deg) blur(2px)',
                transform: 'scale(1.05) translate(-2%, -2%)',
                animationDelay: '-1s'
            }} />
            <div className={styles.majesticWingRight} style={{
                opacity: 0.4,
                filter: 'hue-rotate(-30deg) blur(2px)',
                transform: 'scale(1.05) translate(2%, -2%)',
                animationDelay: '-1s'
            }} />

            {/* Orbiting Elements */}
            <AuraParticles count={30} />
            <CosmicDust count={60} />

            {/* Background "Ghost" Butterflies */}
            {[0, 1].map((i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${15 + i * 50}%`,
                        top: `${20 + i * 30}%`,
                        width: '50%',
                        height: '50%',
                        opacity: 0.15,
                        filter: 'blur(4px)',
                        transform: `scale(${0.4 + i * 0.2})`,
                        animation: `float ${10 + i * 5}s ease-in-out infinite`,
                        zIndex: -1
                    }}
                >
                    <div className={styles.majesticWingLeft} />
                    <div className={styles.majesticWingRight} />
                </div>
            ))}
        </div>
    );
};

export default MajesticButterfly;
