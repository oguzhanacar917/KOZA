import React from 'react';
import styles from '../../../styles/cocoon/base.module.css';

const WingUnfurling = ({ progress }) => {
    const unfurlProgress = Math.min(progress / 100, 1);

    return (
        <div className={styles.wingUnfurling}>
            {/* Butterfly body */}
            <div className={styles.butterflyBody} />

            {/* Left wing unfurling */}
            <div
                className={styles.wingLeft}
                style={{
                    transform: `scaleX(${unfurlProgress}) scaleY(${0.8 + unfurlProgress * 0.2})`,
                    opacity: unfurlProgress
                }}
            >
                <div className={styles.wingPattern} />
            </div>

            {/* Right wing unfurling */}
            <div
                className={styles.wingRight}
                style={{
                    transform: `scaleX(${unfurlProgress}) scaleY(${0.8 + unfurlProgress * 0.2})`,
                    opacity: unfurlProgress
                }}
            >
                <div className={styles.wingPattern} />
            </div>

            {/* Rainbow particles during unfurling */}
            {Array.from({ length: Math.floor(progress / 2) }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        width: '3px',
                        height: '3px',
                        background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                        borderRadius: '50%',
                        boxShadow: `0 0 6px hsl(${Math.random() * 360}, 80%, 60%)`,
                        animation: 'float 3s ease-in-out infinite, sparkle 2s ease-in-out infinite',
                        animationDelay: `${Math.random() * 2}s`,
                        pointerEvents: 'none'
                    }}
                />
            ))}
        </div>
    );
};

export default WingUnfurling;
