/**
 * Color Palettes for Each Transformation Stage
 */

export const STAGE_COLORS = {
    // Stage 1: Sealed Cocoon
    SEALED_COCOON: {
        base: '#8B7355',
        shadow: '#5D4E37',
        highlight: '#A0826D',
        glow: 'rgba(139, 115, 85, 0.3)',
        accent: '#6B5D4F',
        particles: ['#D4A574', '#B8956A', '#9C8560']
    },

    // Stage 2: Early Stirring
    EARLY_STIRRING: {
        base: '#8B7355',
        shadow: '#5D4E37',
        highlight: '#A0826D',
        crackLight: '#FFD700',
        warmGlow: '#FFA500',
        energyPulse: '#FF8C00',
        particles: ['#FFD700', '#FFA500', '#FF8C00']
    },

    // Stage 3: Breaking Through
    BREAKING_THROUGH: {
        base: '#8B7355',
        fragment: '#D4A574',
        lightBeam: '#FFEB3B',
        energyBurst: '#FF6B35',
        innerGlow: '#FFF176',
        particles: ['#FFEB3B', '#FFD54F', '#FF6B35', '#FFA726']
    },

    // Stage 4: Emergence
    EMERGENCE: {
        chrysalisBase: '#4A90E2',
        wingBud: '#7B68EE',
        magicParticle: '#DA70D6',
        transformation: '#9370DB',
        shimmer: '#E6E6FA',
        particles: ['#DA70D6', '#9370DB', '#BA55D3', '#DDA0DD']
    },

    // Stage 5: Wing Unfurling
    WING_UNFURLING: {
        wingPrimary: '#FF1493',
        wingSecondary: '#00CED1',
        iridescent1: '#FF69B4',
        iridescent2: '#9370DB',
        iridescent3: '#20B2AA',
        shimmer: '#FFB6C1',
        particles: ['#FF1493', '#FF69B4', '#00CED1', '#9370DB', '#20B2AA']
    },

    // Stage 6: First Flight
    FIRST_FLIGHT: {
        wing1: '#FF1493',
        wing2: '#FFD700',
        wing3: '#00CED1',
        wing4: '#9370DB',
        trail: 'rgba(255, 20, 147, 0.5)',
        glow: 'rgba(255, 215, 0, 0.4)',
        particles: ['#FF1493', '#FFD700', '#00CED1', '#FF69B4', '#FFA500']
    },

    // Stage 7: Majestic Butterfly
    MAJESTIC_BUTTERFLY: {
        cosmicPurple: '#8B00FF',
        cosmicBlue: '#4169E1',
        cosmicPink: '#FF1493',
        cosmicGold: '#FFD700',
        auraGlow: 'rgba(139, 0, 255, 0.6)',
        ethereal: '#E0B0FF',
        particles: ['#8B00FF', '#4169E1', '#FF1493', '#FFD700', '#00CED1', '#FF69B4']
    }
};

/**
 * Get gradient for stage
 */
export const getStageGradient = (stage) => {
    const gradients = {
        1: 'linear-gradient(135deg, #8B7355 0%, #5D4E37 100%)',
        2: 'linear-gradient(135deg, #8B7355 0%, #FFA500 50%, #5D4E37 100%)',
        3: 'linear-gradient(135deg, #FFEB3B 0%, #FF6B35 50%, #8B7355 100%)',
        4: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 50%, #DA70D6 100%)',
        5: 'linear-gradient(135deg, #FF1493 0%, #9370DB 25%, #00CED1 50%, #FF69B4 75%, #20B2AA 100%)',
        6: 'linear-gradient(135deg, #FF1493 0%, #FFD700 33%, #00CED1 66%, #9370DB 100%)',
        7: 'linear-gradient(135deg, #8B00FF 0%, #4169E1 25%, #FF1493 50%, #FFD700 75%, #00CED1 100%)'
    };

    return gradients[stage] || gradients[1];
};

/**
 * Get particle colors for stage
 */
export const getParticleColors = (stage) => {
    const stageKey = Object.keys(STAGE_COLORS)[stage - 1];
    return STAGE_COLORS[stageKey]?.particles || STAGE_COLORS.SEALED_COCOON.particles;
};

/**
 * Get glow color for stage
 */
export const getGlowColor = (stage) => {
    const glows = {
        1: 'rgba(139, 115, 85, 0.3)',
        2: 'rgba(255, 165, 0, 0.4)',
        3: 'rgba(255, 235, 59, 0.5)',
        4: 'rgba(218, 112, 214, 0.5)',
        5: 'rgba(255, 20, 147, 0.5)',
        6: 'rgba(255, 215, 0, 0.4)',
        7: 'rgba(139, 0, 255, 0.6)'
    };

    return glows[stage] || glows[1];
};

/**
 * Interpolate between two colors
 */
export const interpolateColor = (color1, color2, factor) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Convert hex to RGB
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

/**
 * Get animated gradient for stage transition
 */
export const getTransitionGradient = (fromStage, toStage, progress) => {
    const from = getStageGradient(fromStage);
    const to = getStageGradient(toStage);

    // This is a simplified version - in reality, you'd interpolate the gradient stops
    return progress < 0.5 ? from : to;
};
