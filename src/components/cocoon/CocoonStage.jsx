import React, { useMemo } from 'react';
import { calculateStage, calculateStageProgress, STAGE_DESCRIPTIONS } from '../../utils/cocoon/stageCalculator';
import SealedCocoon from './stages/SealedCocoon';
import EarlyStirring from './stages/EarlyStirring';
import BreakingThrough from './stages/BreakingThrough';
import Emergence from './stages/Emergence';
import WingUnfurling from './stages/WingUnfurling';
import FirstFlight from './stages/FirstFlight';
import MajesticButterfly from './stages/MajesticButterfly';
import styles from '../../styles/cocoon/base.module.css';

const CocoonStage = ({ totalOz, onStageChange }) => {
    const stage = useMemo(() => calculateStage(totalOz), [totalOz]);
    const progress = useMemo(() => calculateStageProgress(totalOz), [totalOz]);
    const description = STAGE_DESCRIPTIONS[stage];

    // Notify parent of stage changes
    React.useEffect(() => {
        if (onStageChange) {
            onStageChange(stage, progress);
        }
    }, [stage, progress, onStageChange]);

    const renderStage = () => {
        switch (stage) {
            case 1:
                return <SealedCocoon progress={progress} />;
            case 2:
                return <EarlyStirring progress={progress} />;
            case 3:
                return <BreakingThrough progress={progress} />;
            case 4:
                return <Emergence progress={progress} />;
            case 5:
                return <WingUnfurling progress={progress} />;
            case 6:
                return <FirstFlight progress={progress} />;
            case 7:
                return <MajesticButterfly progress={progress} />;
            default:
                return <SealedCocoon progress={progress} />;
        }
    };

    return (
        <div className={styles.cocoonContainer}>
            <div className={styles.cocoonWrapper}>
                {renderStage()}
            </div>

            {/* Stage Description */}
            <div style={{
                position: 'absolute',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '100%'
            }}>
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: 500,
                    margin: 0
                }}>
                    {description}
                </p>
                <div style={{
                    marginTop: '8px',
                    height: '4px',
                    background: '#e5e5e5',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    maxWidth: '300px',
                    margin: '8px auto 0'
                }}>
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #9333ea, #c084fc)',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease-out',
                        borderRadius: '2px'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default CocoonStage;
