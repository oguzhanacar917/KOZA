import React from 'react';
import MagicDust from '../particles/MagicDust';
import styles from '../../../styles/cocoon/base.module.css';

const Emergence = ({ progress }) => {
    const wingBudScale = Math.min(progress / 100, 1);

    return (
        <div className={styles.emergence}>
            {/* Chrysalis body */}
            <div className={styles.chrysalis}>
                {/* Wing buds emerging */}
                <div
                    className={styles.wingBudLeft}
                    style={{
                        transform: `scaleX(${wingBudScale}) scaleY(${wingBudScale})`,
                        opacity: wingBudScale
                    }}
                />
                <div
                    className={styles.wingBudRight}
                    style={{
                        transform: `scaleX(${wingBudScale}) scaleY(${wingBudScale})`,
                        opacity: wingBudScale
                    }}
                />
            </div>

            {/* Magic particles swirling around */}
            {progress > 10 && <MagicDust count={Math.floor(progress)} />}

            {/* Transformation ripples */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${100 + i * 50}px`,
                        height: `${100 + i * 50}px`,
                        border: '2px solid rgba(218, 112, 214, 0.3)',
                        borderRadius: '50%',
                        animation: 'transformationRipple 2s ease-out infinite',
                        animationDelay: `${i * 0.4}s`,
                        pointerEvents: 'none'
                    }}
                />
            ))}
        </div>
    );
};

export default Emergence;
