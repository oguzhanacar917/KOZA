/**
 * KOZA Safety Utility
 * Handles crisis detection, content filtering, and mandatory disclaimers.
 */

const CRISIS_KEYWORDS = [
    // Turkish keywords for safety interception
    'kendime zarar', 'intihar', 'ölmek istiyorum', 'canıma kıymak',
    'bıçaklamak', 'silahla', 'asılmak', 'zehirlemek',
    // High-risk violence
    'birini öldürmek', 'zarar vermek istiyorum'
];

/**
 * Normalizes text for Turkish-aware comparison.
 * @param {string} text 
 * @returns {string}
 */
const normalizeTurkish = (text) => {
    return text
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .toLowerCase();
};

/**
 * Checks if the input contains crisis-related or high-risk language.
 * @param {string} text - User input to check.
 * @returns {object} { isCrisis: boolean, message: string }
 */
export const detectCrisis = (text) => {
    if (!text || typeof text !== 'string') {
        return { isCrisis: false };
    }

    const normalized = normalizeTurkish(text);
    const foundKeywords = CRISIS_KEYWORDS.filter(kw => normalized.includes(kw));

    if (foundKeywords.length > 0) {
        return {
            isCrisis: true,
            message: "Bu platform eğitim amaçlıdır. Kendini veya bir başkasını tehlikede hissediyorsan lütfen hemen profesyonel yardım al veya 112'yi ara."
        };
    }

    return { isCrisis: false };
};

export const SAFETY_DISCLAIMER = "KOZA bir eğitim aracıdır ve profesyonel psikolojik desteğin yerini tutmaz.";

/**
 * Basic filter for toxic content.
 * @param {string} text 
 * @returns {string}
 */
export const getSafetyFilter = (text) => {
    if (!text || typeof text !== 'string') return '';

    // Basic filter for toxic content (placeholder for more advanced NLP if needed)
    // In a real app, this would use a more comprehensive list or an external API
    const toxicPatterns = [/küfür1/gi, /küfür2/gi, /hakaret1/gi];
    let filtered = text;
    toxicPatterns.forEach(pattern => {
        filtered = filtered.replace(pattern, '***');
    });

    return filtered;
};
