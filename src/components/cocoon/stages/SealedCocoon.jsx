import React from 'react';
import styles from '../../../styles/cocoon/base.module.css';

const SealedCocoon = ({ progress }) => {
    return (
        <div className="flex items-center justify-center w-full h-full relative">
            {/* The Visible Silken Vessel */}
            <div className={styles.cocoonVessel}>
                <div className={styles.frostedSilk} />
                <div className={styles.internalGlow} />
                <div className={styles.prismaticEffect} />
            </div>

            {/* Ambient Shadow / Grounding Light */}
            <div className="absolute w-40 h-10 bg-purple-500/20 blur-2xl rounded-full bottom-10 animate-pulse-subtle" />
        </div>
    );
};

export default SealedCocoon;
