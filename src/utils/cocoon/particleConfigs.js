/**
 * Particle System Configurations
 */

export const PARTICLE_CONFIGS = {
    // Sparkle particles (Stage 2+)
    SPARKLE: {
        count: 30,
        minSize: 2,
        maxSize: 6,
        minLifespan: 1000,
        maxLifespan: 3000,
        minSpeed: 0.5,
        maxSpeed: 2,
        gravity: -0.1,
        fadeIn: 200,
        fadeOut: 500,
        twinkle: true
    },

    // Light beams (Stage 3)
    LIGHT_BEAM: {
        count: 7,
        minWidth: 2,
        maxWidth: 4,
        minLength: 50,
        maxLength: 150,
        rotationSpeed: 0.5,
        pulseSpeed: 1000,
        opacity: 0.6
    },

    // Cocoon fragments (Stage 3-4)
    FRAGMENT: {
        count: 25,
        minSize: 10,
        maxSize: 30,
        gravity: 0.3,
        rotationSpeed: 2,
        fadeOutStart: 1000,
        fadeOutDuration: 1000,
        bounce: 0.3
    },

    // Magic dust (Stage 4-5)
    MAGIC_DUST: {
        count: 100,
        minSize: 1,
        maxSize: 3,
        minSpeed: 0.3,
        maxSpeed: 1.5,
        swirl: true,
        swirlRadius: 50,
        swirlSpeed: 0.02,
        glow: true,
        glowIntensity: 0.5,
        colorCycle: true
    },

    // Butterfly trail (Stage 6-7)
    TRAIL: {
        count: 50,
        size: 4,
        lifespan: 1000,
        spacing: 5,
        fadeOut: 800,
        gradientStops: 5
    },

    // Aura particles (Stage 7)
    AURA: {
        count: 60,
        minSize: 2,
        maxSize: 5,
        orbitRadius: 100,
        orbitSpeed: 0.01,
        float: true,
        floatAmplitude: 10,
        floatSpeed: 0.02,
        glow: true
    },

    // Cosmic dust (Stage 7)
    COSMIC: {
        count: 150,
        minSize: 1,
        maxSize: 4,
        depth: true,
        minDepth: 0.3,
        maxDepth: 1,
        parallax: true,
        twinkle: true,
        twinkleSpeed: 2000
    }
};

/**
 * Generate particle properties
 */
export const generateParticle = (type, canvasWidth, canvasHeight) => {
    const config = PARTICLE_CONFIGS[type];

    const baseParticle = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        age: 0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
    };

    switch (type) {
        case 'SPARKLE':
            return {
                ...baseParticle,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                lifespan: config.minLifespan + Math.random() * (config.maxLifespan - config.minLifespan),
                speed: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
                twinklePhase: Math.random() * Math.PI * 2
            };

        case 'MAGIC_DUST':
            return {
                ...baseParticle,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                speed: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
                swirlAngle: Math.random() * Math.PI * 2,
                swirlRadius: Math.random() * config.swirlRadius,
                colorIndex: Math.floor(Math.random() * 6)
            };

        case 'FRAGMENT':
            return {
                ...baseParticle,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                rotationSpeed: (Math.random() - 0.5) * config.rotationSpeed,
                shape: Math.floor(Math.random() * 3) // Different fragment shapes
            };

        case 'TRAIL':
            return {
                ...baseParticle,
                size: config.size,
                lifespan: config.lifespan,
                opacity: 1
            };

        case 'AURA':
            return {
                ...baseParticle,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                orbitAngle: Math.random() * Math.PI * 2,
                orbitRadius: config.orbitRadius * (0.5 + Math.random() * 0.5),
                floatPhase: Math.random() * Math.PI * 2
            };

        case 'COSMIC':
            return {
                ...baseParticle,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                depth: config.minDepth + Math.random() * (config.maxDepth - config.minDepth),
                twinklePhase: Math.random() * Math.PI * 2,
                baseX: baseParticle.x,
                baseY: baseParticle.y
            };

        default:
            return baseParticle;
    }
};

/**
 * Update particle position and properties
 */
export const updateParticle = (particle, type, deltaTime, canvasWidth, canvasHeight) => {
    const config = PARTICLE_CONFIGS[type];

    switch (type) {
        case 'SPARKLE':
            particle.x += particle.vx * particle.speed * deltaTime;
            particle.y += particle.vy * particle.speed * deltaTime;
            particle.vy += config.gravity * deltaTime;
            particle.age += deltaTime;
            particle.life = 1 - (particle.age / particle.lifespan);
            particle.twinklePhase += deltaTime * 0.005;
            break;

        case 'MAGIC_DUST':
            particle.swirlAngle += config.swirlSpeed * deltaTime;
            particle.x += Math.cos(particle.swirlAngle) * config.swirlRadius * deltaTime * 0.01;
            particle.y += Math.sin(particle.swirlAngle) * config.swirlRadius * deltaTime * 0.01;
            particle.y -= particle.speed * deltaTime;
            break;

        case 'FRAGMENT':
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += config.gravity * deltaTime;
            particle.rotation += particle.rotationSpeed * deltaTime;
            particle.age += deltaTime;

            if (particle.age > config.fadeOutStart) {
                particle.life = 1 - ((particle.age - config.fadeOutStart) / config.fadeOutDuration);
            }
            break;

        case 'TRAIL':
            particle.age += deltaTime;
            particle.life = 1 - (particle.age / particle.lifespan);
            particle.opacity = particle.life;
            break;

        case 'AURA':
            particle.orbitAngle += config.orbitSpeed * deltaTime;
            particle.floatPhase += config.floatSpeed * deltaTime;

            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            particle.x = centerX + Math.cos(particle.orbitAngle) * particle.orbitRadius;
            particle.y = centerY + Math.sin(particle.orbitAngle) * particle.orbitRadius +
                Math.sin(particle.floatPhase) * config.floatAmplitude;
            break;

        case 'COSMIC':
            particle.twinklePhase += deltaTime * 0.003;

            // Parallax effect based on depth
            if (config.parallax) {
                const parallaxX = (canvasWidth / 2 - particle.baseX) * (1 - particle.depth) * 0.1;
                const parallaxY = (canvasHeight / 2 - particle.baseY) * (1 - particle.depth) * 0.1;
                particle.x = particle.baseX + parallaxX;
                particle.y = particle.baseY + parallaxY;
            }
            break;
    }

    return particle;
};

/**
 * Check if particle should be removed
 */
export const shouldRemoveParticle = (particle, type, canvasWidth, canvasHeight) => {
    if (particle.life <= 0) return true;

    // Remove if out of bounds (except for orbital particles)
    if (type !== 'AURA' && type !== 'COSMIC') {
        if (particle.x < -50 || particle.x > canvasWidth + 50 ||
            particle.y < -50 || particle.y > canvasHeight + 50) {
            return true;
        }
    }

    return false;
};
