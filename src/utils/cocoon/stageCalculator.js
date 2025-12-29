/**
 * Stage Calculator - Determines cocoon transformation stage based on ÖZ
 */

export const STAGE_THRESHOLDS = {
    SEALED_COCOON: 0,
    EARLY_STIRRING: 201,
    BREAKING_THROUGH: 501,
    EMERGENCE: 1001,
    WING_UNFURLING: 2001,
    FIRST_FLIGHT: 4001,
    MAJESTIC_BUTTERFLY: 8001
};

export const STAGE_NAMES = {
    1: 'SEALED_COCOON',
    2: 'EARLY_STIRRING',
    3: 'BREAKING_THROUGH',
    4: 'EMERGENCE',
    5: 'WING_UNFURLING',
    6: 'FIRST_FLIGHT',
    7: 'MAJESTIC_BUTTERFLY'
};

export const STAGE_DESCRIPTIONS = {
    1: 'Kapalı Koza - Dönüşüm başlamak üzere',
    2: 'İlk Kıpırdanışlar - İçeride bir şeyler oluyor',
    3: 'Kırılma Anı - Koza çatlamaya başlıyor',
    4: 'Ortaya Çıkış - Yeni bir form beliriyor',
    5: 'Kanatların Açılışı - Renkler ortaya çıkıyor',
    6: 'İlk Uçuş - Özgürlük yaklaşıyor',
    7: 'Görkemli Kelebek - Tam dönüşüm tamamlandı'
};

/**
 * Calculate current stage based on total ÖZ
 */
export const calculateStage = (totalOz) => {
    if (totalOz >= STAGE_THRESHOLDS.MAJESTIC_BUTTERFLY) return 7;
    if (totalOz >= STAGE_THRESHOLDS.FIRST_FLIGHT) return 6;
    if (totalOz >= STAGE_THRESHOLDS.WING_UNFURLING) return 5;
    if (totalOz >= STAGE_THRESHOLDS.EMERGENCE) return 4;
    if (totalOz >= STAGE_THRESHOLDS.BREAKING_THROUGH) return 3;
    if (totalOz >= STAGE_THRESHOLDS.EARLY_STIRRING) return 2;
    return 1;
};

/**
 * Calculate progress within current stage (0-100)
 */
export const calculateStageProgress = (totalOz) => {
    const stage = calculateStage(totalOz);
    const thresholds = Object.values(STAGE_THRESHOLDS);

    const currentThreshold = thresholds[stage - 1];
    const nextThreshold = thresholds[stage] || currentThreshold + 4000;

    const progress = ((totalOz - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
};

/**
 * Get ÖZ needed for next stage
 */
export const getOzToNextStage = (totalOz) => {
    const stage = calculateStage(totalOz);
    if (stage >= 7) return 0;

    const thresholds = Object.values(STAGE_THRESHOLDS);
    const nextThreshold = thresholds[stage];

    return nextThreshold - totalOz;
};

/**
 * Check if user just reached a new stage
 */
export const checkStageTransition = (previousOz, currentOz) => {
    const previousStage = calculateStage(previousOz);
    const currentStage = calculateStage(currentOz);

    return {
        transitioned: currentStage > previousStage,
        previousStage,
        currentStage,
        newStage: currentStage > previousStage ? currentStage : null
    };
};

/**
 * Get milestone checkpoints within a stage
 */
export const getMilestones = (stage) => {
    const thresholds = Object.values(STAGE_THRESHOLDS);
    const start = thresholds[stage - 1];
    const end = thresholds[stage] || start + 4000;
    const range = end - start;

    return [
        start + range * 0.25,
        start + range * 0.5,
        start + range * 0.75
    ];
};

/**
 * Check if ÖZ amount hits a milestone
 */
export const checkMilestone = (previousOz, currentOz) => {
    const stage = calculateStage(currentOz);
    const milestones = getMilestones(stage);

    for (let milestone of milestones) {
        if (previousOz < milestone && currentOz >= milestone) {
            return {
                hit: true,
                milestone,
                progress: Math.round(((milestone - STAGE_THRESHOLDS[Object.keys(STAGE_THRESHOLDS)[stage - 1]]) /
                    (STAGE_THRESHOLDS[Object.keys(STAGE_THRESHOLDS)[stage]] - STAGE_THRESHOLDS[Object.keys(STAGE_THRESHOLDS)[stage - 1]])) * 100)
            };
        }
    }

    return { hit: false };
};
