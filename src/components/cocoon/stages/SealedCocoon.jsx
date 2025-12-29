import React from 'react';
import styles from '../../../styles/cocoon/base.module.css';

const SealedCocoon = ({ progress }) => {
    return (
        <div className={styles.sealedCocoon}>
            {/* Silk texture overlay */}
            <div className={styles.silkTexture} />

            {/* Subtle internal glow based on progress */}
            <div style={{
                position: 'absolute',
                inset: '20%',
                background: `radial-gradient(ellipse at center, rgba(255, 215, 0, ${progress * 0.002}) 0%, transparent 70%)`,
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default SealedCocoon;
