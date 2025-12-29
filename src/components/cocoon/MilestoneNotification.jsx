import React, { useState, useEffect } from 'react';
import { checkStageTransition, checkMilestone } from '../../utils/cocoon/stageCalculator';

const MilestoneNotification = ({ previousOz, currentOz }) => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Check for stage transition
        const transition = checkStageTransition(previousOz, currentOz);
        if (transition.transitioned) {
            setNotification({
                type: 'stage',
                stage: transition.currentStage,
                message: 'Yeni Dönüşüm Aşamasına Ulaştın! 🦋'
            });

            setTimeout(() => setNotification(null), 5000);
            return;
        }

        // Check for milestone
        const milestone = checkMilestone(previousOz, currentOz);
        if (milestone.hit) {
            setNotification({
                type: 'milestone',
                progress: milestone.progress,
                message: `${milestone.progress}% Tamamlandı! ✨`
            });

            setTimeout(() => setNotification(null), 3000);
        }
    }, [previousOz, currentOz]);

    if (!notification) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: notification.type === 'stage'
                ? 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)'
                : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white',
            padding: '24px 40px',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '12px'
            }}>
                {notification.type === 'stage' ? '🦋' : '✨'}
            </div>
            <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px'
            }}>
                {notification.message}
            </div>
            {notification.type === 'stage' && (
                <div style={{
                    fontSize: '14px',
                    opacity: 0.9
                }}>
                    Aşama {notification.stage}/7
                </div>
            )}
        </div>
    );
};

export default MilestoneNotification;
