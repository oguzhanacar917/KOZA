/**
 * Animation Timing Configurations
 */

export const ANIMATION_DURATIONS = {
    // Breathing animation (Stage 1)
    BREATHE: 4000,

    // Glow pulse
    GLOW_PULSE: 2000,

    // Crack spreading (Stage 2-3)
    CRACK_SPREAD: 1500,

    // Fragment fall (Stage 3)
    FRAGMENT_FALL: 2000,

    // Emergence (Stage 4)
    EMERGENCE: 3000,

    // Wing unfurling (Stage 5)
    WING_UNFURL: 4000,

    // Flight motion (Stage 6-7)
    FLUTTER: 3000,
    FLIGHT_PATH: 8000,

    // Particle lifespans
    SPARKLE: 2000,
    MAGIC_DUST: 3000,
    TRAIL: 1000,

    // Stage transitions
    STAGE_TRANSITION: 2500
};

export const ANIMATION_EASINGS = {
    // Standard easings
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',

    // Custom cubic beziers
    SMOOTH: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    ELASTIC: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    SOFT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    // Specialized
    BREATHE: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    UNFURL: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    FLUTTER: 'cubic-bezier(0.42, 0, 0.58, 1)'
};

export const ANIMATION_DELAYS = {
    STAGGER_PARTICLE: 50,
    STAGGER_CRACK: 100,
    STAGGER_FRAGMENT: 80,
    STAGGER_WING: 200
};

/**
 * Get animation config for specific stage
 */
export const getStageAnimationConfig = (stage) => {
    const configs = {
        1: {
            primary: 'breathe',
            duration: ANIMATION_DURATIONS.BREATHE,
            easing: ANIMATION_EASINGS.BREATHE,
            iterations: 'infinite'
        },
        2: {
            primary: 'crackSpread',
            duration: ANIMATION_DURATIONS.CRACK_SPREAD,
            easing: ANIMATION_EASINGS.EASE_OUT,
            iterations: 1
        },
        3: {
            primary: 'breakThrough',
            duration: ANIMATION_DURATIONS.FRAGMENT_FALL,
            easing: ANIMATION_EASINGS.EASE_IN,
            iterations: 1
        },
        4: {
            primary: 'emerge',
            duration: ANIMATION_DURATIONS.EMERGENCE,
            easing: ANIMATION_EASINGS.SMOOTH,
            iterations: 1
        },
        5: {
            primary: 'unfurlWings',
            duration: ANIMATION_DURATIONS.WING_UNFURL,
            easing: ANIMATION_EASINGS.UNFURL,
            iterations: 1
        },
        6: {
            primary: 'flutter',
            duration: ANIMATION_DURATIONS.FLUTTER,
            easing: ANIMATION_EASINGS.FLUTTER,
            iterations: 'infinite'
        },
        7: {
            primary: 'majesticFlight',
            duration: ANIMATION_DURATIONS.FLIGHT_PATH,
            easing: ANIMATION_EASINGS.SMOOTH,
            iterations: 'infinite'
        }
    };

    return configs[stage] || configs[1];
};

/**
 * Get particle animation config
 */
export const getParticleAnimationConfig = (type) => {
    const configs = {
        sparkle: {
            duration: ANIMATION_DURATIONS.SPARKLE,
            easing: ANIMATION_EASINGS.EASE_IN_OUT,
            delay: () => Math.random() * 1000
        },
        magicDust: {
            duration: ANIMATION_DURATIONS.MAGIC_DUST,
            easing: ANIMATION_EASINGS.SOFT,
            delay: () => Math.random() * 500
        },
        trail: {
            duration: ANIMATION_DURATIONS.TRAIL,
            easing: ANIMATION_EASINGS.LINEAR,
            delay: 0
        },
        fragment: {
            duration: ANIMATION_DURATIONS.FRAGMENT_FALL,
            easing: ANIMATION_EASINGS.EASE_IN,
            delay: () => Math.random() * 300
        }
    };

    return configs[type] || configs.sparkle;
};

/**
 * Calculate stagger delay for index
 */
export const getStaggerDelay = (index, baseDelay = 50) => {
    return index * baseDelay;
};

/**
 * Get random duration within range
 */
export const getRandomDuration = (min, max) => {
    return Math.random() * (max - min) + min;
};
