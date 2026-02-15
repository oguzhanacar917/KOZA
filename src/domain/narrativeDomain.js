import { detectCrisis } from '../utils/safety';
import { generateStorybook, generateGame, generateContentName } from '../services/geminiService';
import { validateStoryInput } from '../utils/validation';

/**
 * KOZA Narrative Domain Service
 * Mediates between UI and AI service to ensure safety and educational alignment.
 */
export const NarrativeDomain = {
    /**
     * Processes a narrative generation request with full safety and architectural checks.
     */
    processNarrativeRequest: async (input, mode = 'story') => {
        // 1. Validation Logic
        const validation = validateStoryInput(input);
        if (!validation.isValid) {
            throw new Error(validation.errors[0]);
        }

        // 2. Safety Interception (Crisis Detection)
        const safetyCheck = detectCrisis(validation.sanitized);
        if (safetyCheck.isCrisis) {
            return {
                isSafetyTriggered: true,
                message: safetyCheck.message,
                redirect: 'SAFETY_RESOURCES'
            };
        }

        // 3. AI Service Coordination
        try {
            const [result, generatedTitle] = await Promise.all([
                mode === 'story'
                    ? generateStorybook(validation.sanitized)
                    : generateGame(validation.sanitized),
                generateContentName(validation.sanitized)
            ]);

            // 4. Domain Mapping (Transforming raw AI output to Domain Model)
            return {
                isSafetyTriggered: false,
                data: {
                    type: mode,
                    title: generatedTitle || (mode === 'story' ? 'Dönüşüm Hikayesi' : 'Dönüşüm Oyunu'),
                    userInput: validation.sanitized,
                    pages: mode === 'story' ? result.pages : undefined,
                    levels: mode === 'game' ? result.levels : undefined,
                    themeColor: result.themeColor || '#9333EA',
                    visualMood: result.visualMood || 'Magical Shimmer',
                    reflectionQuestion: result.reflectionQuestion || "Bu hikaye sana kendi gücün hakkında ne söylüyor?",
                    growthLesson: result.growthLesson || "Zorluklar gelişimin habercisidir.",
                    createdAt: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Domain Layer Error:', error);
            throw new Error(`Hikaye oluşturma sırasında bir sorun oluştu: ${error.message}`);
        }
    }
};
