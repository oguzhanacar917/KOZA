/**
 * KOZA Safety Utility
 * Handles crisis detection, content filtering, and mandatory disclaimers.
 */

const CRISIS_KEYWORDS = [
    // English keywords
    'self harm', 'suicide', 'want to die', 'kill myself',
    'stab', 'with gun', 'hang myself', 'poison',
    'kill someone', 'want to hurt',
    // Turkish keywords
    'kendime zarar', 'intihar', 'ölmek istiyorum', 'kendimi öldürmek',
    'bıçaklamak', 'silahla', 'kendimi asmak', 'zehir',
    'birini öldürmek', 'zarar vermek istiyorum'
];

/**
 * Normalizes text for comparison.
 * @param {string} text 
 * @returns {string}
 */
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .trim();
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

    const normalized = normalizeText(text);
    const foundKeywords = CRISIS_KEYWORDS.filter(kw => normalized.includes(kw));

    if (foundKeywords.length > 0) {
        return {
            isCrisis: true,
            message: "Bu platform eğitim amaçlıdır. Kendiniz veya başkaları için tehlikede hissediyorsanız, lütfen hemen profesyonel yardım alın veya acil servisleri (örn. 112) arayın."
        };
    }

    return { isCrisis: false };
};

export const SAFETY_DISCLAIMER = "KOZA eğitim amaçlı bir araçtır ve profesyonel psikolojik desteğin yerini tutmaz.";

/**
 * Basic filter for toxic content.
 * @param {string} text 
 * @returns {string}
 */
export const getSafetyFilter = (text) => {
    if (!text || typeof text !== 'string') return '';

    // Basic toxic word filter. These are common English slurs/profanity.
    // For production-grade filtering, integrate an external NLP safety API
    // such as Perspective API (https://perspectiveapi.com/) or AWS Comprehend.
    const TOXIC_PATTERNS = [
        /\bfuck(ing)?\b/gi,
        /\bshit\b/gi,
        /\bbitch\b/gi,
        /\basthole\b/gi,
        /\bcunt\b/gi,
        /\bdick\b/gi,
        /\bfaggot\b/gi,
        /\bnigger\b/gi,
        /\bwhore\b/gi,
    ];
    let filtered = text;
    TOXIC_PATTERNS.forEach(pattern => {
        filtered = filtered.replace(pattern, '***');
    });

    return filtered;
};
