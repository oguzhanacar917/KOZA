import React, { useMemo } from 'react';
import styles from '../../../styles/cocoon/particles.module.css';

const CocoonFragments = ({ count = 20 }) => {
    const fragments = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * 360;
            const distance = 100 + Math.random() * 100;
            const fallX = Math.cos(angle * Math.PI / 180) * distance;
            const fallY = Math.sin(angle * Math.PI / 180) * distance + 100;

            return {
                id: i,
                left: `${40 + Math.random() * 20}%`,
                top: `${30 + Math.random() * 40}%`,
                size: 10 + Math.random() * 20,
                fallX,
                fallY,
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5,
                sizeClass: i % 3 === 0 ? styles.fragmentLarge : i % 2 === 0 ? styles.fragmentMedium : styles.fragmentSmall
            };
        });
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {fragments.map((fragment) => (
                <div
                    key={fragment.id}
                    className={fragment.sizeClass}
                    style={{
                        left: fragment.left,
                        top: fragment.top,
                        '--fall-x': `${fragment.fallX}px`,
                        '--fall-y': `${fragment.fallY}px`,
                        '--fall-rotation': `${fragment.rotation}deg`,
                        animationDelay: `${fragment.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

export default CocoonFragments;
