import React from 'react';
import styles from '../../../styles/cocoon/base.module.css';

const SealedCocoon = ({ progress }) => {
    return (
        <div className={styles.sealedCocoon}>
            {/* Multi-layered silk texture for depth */}
            <div className={styles.silkTexture} style={{ opacity: 1 }} />
            <div className={styles.silkTexture} style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
            <div className={styles.silkTexture} style={{ transform: 'rotate(45deg)', opacity: 0.3 }} />

            {/* Subtle internal metabolic glow */}
            <div
                className={styles.innerGlow}
                style={{
                    opacity: 0.2 + (progress * 0.003),
                    transform: `scale(${1 + (progress * 0.001)})`
                }}
            />
        </div>
    );
};

export default SealedCocoon;
