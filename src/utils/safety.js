/**
 * KOZA Safety Utility
 * Handles crisis detection, content filtering, and mandatory disclaimers.
 */

const CRISIS_KEYWORDS = [
    // English keywords for safety interception
    'self harm', 'suicide', 'want to die', 'kill myself',
    'stab', 'with gun', 'hang myself', 'poison',
    // High-risk violence
    'kill someone', 'want to hurt'
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
            message: "This platform is for educational purposes. If you feel in danger to yourself or others, please seek professional help immediately or call emergency services (e.g., 911)."
        };
    }

    return { isCrisis: false };
};

export const SAFETY_DISCLAIMER = "KOZA is an educational tool and does not replace professional psychological support.";

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
