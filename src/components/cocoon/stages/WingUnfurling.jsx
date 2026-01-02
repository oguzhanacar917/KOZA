import React from 'react';
import styles from '../../../styles/cocoon/base.module.css';

const WingUnfurling = ({ progress }) => {
    const unfurlProgress = Math.min(progress / 100, 1);

    return (
        <div className={styles.wingUnfurling}>
            <div className={styles.butterflyBody} />

            {/* Multi-layered Unfurling Wings */}
            <div
                className={styles.wingLeft}
                style={{
                    transform: `scale(${unfurlProgress}) rotate(${(1 - unfurlProgress) * 20}deg)`,
                    opacity: unfurlProgress
                }}
            >
                <div className={styles.wingPattern} />
                <div className={styles.wingInnerShine} />
            </div>

            <div
                className={styles.wingRight}
                style={{
                    transform: `scale(${unfurlProgress}) rotate(${(1 - unfurlProgress) * -20}deg)`,
                    opacity: unfurlProgress
                }}
            >
                <div className={styles.wingPattern} />
                <div className={styles.wingInnerShine} />
            </div>

            {/* Glow Aura during unfurling */}
            <div className={styles.cosmicAura} style={{ opacity: unfurlProgress * 0.5 }} />
        </div>
    );
};

export default WingUnfurling;
