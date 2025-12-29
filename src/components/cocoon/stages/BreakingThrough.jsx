import React, { useMemo } from 'react';
import LightBeams from '../particles/LightBeams';
import CocoonFragments from '../particles/CocoonFragments';
import styles from '../../../styles/cocoon/base.module.css';

const BreakingThrough = ({ progress }) => {
    const fragmentCount = useMemo(() => Math.floor(progress / 4), [progress]);
    const beamCount = useMemo(() => Math.min(Math.floor(progress / 15), 7), [progress]);

    return (
        <div className={styles.breakingThrough}>
            {/* Cocoon shell */}
            <div className={styles.cocoonShell}>
                {/* Major cracks */}
                <div
                    className={styles.majorCrack}
                    style={{
                        left: '35%',
                        transform: 'rotate(20deg)',
                        height: `${Math.min(progress * 1.5, 100)}%`
                    }}
                />
                <div
                    className={styles.majorCrack}
                    style={{
                        left: '50%',
                        transform: 'rotate(-15deg)',
                        height: `${Math.min(progress * 1.3, 100)}%`
                    }}
                />
                <div
                    className={styles.majorCrack}
                    style={{
                        right: '35%',
                        transform: 'rotate(25deg)',
                        height: `${Math.min(progress * 1.4, 100)}%`
                    }}
                />
            </div>

            {/* Inner glow intensifying */}
            <div className={styles.innerGlow} style={{
                opacity: Math.min(progress / 100, 0.8)
            }} />

            {/* Light beams shooting out */}
            {progress > 20 && <LightBeams count={beamCount} />}

            {/* Cocoon fragments falling */}
            {progress > 40 && <CocoonFragments count={fragmentCount} />}
        </div>
    );
};

export default BreakingThrough;
