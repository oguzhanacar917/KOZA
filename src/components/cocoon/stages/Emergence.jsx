import React from 'react';
import MagicDust from '../particles/MagicDust';
import styles from '../../../styles/cocoon/base.module.css';

const Emergence = ({ progress }) => {
    const wingBudScale = Math.min(progress / 100, 1);

    return (
        <div className={styles.emergence}>
            <div className={styles.chrysalis}>
                <div className={styles.butterflyBody} style={{ opacity: 0.5, transform: 'translate(-50%, -50%) scale(0.8)' }} />

                {/* Wing buds with refined visuals */}
                <div
                    className={styles.wingBudLeft}
                    style={{
                        transform: `scaleX(${wingBudScale}) scaleY(${wingBudScale}) translate(-10%, -10%)`,
                        opacity: wingBudScale * 0.8,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50% 5% 50% 50%'
                    }}
                />
                <div
                    className={styles.wingBudRight}
                    style={{
                        transform: `scaleX(${wingBudScale}) scaleY(${wingBudScale}) translate(10%, -10%)`,
                        opacity: wingBudScale * 0.8,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '5% 50% 50% 50%'
                    }}
                />
            </div>

            {/* Dynamic Transformation Ripples */}
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${120 + i * 60}px`,
                        height: `${120 + i * 60}px`,
                        border: '1px solid rgba(147, 51, 234, 0.2)',
                        borderRadius: '50%',
                        animation: 'transformationRipple 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
                        animationDelay: `${i * 0.6}s`,
                        pointerEvents: 'none',
                        boxShadow: 'inset 0 0 20px rgba(147, 51, 234, 0.1)'
                    }}
                />
            ))}
        </div>
    );
};

export default Emergence;
